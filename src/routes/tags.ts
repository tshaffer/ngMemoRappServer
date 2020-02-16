import express from 'express';
const tagsRouter = express.Router();

import {
  createTag,
  createTagInstance,
} from '../controllers/testEndpoints';

// test endpoints
tagsRouter.post('/tag', createTag);
tagsRouter.post('/tagInstance', createTagInstance);

export default tagsRouter;
