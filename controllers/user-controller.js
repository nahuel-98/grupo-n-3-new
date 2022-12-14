const createHttpError = require("http-errors");
const { User } = require("../database/models");
const { endpointResponse } = require("../helpers/success");
const { catchAsync } = require("../helpers/catchAsync");
const { ErrorObject } = require("../helpers/error");
const { Security } = require("../config/security");
const { response } = require("express");
const createUrlPreviousAndNext = require("../utils/create-url-previous-next");
const { JWT } = require("../config/jwt");

module.exports = {
  allUsers: catchAsync(async (req, res, next) => {
    try {
      const limit = 10;
      const page = Number(req.query.page) || 0;
      let [response, countPages] = await Promise.all([
        User.findAll({
          attributes: ["firstname", "lastname", "email", "createdAt"],
          limit,
          offset: page * limit,
        }),

        User.count(),
      ]);

      const options = createUrlPreviousAndNext(limit, countPages, page, req);

      endpointResponse({
        res,
        code: response.length !== 0 ? 200 : 404,
        message: "User retrieved successfully",
        body: JWT.encode({response}),
        options: options,
      });
    } catch (error) {
      const httpError = createHttpError(
        error.statusCode,
        `[Error retrieving /users] - [user - GET]: ${error.message}`
      );
      next(httpError);
    }
  }),
  idUser: catchAsync(async (req, res, next) => {
    try {
      const response = await User.findByPk(req.params.id);
      endpointResponse({
        res,
        message: "User retrieved successfully",
        body: JWT.encode({response}),
      });
    } catch (error) {
      const httpError = createHttpError(
        error.statusCode,
        `[Error retrieving /users/:id] - [user - GET]: ${error.message}`
      );
      next(httpError);
    }
  }),
  createUser: catchAsync(async (req, res, next) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      const encryptPassword = await Security.encryptPassword(password);
      const [response, created] = await User.findOrCreate({
        where: {
          email
        },
        defaults: {
          firstName,
          lastName,
          email,
          password: encryptPassword,
        }
      });
      endpointResponse({
        res,
        code: created ? 201 : 200,
        message: created ? "User created" : "Email provided already existing",
        body: JWT.encode({response}),
      });
    } catch (error) {
      const httpError = createHttpError(
        error.statusCode,
        `[Error retrieving /users] - [user - POST]: ${error.message}`
      );
      next(httpError);
    }
  }),

  editUser: catchAsync(async (req, res, next) => {
    try {
      const { firstName, lastName, email } = req.body;
      const id = req.params.id;

      await User.update(
        { firstName, lastName, email },
        {
          where: { id },
        }
      );
      const response = await User.findAll({
        where: { id },
        attributes: ["firstName", "lastName", "email"],
      });
      endpointResponse({
        res,
        message: "User edited",
        body: JWT.encode({response}),
      });
    } catch (error) {
      const httpError = createHttpError(
        error.statusCode,
        `[Error retrieving /users] - [user - PUT]: ${error.message}`
      );
      next(httpError);
    }
  }),
  deleteUser: catchAsync(async (req, res, next) => {
    try {
      const id = req.params.id;
      await User.destroy({
        where: { id: id },
      });
      endpointResponse({
        res,
        message: "User eliminated",
        body: JWT.encode({response}),
      });
    } catch (error) {
      const httpError = createHttpError(
        error.statusCode,
        `[Error retrieving /users/id] - [user - DELETED]: ${error.message}`
      );
      next(httpError);
    }
  }),
};