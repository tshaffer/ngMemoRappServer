import express from 'express';
const usersRouter = express.Router();

import {
  createUser,
} from '../controllers/testEndpoints';

// test endpoints
usersRouter.post('/user', createUser);

export default usersRouter;
