// users-repository.js
const { User } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getUsers() {
  return User.find({});
}

async function getUsersByField(field, value, sortFieldName, sortOrder) {
  let query = {};

  // Atur nilai pengurutan jika 'asc' atau 'desc'
  if (value === 'asc') {
    value = 1;
  } else if (value === 'desc') {
    value = -1;
  }

  // Validasi field
  if (field === 'name' || field === 'email') {
    query[field] = value;
  } else {
    throw new Error('Invalid field');
  }

  // Panggil User.find dengan query yang telah dibuat
  let users = await User.find(query);

  // Nilai Default Sort
  if (!sortFieldName || !sortOrder) {
    sortFieldName = 'email';
    sortOrder = 'asc';
  }

  // Jika ada kriteria pengurutan, lakukan pengurutan
  if (sortFieldName && sortOrder) {
    users = users.sort((a, b) => {
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
  getUsersByField,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
};
