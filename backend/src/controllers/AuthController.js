const authService = require('../services/AuthService');

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body || {};
      const result = await authService.authenticateAdmin(email, password);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async me(req, res) {
    return res.json({ user: req.user });
  }
}

module.exports = new AuthController();
