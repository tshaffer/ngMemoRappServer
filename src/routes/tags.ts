import express from 'express';
const tagsRouter = express.Router();

import {
  createTag,
  createTaggedEntityRating,
} from '../controllers/testEndpoints';

// test endpoints
tagsRouter.post('/tag', createTag);
tagsRouter.post('/taggedEntityRating', createTaggedEntityRating);

export default tagsRouter;
