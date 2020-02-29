import { Request, Response } from 'express';
import Restaurant from '../models/Restaurant';
import RestaurantCategory from '../models/RestaurantCategory';
import Tag from '../models/Tag';
import TaggedEntityRating from '../models/TaggedEntityRating';
import User from '../models/User';
import { fetchYelpBusinessDetails, fetchYelpBusinessByLocation } from './yelp';
import RestaurantReview from '../models/RestaurantReview';

// users
export function createUser(request: Request, response: Response, next: any) {
  console.log('createUser');
  console.log(request.body);
  User.create(request.body).then((user: any) => {
    response.status(201).json({
      success: true,
      data: user,
    });
  });
}

export function updateUser(request: Request, response: Response, next: any) {
  console.log('updateUser');
  console.log(request.body);

  User.findById(request.params.id, (err, user) => {
    if (request.body._id) {
      delete request.body._id;
    }
    for (const b in request.body) {
      if (request.body.hasOwnProperty(b)) {
        (user as any)[b] = request.body[b];
      }
    }
    user.save();
    response.json(user);
  });
}

// tags
export function createTag(request: Request, response: Response, next: any) {
  console.log('createTag');
  console.log(request.body);
  Tag.create(request.body).then((tag: any) => {
    response.status(201).json({
      success: true,
      data: tag,
    });
  });
}

// tag entity ratings
export function createTaggedEntityRating(request: Request, response: Response, next: any) {
  console.log('createTaggedEntityRating');
  console.log(request.body);
  TaggedEntityRating.create(request.body).then((taggedEntityRating: any) => {
    response.status(201).json({
      success: true,
      data: taggedEntityRating,
    });
  });
}

// restaurants
export function createRestaurant(request: Request, response: Response, next: any) {
  console.log('createRestaurant');
  console.log(request.body);
  Restaurant.create(request.body).then((restaurant: any) => {
    response.status(201).json({
      success: true,
      data: restaurant,
    });
  });
}

export function updateRestaurant(request: Request, response: Response, next: any) {
  console.log('updateRestaurant');
  console.log(request.body);

  Restaurant.findById(request.params.id, (err, restaurant) => {
    if (request.body._id) {
      delete request.body._id;
    }
    for (const b in request.body) {
      if (request.body.hasOwnProperty(b)) {
        (restaurant as any)[b] = request.body[b];
      }
    }
    restaurant.save();
    response.json(restaurant);
  });
}

// restaurant categories
export function createRestaurantCategory(request: Request, response: Response, next: any) {
  console.log('createRestaurantCategory');
  console.log(request.body);
  RestaurantCategory.create(request.body).then((restaurantCategory: any) => {
    response.status(201).json({
      success: true,
      data: restaurantCategory,
    });
  });
}

// restaurant reviews
export function createRestaurantReview(request: Request, response: Response, next: any) {
  console.log('createRestaurantReview');
  console.log(request.body);
  RestaurantReview.create(request.body).then((restaurantReview: any) => {
    response.status(201).json({
      success: true,
      data: restaurantReview,
    });
  });
}

// restaurant visit reviews
export function createRestaurantVisitReview(request: Request, response: Response, next: any) {
}

// queries
export function getRestaurantByLocation(request: Request, response: Response): Promise<any> {

  console.log('request.params:');
  console.log(request.params);

  const latitude: number = parseFloat(request.params.latitude);
  const longitude: number = parseFloat(request.params.longitude);

  console.log('latitude: ', latitude);
  console.log('longitude: ', longitude);

  // return fetchYelpBusinessDetails().then( (responseData: any) => {
  //   response.json(responseData);
  // });
  return fetchYelpBusinessByLocation(latitude, longitude).then( (responseData: any) => {
    response.json(responseData);
  });
}

export function getRestaurantsByLatLng(request: Request, response: Response): Promise<any> {

  console.log('request.query:');
  console.log(request.query);

  return fetchYelpBusinessByLocation(request.query.latitude, request.query.longitude).then( (responseData: any) => {
    return response.json(responseData);
  });
}

export function getFilteredRestaurants(request: Request, response: Response, next: any) {

  console.log('getFilteredRestaurants');
  console.log(request.body);

  response.status(201).json({
    success: true,
  });

}

