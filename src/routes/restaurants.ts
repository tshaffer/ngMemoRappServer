import express from 'express';
const restaurantsRouter = express.Router();

import {
  createRestaurant,
  createRestaurantCategory,
  getRestaurantByLocation,
  updateRestaurant,
} from '../controllers/testEndpoints';

// test endpoints
restaurantsRouter.get('/restaurants', getRestaurantByLocation);
restaurantsRouter.post('/restaurant', createRestaurant);
restaurantsRouter.post('/restaurantCategory', createRestaurantCategory);
restaurantsRouter.patch('/restaurant/:id', updateRestaurant);

export default restaurantsRouter;
