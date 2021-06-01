const bcrypt = require('bcryptjs');

/**
 * Hash a password
 * @param {string} password - Password from request body
 * @returns {string} A hashed password
 */
exports.hashPassword = (password) => {
  const saltRounds = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, saltRounds);
  return hash;
};

exports.compare = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};
