import express from 'express';
const tagsRouter = express.Router();

import {
  createTag,
  createRestaurantCategory,
} from '../controllers/testEndpoints';

// test endpoints
tagsRouter.post('/tag', createTag);
tagsRouter.post('/tagInstance', createRestaurantCategory);

export default tagsRouter;
