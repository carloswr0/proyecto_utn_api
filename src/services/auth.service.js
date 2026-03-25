import ServerError from "../helpers/error.helper.js";
import userRepository from "../repository/user.repository.js";
import mailerTransporter from "../config/mailer.config.js";
import ENVIRONTMENT from "../config/environment.config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

class AuthService {
  async register({ name, email, password }) {
    if (!name || !email || !password) {
      throw new ServerError("Name, email and password are required", 400);
    }
    const emailAlreadyInUse = await userRepository.getByEmail(email);

    if (emailAlreadyInUse) {
      throw new ServerError("Email already exists", 400);
    }
    const verify_email_token = jwt.sign(
      { email, name },
      ENVIRONTMENT.JWT_SECRET_KEY,
      { expiresIn: "24h" },
    );

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.sendVerificationEmail(email, name, verify_email_token);
    await userRepository.create(name, email, hashedPassword);
  }

  async login({ email, password }) {
    const user = await userRepository.getByEmail(email);
    if (!user) {
      throw new ServerError("User not found", 404);
    }

    if (!user.email_verified) {
      throw new ServerError("Email not verified", 401);
    }

    const isSamePassword = await bcrypt.compare(password, user.password);
    if (!isSamePassword) {
      throw new ServerError("Invalid credentials", 401);
    }

    const auth_token = jwt.sign(
      {
        email: user.email,
        name: user.name,
        id: user._id,
        email_verified: user.email_verified,
        created_at: user.created_at,
      },
      ENVIRONTMENT.JWT_SECRET_KEY,
      { expiresIn: "7d" },
    );

    return auth_token;
  }

  async sendVerificationEmail(email, name, verify_email_token) {
    await mailerTransporter.sendMail(
      {
        from: ENVIRONTMENT.MAIL_EMAIL,
        to: email,
        subject: "[Proyecto de ExpressNodeMongo] Verificacion de email",
        html: `
          <h1>Hola ${name}, bienvenido a nuestro proyecto de Express, Node y MongoDB</h1>
          <p>Gracias por registrarte en nuestro proyecto. Estamos emocionados de tenerte como parte de nuestra comunidad.</p>
          <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
          <p><a href="${ENVIRONTMENT.URL_FRONTEND}/verify-email?verify_email_token=${verify_email_token}">Click here to verify your email</a></p>
          <p>¡Disfruta de tu experiencia con nuestro proyecto!</p>
        `,
      },
      (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent successfully:", info.response);
        }
      },
    );
  }

  async verifyEmail({ verify_email_token }) {
    if (!verify_email_token) {
      throw new ServerError("Verification token is required", 400);
    }

    let decoded;

    try {
      decoded = jwt.verify(verify_email_token, ENVIRONTMENT.JWT_SECRET_KEY);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        const { email, name } = jwt.decode(verify_email_token);
        await sendVerificationEmail(email, name, verify_email_token);
        throw new ServerError("Verification token has expired", 400);
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new ServerError("Invalid verification token", 400);
      }
      throw new ServerError("Internal server error", 500);
    }

    const email = decoded.email;
    const user = await userRepository.getByEmail(email);

    if (!user) {
      throw new ServerError("User not found", 404);
    }

    if (user.email_verified) {
      throw new ServerError("Email already verified", 400);
    }

    await userRepository.updateById(user._id, { email_verified: true });

    return {
      message: "Email verified successfully",
      status: 200,
      ok: true,
    };
  }

  async resetPasswordRequest({ email }) {
    if (!email) {
      throw new ServerError("Email is required", 400);
    }
    try {
      const user = await userRepository.getByEmail(email);
      if (!user) {
        throw new ServerError("User not found", 404);
      }

      const reset_password_token = jwt.sign(
        { email },
        ENVIRONTMENT.JWT_SECRET_KEY,
        { expiresIn: "1d" },
      );

      await mailerTransporter.sendMail({
        from: ENVIRONTMENT.MAIL_EMAIL,
        to: email,
        subject: "Reset Password",
        html: `
            <h1> Reset Password</h1>
            <p>You have requested to reset your password. Click the link below to do so</p>
            <a href="${ENVIRONTMENT.URL_FRONTEND + `/reset-password?reset_password_token=${reset_password_token}`}">Click here to reset</a>
            <span>If you did not request this, please ignore this email.</span>
          `,
      });
    } catch (error) {
      if (error instanceof ServerError) {
        throw error;
      } else {
        throw new ServerError(
          "Error sending reset password email: " + error.message,
          500,
        );
      }
    }
  }

  async resetPassword({ reset_password_token, password }) {
    if (!reset_password_token || !password) {
      throw new ServerError("All fields are required", 400);
    }
    try {
      const { email } = jwt.verify(
        reset_password_token,
        ENVIRONTMENT.JWT_SECRET_KEY,
      );
      const user = await userRepository.getByEmail(email);
      if (!user) {
        throw new ServerError("User not found", 404);
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await userRepository.updateById(user._id, { password: hashedPassword });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new ServerError("Invalid password reset token", 400);
      } else if (error instanceof jwt.TokenExpiredError) {
        throw new ServerError("Password reset token has expired", 400);
      }
      throw error;
    }
  }
}

const authService = new AuthService();

export default authService;
