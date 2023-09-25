import { Request, Response } from 'express';
import user from '../controller/db/user';
import bcrypt from 'bcrypt';
import { Role, User } from '../model/user';
import jsonwebtoken from 'jsonwebtoken';


// Controller function to create a new user
const createUser = (req: Request, res: Response) => {
  // get the user data from body
  const { username, password, email, firstName, lastName, role } = req.body;
  if (!username || !password || !email || !firstName || !lastName || !role) {
    return res.status(400).send({
      message: 'Username, password, email, firstName, lastName and role are required'
    })
  }
  // hash the password
  bcrypt.hash(password, 10).then((hash: string) => {
    // create a user object
    const u: User = {
      username: username,
      hashed_password: hash,
      email: email,
      firstname: firstName,
      lastname: lastName,
      role: role,
    }
    // save the user object to database
    user.insertUser(u).then((result: boolean) => {
      res.status(200).send({
        message: 'OK',
        result: result
      })
    }).catch((err: { code: unknown; }) => {
      console.log(err);
      res.status(500).send({
        message: 'Error while creating user',
        error: err.code
      })
    })
  })
}

const authenticateUser = (req: Request, res: Response) => {

  const { username, password } = req.body;
  user.selectUserByUsername(username).then((result: User) => {
    bcrypt.compare(password, result.hashed_password).then((ok: boolean) => {
      if (ok) {
        // create a jwt token
        const accessToken = generateAccessToken(username, result.id!);
        res.status(200).send({
          message: 'OK',
          accessToken: accessToken,
          role: result.role
        })
      } else {
        res.status(401).send({
          message: 'Unauthorized',
          result: ok
        })
      }
    })
  }).catch((err: { code: unknown; }) => {
    console.log(err);
    res.status(401).send({
      message: 'Error while authenticating user',
      error: err.code
    })
  })
}
const logout = (req: Request, res: Response) => {
  const { username, id } = req.body;
  generateAccessToken(username, id);
  res.status(200).send({
    message: 'OK',
  })
}

const getAllEmployees = (req: Request, res: Response) => {
  const { id } = req.body;
  user.selectUserById(id).then((user) => {
    if (user.role !== Role.ADMIN) {
      return res.status(400).send({
        message: 'Only admin can get all employees'
      })
    }
  }).catch((err: { code: unknown; }) => {
    res.status(500).send({
      message: 'Error while getting employees',
      error: err.code
    })
  });
  user.selectAllEmployees().then((result: User[]) => {
    res.status(200).send({
      message: 'OK',
      result: result
    })
  }).catch((err: { code: unknown; }) => {
    console.log(err);
    res.status(500).send({
      message: 'Error while getting employees',
      error: err.code
    })
  })
};

const generateAccessToken = (username: string, id: number) => {
  return jsonwebtoken.sign({ username: username, id: id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '60m' });
}
export default { createUser, authenticateUser, logout, getAllEmployees };
