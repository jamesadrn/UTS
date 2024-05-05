const { User } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getUsers(searchparams, sortparams, page_number, page_size) {
  const count = await User.countDocuments(searchparams);

  const users = await User.find(searchparams)
    .sort(sortparams)
    .skip(page_number)
    .limit(page_size);

  return {
    users,
    count,
  };
}

async function getUser(id) {
  return User.findById(id);
}

async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

async function getUserByEmail(email) {
  return User.findOne({ email });
}

async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
};
