const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers(
  searchFieldName,
  searchValue,
  sortFieldName,
  sortOrder,
  page_number = 1,
  page_size = 0
) {
  let searchparams = {};

  if (
    (searchFieldName === 'name' || searchFieldName === 'email') &&
    searchValue
  ) {
    let searchRegex = new RegExp(searchValue, 'i');
    searchparams[searchFieldName] = searchRegex;
  }

  if (!sortFieldName || !sortOrder) {
    sortFieldName = 'email';
    sortOrder = 'asc';
  }

  // Atur nilai pengurutan jika 'asc' atau 'desc'
  if (sortOrder === 'asc') {
    sortOrder = 1;
  } else if (sortOrder === 'desc') {
    sortOrder = -1;
  }
  let sortparams = {};
  sortparams[sortFieldName] = sortOrder;

  const { skip, limit } = getPageInfo(page_number, page_size);

  const { users, count } = await usersRepository.getUsers(
    searchparams,
    sortparams,
    skip,
    limit
  );

  const total_pages = Math.ceil(count / page_size);
  const has_previous_page = page_number <= total_pages && page_number > 1;
  const has_next_page = page_number < total_pages && page_number !== 0;

  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    results.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  console.log(users.length);

  return {
    page_number: page_number,
    page_size: page_size,
    count: count,
    total_pages: total_pages,
    has_previous_page: has_previous_page,
    has_next_page: has_next_page,
    data: results,
  };
}

//PAGINATION
function getPageInfo(page_number, page_size) {
  const skip = (page_number - 1) * page_size;

  const limit = page_size;

  return { skip, limit };
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

async function getProducts() {
  const products = await usersRepository.getProduct();

  const results = [];
  for (let i = 0; i < products.length; i += 1) {
    const product = products[i];
    results.push({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
    });
  }

  return results;
}

async function uploadProduct(product_name, product_price, product_description) {
  try {
    await usersRepository.uploadProduct(
      product_name,
      product_price,
      product_description
    );
  } catch (err) {
    return null;
  }
  return true;
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
  getProducts,
  uploadProduct,
  getPageInfo,
  emailIsRegistered,
  checkPassword,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
};
