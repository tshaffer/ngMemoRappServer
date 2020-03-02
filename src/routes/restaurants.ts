import express from 'express';
const restaurantsRouter = express.Router();

import {
  createRestaurant,
  createRestaurantCategory,
  getRestaurantByLocation,
  getRestaurantsByLatLng,
  updateRestaurant,
  getFilteredRestaurants,
  getRestaurantByYelpId,
} from '../controllers/testEndpoints';

// test endpoints
restaurantsRouter.get('/restaurants/:latitude/:longitude', getRestaurantByLocation);
restaurantsRouter.get('/restaurants/', getRestaurantsByLatLng);
restaurantsRouter.get('/restaurantsByYelpId/:yelpId', getRestaurantByYelpId);

restaurantsRouter.post('/restaurant', createRestaurant);
restaurantsRouter.post('/restaurantCategory', createRestaurantCategory);
restaurantsRouter.post('/filteredRestaurants', getFilteredRestaurants);

restaurantsRouter.patch('/restaurant/:id', updateRestaurant);

export default restaurantsRouter;
