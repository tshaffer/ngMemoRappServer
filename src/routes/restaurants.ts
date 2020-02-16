import express from 'express';
const restaurantsRouter = express.Router();

import {
  createRestaurant,
  createRestaurantCategory,
} from '../controllers/testEndpoints';

// test endpoints
restaurantsRouter.post('/restaurant', createRestaurant);
restaurantsRouter.post('/restaurantCategory', createRestaurantCategory);

export default restaurantsRouter;
