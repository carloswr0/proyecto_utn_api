import userRepository from "../repository/user.repository.js";

class HealthController {
  getApiHealth(req, res) {
    res.status(200).json({
      message: "API is healthy",
      status: 200,
      ok: true,
    });
  }

  async getDbHealth(req, res) {
    try {
      const user = await userRepository.getOneUserToCheckDBHealth();
      res.status(200).json({
        message: "Database is healthy",
        status: 200,
        ok: true,
        user: user,
      });
    } catch (error) {
      console.log("Error checking database health: ", error);
      res.status(500).json({
        message: "Database is not healthy",
        status: 500,
        ok: false,
        error: error.message,
      });
    }
  }
  
}

export default HealthController;
