const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');
const { getAllUsers } = require('./users-controller');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers() {
  const users = await usersRepository.getUsers();

  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    results.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  return results;
}

async function getUsersByField(field, value, sortFieldName, sortOrder) {
  let users;

  // Panggil repository untuk mendapatkan pengguna berdasarkan kriteria
  users = await usersRepository.getUsersByField(field, value);

  // Nilai Default Sort
  if (!sortFieldName || !sortOrder) {
    sortFieldName = 'email';
    sortOrder = 'asc';
  }

  // Jika ada kriteria pengurutan, lakukan pengurutan
  if (sortFieldName && sortOrder) {
    users.sort((a, b) => {
      if (a[sortFieldName] < b[sortFieldName]) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (a[sortFieldName] > b[sortFieldName]) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  // Sederhanakan pembuatan objek hasil
  const results = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
  }));

  return results;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  if (!user) {
    throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'User not found');
  }

  const success = await usersRepository.updateUser(id, name, email);
  if (!success) {
    throw errorResponder(
      errorTypes.UNPROCESSABLE_ENTITY,
      'Failed to update user'
    );
  }

  return true;
}

async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  if (!user) {
    throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'User not found');
  }

  const success = await usersRepository.deleteUser(id);
  if (!success) {
    throw errorResponder(
      errorTypes.UNPROCESSABLE_ENTITY,
      'Failed to delete user'
    );
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

async function changePassword(id, password) {
  const user = await usersRepository.getUser(id);

  if (!user) {
    throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'User not found');
  }

  const hashedPassword = await hashPassword(password);
  const changeSuccess = await usersRepository.changePassword(
    id,
    hashedPassword
  );

  if (!changeSuccess) {
    throw errorResponder(
      errorTypes.UNPROCESSABLE_ENTITY,
      'Failed to change password'
    );
  }

  return true;
}

module.exports = {
  emailIsRegistered,
  checkPassword,
  getUsers,
  getAllUsers,
  getUsersByField,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
};
