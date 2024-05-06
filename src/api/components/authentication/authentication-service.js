const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');

const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_RESET_TIME_MINUTES = 30;
const loginAttempts = new Map();

async function checkLoginCredentials(email, password) {
  const user = await authenticationRepository.getUserByEmail(email);

  if (loginAttempts.has(email)) {
    const { attempts, loginTerakhir } = loginAttempts.get(email);
    const now = Date.now();
    const waktu = now - loginTerakhir;
    const menitTunggu = Math.floor(waktu / (1000 * 60));

    if (
      attempts >= MAX_LOGIN_ATTEMPTS &&
      menitTunggu < LOGIN_RESET_TIME_MINUTES
    ) {
      return {
        attempts: 'Limit reached',
        message:
          'Attempts limit reached, try again in ' +
          (30 - menitTunggu) +
          ' minutes',
      };
    } else if (menitTunggu >= LOGIN_RESET_TIME_MINUTES) {
      loginAttempts.delete(email);
    }
  }

  const userPassword = user.password;
  const passwordChecked = await passwordMatched(password, userPassword);

  if (user && passwordChecked) {
    loginAttempts.delete(email);

    return {
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
    };
  } else if (loginAttempts.has(email)) {
    const attempts = loginAttempts.get(email).attempts + 1;
    const loginTerakhir = Date.now();
    loginAttempts.set(email, {
      attempts,
      loginTerakhir,
    });
  } else if (!loginAttempts.has(email)) {
    const attempts = 1;
    const loginTerakhir = Date.now();
    loginAttempts.set(email, {
      attempts,
      loginTerakhir,
    });
  }
  return null;
}

function checkDataPercobaan(email) {
  const attempts = loginAttempts.get(email);

  if (attempts) {
    return attempts.attempts;
  } else {
    return 1;
  }
}

module.exports = { checkLoginCredentials, checkDataPercobaan };
