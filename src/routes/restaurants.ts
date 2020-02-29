import express from 'express';
const restaurantsRouter = express.Router();

import {
  createRestaurant,
  createRestaurantCategory,
  createRestaurantReview,
  createRestaurantVisitReview,
  getRestaurantByLocation,
  getRestaurantsByLatLng,
  updateRestaurant,
  getFilteredRestaurants,
} from '../controllers/testEndpoints';

// test endpoints
restaurantsRouter.get('/restaurants/:latitude/:longitude', getRestaurantByLocation);
restaurantsRouter.get('/restaurants/', getRestaurantsByLatLng);

restaurantsRouter.post('/restaurant', createRestaurant);
restaurantsRouter.post('/restaurantCategory', createRestaurantCategory);
restaurantsRouter.post('/restaurantReview', createRestaurantReview);
restaurantsRouter.post('/restaurantVisitReview', createRestaurantVisitReview);
restaurantsRouter.post('/filteredRestaurants', getFilteredRestaurants);

restaurantsRouter.patch('/restaurant/:id', updateRestaurant);

export default restaurantsRouter;
