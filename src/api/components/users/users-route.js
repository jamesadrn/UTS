const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const usersControllers = require('./users-controller');
const usersValidator = require('./users-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/users', route);

  //Get List of Users
  route.get('/', authenticationMiddleware, async (request, response, next) => {
    try {
      const searchQuery = request.query.search;
      const sortOption = request.query.sort;
      let users;

      // SEARCHING AND SORTING
      if (searchQuery || sortOption) {
        let searchFieldName, searchValue, sortFieldName, sortOrder;

        // SEARCHING
        if (searchQuery) {
          [searchFieldName, searchValue] = searchQuery.split(':');
        }

        // SORTING
        if (sortOption) {
          [sortFieldName, sortOrder] = sortOption.split(':');
        }

        // Panggil controller untuk mendapatkan pengguna berdasarkan kriteria pencarian dan pengurutan
        users = await usersControllers.getUsers(
          searchFieldName,
          searchValue,
          sortFieldName,
          sortOrder
        );
      } else {
        // Jika tidak ada query pencarian atau pengurutan, ambil semua pengguna
        users = await usersControllers.getAllUsers();
      }

      return response.status(200).json(users);
    } catch (error) {
      return next(error);
    }
  });

  // Create user
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(usersValidator.createUser),
    usersControllers.createUser
  );

  // Get user detail
  route.get('/:id', authenticationMiddleware, usersControllers.getUser);

  // Update user
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(usersValidator.updateUser),
    usersControllers.updateUser
  );

  // Delete user
  route.delete('/:id', authenticationMiddleware, usersControllers.deleteUser);

  // Change password
  route.post(
    '/:id/change-password',
    authenticationMiddleware,
    celebrate(usersValidator.changePassword),
    usersControllers.changePassword
  );
};
