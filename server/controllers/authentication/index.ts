import { Request, Response, NextFunction } from "express";
import HasuraService from "../../services/hasura/index";
import HasuraQueries from "../../helpers/hasura queries/queries";
import HasuraMutation from "../../helpers/hasura queries/mutation";
import crypto, { BinaryLike } from "crypto";
import jwt from "jsonwebtoken";
require("dotenv").config();
class AuthenticationController {
  private static instance: AuthenticationController;
  private constructor() {}
  public static getInstance(): AuthenticationController {
    if (!AuthenticationController.instance) {
      this.instance = new AuthenticationController();
    }
    return this.instance;
  }
  private static generateToken = (data: { id: String; email: String }) => {
    let token = jwt.sign(data, process.env.TOKEN_KEY ?? "", {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY_TIME,
    });
    return token;
  };

  private static async getUserDetailsByEmail(email: String) {
    try {
      let response = await HasuraService.query(
        HasuraQueries.findUserByEmail(email)
      );

      let user: Array<{
        id: String;
        email: String;
        hash: String;
        salt: String;
        user_name: String;
      }> = response["users"] || [];
      return user;
    } catch (e) {
      throw new Error("something went wrong");
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      let { email, password } = req.body;
      let user = await AuthenticationController.getUserDetailsByEmail(email);
      if (user.length == 0) {
        throw Error("user does not exist");
      } else {
        let hash = crypto
          .pbkdf2Sync(password, user[0].salt as BinaryLike, 1000, 64, `sha512`)
          .toString(`hex`);
        if (hash != user[0].hash) {
          throw new Error("invaild password");
        }
        let userResponse = {
          id: user[0].id,
          email: user[0].email,
          user_name: user[0].user_name,
        };

        let id = userResponse.id;
        let tokenData = { id, email };

        res.json({
          ...userResponse,
          token: AuthenticationController.generateToken(tokenData),
        });
      }
    } catch (e: any) {
      if (
        (e.message as String).includes(
          "Uniqueness violation. duplicate key value violates unique constraint "
        )
      ) {
        e.message = "user name is not unique";
      }
      res.status(401).json({
        error: e.message || "something went wrong",
      });
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      let { email, password, user_name } = req.body;
      const user = await AuthenticationController.getUserDetailsByEmail(email);
      if (user.length != 0) {
        throw new Error("user alredy registred");
      }
      let salt = crypto.randomBytes(16).toString("hex");
      let hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
        .toString(`hex`);
      let response = await HasuraService.query(
        HasuraMutation.addUser(email, hash, salt, user_name)
      );
      let id = response["insert_users_one"]["id"];
      let tokenData = { id, email };

      res.json({
        ...response["insert_users_one"],
        token: AuthenticationController.generateToken(tokenData),
      });
    } catch (e: any) {
      if (
        (e.message as String).includes(
          "Uniqueness violation. duplicate key value violates unique constraint "
        )
      ) {
        e.message = "user name is not unique";
      }
      res.status(401).json({
        error: e.message || "something went wrong",
      });
    }
  }
}

export default AuthenticationController.getInstance();
