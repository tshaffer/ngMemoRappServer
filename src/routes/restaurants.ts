import express from 'express';
const restaurantsRouter = express.Router();

import {
  createRestaurant,
  createRestaurantCategory,
  getRestaurantByLocation,
  updateRestaurant,
  getRestaurantsByLatLng,
} from '../controllers/testEndpoints';

// test endpoints
restaurantsRouter.get('/restaurants/:latitude/:longitude', getRestaurantByLocation);
restaurantsRouter.get('/restaurants/', getRestaurantsByLatLng);
restaurantsRouter.post('/restaurant', createRestaurant);
restaurantsRouter.post('/restaurantCategory', createRestaurantCategory);
restaurantsRouter.patch('/restaurant/:id', updateRestaurant);

export default restaurantsRouter;
