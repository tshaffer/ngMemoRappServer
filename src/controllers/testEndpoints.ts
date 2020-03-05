import { Request, Response } from 'express';
import Restaurant from '../models/Restaurant';
import User from '../models/User';
import { fetchYelpBusinessDetails, fetchYelpBusinessByLocation } from './yelp';
import { Document } from 'mongoose';
// import { RestaurantType, TagValueRequest } from '../types';
import RestaurantCategory from '../models/RestaurantCategory';
import MenuItem from '../models/MenuItem';

import { UserEntity } from '../types';
import { createUserDocument } from './dbInterface';

// users
/*  POST
    {{URL}}/api/v1/user
    Body
      {
        "name": "Ted",
        "password": "letMeIn"
        "email": "ted@pizza.com"
      }
*/
export function createUser(request: Request, response: Response, next: any) {
  console.log('createUser');
  console.log(request.body);
  const { userName, password, email } = request.body;
  const userEntity: UserEntity = {
    userName,
    password,
    email,
  };
  createUserDocument(userEntity)
    .then((userDoc) => {
      const userDocument = userDoc as Document;
      console.log('added userDocument');
      console.log(userDocument);
      console.log(userDocument.toObject());

      response.status(201).json({
        success: true,
        data: userDocument,
      });
    });
}

/*  PATCH
    {{URL}}/api/v1/user/<userId>
    Body
    {
    	"password": "letMeIn69"
    }
*/
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

// MENU ITEMS

/*  POST
    {{URL}}/api/v1/menuItem
    Body
      {
        "menuItemName": "Meatball Sandwich",
        "description": "<whatever>" (optional)
      }
*/
export function createMenuItem(request: Request, response: Response, next: any) {
  console.log('createMenuItem');
  console.log(request.body);
  MenuItem.create(request.body).then((menuItem: any) => {
    response.status(201).json({
      success: true,
      data: menuItem,
    });
  });
}

// RESTAURANT CATEGORIES

/* POST
    {{URL}}/api/v1/menuItem
    Body
      {
        "menuItemName": "Meatball Sandwich",
        "description": "<whatever>" (optional)
      }
*/
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


// RESTAURANTS
/*  POST
    {{URL}}/api/v1/restaurant
    Body
    {
      "name": "La Costeña",
      "category": "Burritos"
    }
*/
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

/*  PATCH
    {{URL}}/api/v1/restaurant/<restaurant id>>
    {
      '<restaurant property>': <restaurant property value>
    }
*/
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

export function removeRestaurantProperty(request: Request, response: Response, next: any) {
  console.log('removeRestaurantProperty');
  console.log(request.body);

  Restaurant.findById(request.params.id, (err, restaurant) => {
    if (request.body._id) {
      delete request.body._id;
    }
    for (const b in request.body) {
      if (request.body.hasOwnProperty(b)) {
        // restaurant.set(b, null);
        (restaurant as any)[b] = undefined;
      }
    }
    restaurant.save();
    response.json(restaurant);
  });
}

// No route currently accesses this function
export function updateRequestWithYelpDataPlaceholder(request: Request, response: Response, next: any) {
  console.log('updateRequestWithYelpData');
  console.log(request.body);

  const yelpId = request.body.yelpId;
  return fetchYelpBusinessDetails(yelpId).then((yelpBusinessDetails: any) => {
    console.log(yelpBusinessDetails);

    const restaurant: any = {
      categoryId: request.body.categoryId,
      yelpBusinessDetails,
    };
    Restaurant.create(restaurant).then((createdRestaurant: any) => {
      response.status(201).json({
        success: true,
        data: createdRestaurant,
      });
    });
  });
}

/*  POST
    {{URL}}/api/v1/restaurant/<restaurant id>
*/
export function addRestaurantMenuItem(request: Request, response: Response, next: any) {
  console.log('addRestaurantMenuItem');
  console.log(request.body);

  Restaurant.findById(request.params.id, (err, restaurant) => {
    if (request.body._id) {
      delete request.body._id;
    }
    (restaurant as any).menuItemNames.push(request.body.menuItemName.toString());
    restaurant.save();
    response.json(restaurant);
  });
}


export function addRestaurantReview(request: Request, response: Response, next: any) {
  console.log('addRestaurantReview');
  console.log(request.body);
}

export function addRestaurantVisitReview(request: Request, response: Response, next: any) {
  console.log('addRestaurantVisitReview');
  console.log(request.body);
}

export function getRestaurantByLocation(request: Request, response: Response): Promise<any> {

  console.log('request.params:');
  console.log(request.params);

  const latitude: number = parseFloat(request.params.latitude);
  const longitude: number = parseFloat(request.params.longitude);

  console.log('latitude: ', latitude);
  console.log('longitude: ', longitude);

  return fetchYelpBusinessByLocation(latitude, longitude).then((responseData: any) => {
    response.json(responseData);
  });
}

export function getRestaurantByYelpId(request: Request, response: Response): Promise<any> {

  console.log('request.params:');
  console.log(request.params);

  const yelpId = request.params.yelpId;
  console.log('yelpId: ', yelpId);

  return fetchYelpBusinessDetails(yelpId).then((responseData: any) => {
    response.json(responseData);
  });
}

export function getRestaurantsByLatLng(request: Request, response: Response): Promise<any> {

  console.log('request.query:');
  console.log(request.query);

  return fetchYelpBusinessByLocation(request.query.latitude, request.query.longitude).then((responseData: any) => {
    return response.json(responseData);
  });
}

export function getFilteredRestaurants(request: Request, response: Response, next: any) {

  response.status(201).json({
    success: true,
  });
}

// check to see if all elements in target exist in arr
const checker = (arr: any, target: any) => target.every((v: any) => arr.includes(v));
