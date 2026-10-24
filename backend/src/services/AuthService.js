const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/UserRepository');

const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  throw new Error('JWT_SECRET wajib didefinisikan di environment');
}

class AuthService {
  async authenticateAdmin(email, password) {
    if (!email || !password) {
      const err = new Error('Email dan password wajib diisi');
      err.status = 400;
      throw err;
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      const err = new Error('Kredensial tidak valid');
      err.status = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      const err = new Error('Kredensial tidak valid');
      err.status = 401;
      throw err;
    }

    if (user.role !== 'ADMIN') {
      const err = new Error('Hanya akun administrator yang diizinkan mengakses panel ini');
      err.status = 403;
      throw err;
    }

    // Token JWT berlaku 12 jam untuk kenyamanan operasional admin
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      SECRET,
      { expiresIn: '12h' }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }
}

module.exports = new AuthService();
