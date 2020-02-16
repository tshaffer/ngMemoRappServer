import express from 'express';
const usersRouter = express.Router();

import {
  createUser,
  updateUser,
} from '../controllers/testEndpoints';

// test endpoints
usersRouter.post('/user', createUser);
usersRouter.patch('/user/:id', updateUser);

export default usersRouter;
