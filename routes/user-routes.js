const express = require("express");
const {
  allUsers,
  idUser,
  createUser,
  editUser,
  deleteUser,
} = require("../controllers/user-controller");
const validate = require("../middlewares/validator");
const userSchema = require("../schemas/userSchema");
const checkUserId = require("../middlewares/checkUserId");
const { ownership, auth } = require("../middlewares");

const router = express.Router();
/**
 *
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        firstName:
 *          type: string
 *        lastName:
 *          type: string
 *        email:
 *          type: string       
 *        password:
 *          type: string 
 *        avatar:
 *          type: string
 *        roleId:
 *          type: number                
 *      required:
 *        - firstName
 *        - lastName
 *        - email
 *        - password
 *        - avatar
 *        - roleId
 *      example:
 *        firstName: Juan
 *        lastName: Diaz
 *        email: juandiaz@email.com
 *        password: abcabc
 *        avatar: avatar_example
 *        roleId: 1
 */

/**
 * @swagger
 * /users:
 *  get:
 *    summary: All Users
 *    tags: [User]
 *    parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *        required: true
 *        description: Access Token
 *    responses:
 *      200:
 *        description: All Users.
 *        content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/User'
 *      400:
 *        description: invalid token.
 *      403:
 *        description: the record does not belong to you or User not logged in.
 *
 */
 router.get("", auth(), allUsers);
/**
 * @swagger
 * /users/{id}:
 *  get:
 *    summary: User by id
 *    tags: [User]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          required: true
 *          description: User Id
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *        required: true
 *        description: Access Token
 *    responses:
 *      200:
 *        description: User.
 *        content:
 *            application/json:
 *              schema:
 *                type: object
 *                $ref: '#/components/schemas/User'
 *      400:
 *        description: invalid token.
 *      401:
 *        description: invalid id.
 *      403:
 *        description: the record does not belong to you or User not logged in.
 *      404:
 *        description: User not found
 *
 */
 router.get("/:id",
 [
   checkUserId,
   auth(),
   ownership()
 ],
 idUser
);
/**
 * @swagger
 * /users:
 *  post:
 *    summary: Create User
 *    tags: [User]
 *    parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *        required: true
 *        description: Access Token
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: "#/components/schemas/User"
 *    responses:
 *      200:
 *        description: User created.
 *      400:
 *        description: invalid token.
 *      403:
 *        description: the record does not belong to you or User not logged in.
 *
 */
 router.post("", validate(userSchema), createUser);
/**
 * @swagger
 * /users/{id}:
 *  patch:
 *    summary: Edit User
 *    tags: [User]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          required: true
 *          description: User Id
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *        required: true
 *        description: Access Token
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              firstName:
 *                type: string
 *              lastName:
 *                type: string
 *              email:
 *                type: string       
 *              password:
 *                type: string 
 *              avatar:
 *                type: string
 *              roleId:
 *                type: number 
 *    responses:
 *      200:
 *        description: User edited.
 *      400:
 *        description: invalid token.
 *      403:
 *        description: the record does not belong to you or User not logged in.
 *      404:
 *        description: User not found
 *
 */

 router.patch("/:id",
 [
   checkUserId,
   validate(userSchema),
   auth(),
   ownership()
 ],
 editUser
);
/**
 * @swagger
 * /users/{id}:
 *  delete:
 *    summary: Delete User
 *    tags: [User]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *          required: true
 *          description: User Id
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *        required: true
 *        description: Access Token
 *    responses:
 *      200:
 *        description: User eliminated.
 *      400:
 *        description: invalid token.
 *      403:
 *        description: the record does not belong to you or User not logged in.
 *      404:
 *        description: User not found
 *
 */
router.delete("/:id",
  [
    checkUserId,
    auth(),
    ownership()
  ],
  deleteUser
);


module.exports = router;