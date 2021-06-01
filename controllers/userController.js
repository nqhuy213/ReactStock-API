const {hashPassword, compare} = require('../utils/hashPassword');
const {generateToken} = require('../utils/token');
const errors = require('../utils/error');
/**
 * Create new user account
 * @endpoint - /user/register
 */
exports.register = (req, res, next) => {
  const body = req.body;
  if (!body.email || !body.password) {
    res
      .status(errors.registerIncomplete.code)
      .json({error: true, message: errors.registerIncomplete.message});
  } else {
    /* Check if the account already exist */
    const {email, password} = body;
    req.db
      .from('users')
      .select('*')
      .where({email: email})
      .then((rows) => {
        /* User existed */
        if (rows.length > 0) {
          console.log(rows);
          res
            .status(errors.userExisted.code)
            .json({error: true, message: errors.userExisted.message});
        } else {
        /* Create new user */
          const hashed = hashPassword(password);
          req
            .db('users')
            .insert({email: email, password: hashed})
            .then((result) => {
              res.status(201).json({success: true, message: 'User created'});
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res
          .status(errors.dbError.code)
          .json({error: true, message: errors.dbError.message});
      });
  }
};

/**
 * Log in to existing account
 * @endpoint - /user/login
 */
exports.login = (req, res, next) => {
  const body = req.body;
  if (!body.email || !body.password) {
    res
      .status(errors.loginIncomplete.code)
      .json({error: true, message: errors.loginIncomplete.message});
  } else {
    req.db
      .from('users')
      .select('*')
      .where({email: body.email})
      .then((rows) => {
        /* Account not exist */
        if (rows.length === 0) {
          res
            .status(errors.emailNotFound.code)
            .json({error: true, message: errors.emailNotFound.message});
        } else {
          const user = rows[0];
          /* Incorrect password */
          if (!compare(body.password, user.password)) {
            res
              .status(errors.incorrectPassword.code)
              .json({error: true, message: errors.incorrectPassword.message});
          } else {
            /* Valid credentials */
            const token = generateToken(user.email);
            res.status(200).json({
              token_type: 'Bearer',
              ...token,
            });
          }
        }
      })
      .catch((err) => {
        res
          .status(errors.dbError.code)
          .json({error: true, message: errors.dbError.message});
      });
  }
};
