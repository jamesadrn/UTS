// authentication-controller.js
const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

const MAX_LOGIN_ATTEMPTS = 5;

async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      const dataPercobaan =
        await authenticationServices.checkDataPercobaan(email);
      if (dataPercobaan === MAX_LOGIN_ATTEMPTS) {
        throw errorResponder(
          errorTypes.INVALID_CREDENTIALS,
          `User ${email} gagal login. Attempt: ${dataPercobaan}. LIMIT REACHED!`
        );
      }
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        `User ${email} gagal login. Attempt : ${dataPercobaan}`
      );
    }

    if (loginSuccess.attempts >= 6) {
      const menitTunggu = loginSuccess.reset;
      throw errorResponder(
        errorTypes.FORBIDDEN,
        `Too many attempts, try again in ${menitTunggu} minutes`
      );
    }
    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
