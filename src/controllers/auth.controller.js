import ServerError from "../helpers/error.helper.js";
import authService from "../services/auth.service.js";

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      await authService.register({ name, email, password });
      res.status(201).json({
        message: "User registered successfully. Please check your email to verify your account.",
        status: 201,
        ok: true,
      });
    } catch (error) {
      // Errores esperables // Manejables // Culpa del cliente
      if (error instanceof ServerError) {
        return res.status(error.status).json({
          message: error.message,
          status: error.status,
          ok: false,
        });
      }
      // Error inesperado // No manejable // Culpa del servidor
      return res.status(500).json({
        message: "Internal server error",
        status: 500,
        ok: false,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const auth_token = await authService.login({ email, password });

      return res.status(200).json({
        message: "Login successful",
        status: 200,
        ok: true,
        data: {
          auth_token,
        },
      });
    } catch (error) {
      if (error instanceof ServerError) {
        return res.status(error.status).json({
          message: error.message,
          status: error.status,
          ok: false,
        });
      }
      return res.status(500).json({
        message: error.message || "Internal server error",
        status: 500,
        ok: false,
      });
    }
  }

  async verifyEmail(req, res) {
    try {
      const { verify_email_token } = req.query;
      await authService.verifyEmail({ verify_email_token });

      return res.status(200).json({
        message: "Email verified successfully",
        status: 200,
        ok: true,
      });
    } catch (error) {
      if (error instanceof ServerError) {
        return res.status(error.status).json({
          message: error.message,
          status: error.status,
          ok: false,
        });
      }
      return res.status(500).json({
        message: error.message || "Internal server error",
        status: 500,
        ok: false,
      });
    }
  }

  async resetPasswordRequest(req, res) {
    try {
      const { email } = req.body;
      await authService.resetPasswordRequest({ email });
      return res.status(200).json({
        ok: true,
        status: 200,
        message:
          "A mail has been sent to your email address with instructions to reset your password",
      });
    } catch (error) {
      if (error instanceof ServerError) {
        return res.status(error.status).json({
          ok: false,
          status: error.status,
          message: error.message,
        });
      }
      return res.status(500).json({
        ok: false,
        status: 500,
        message: "Error requesting password reset",
      });
    }
  }

  async resetPassword(req, res) {
    try {
      const { reset_password_token } = req.query;
      const { password } = req.body;

      await authService.resetPassword({ reset_password_token, password });
      return res.status(200).json({
        ok: true,
        status: 200,
        message: "Password reset successfully ",
      });
    } catch (error) {
      if (error instanceof ServerError) {
        return res.status(error.status).json({
          ok: false,
          status: error.status,
          message: error.message,
        });
      }
      return res.status(500).json({
        ok: false,
        status: 500,
        message: "Error resetting password",
      });
    }
  }
}

export default AuthController;
