import { Request, Response } from 'express';
import Restaurant from '../models/Restaurant';
import RestaurantCategory from '../models/RestaurantCategory';
import Tag from '../models/Tag';
import TaggedEntityRating from '../models/TaggedEntityRating';
import User from '../models/User';
import { fetchYelpBusinessDetails, fetchYelpBusinessByLocation } from './yelp';
import RestaurantReview from '../models/RestaurantReview';
import { Document } from 'mongoose';

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
  return fetchYelpBusinessByLocation(latitude, longitude).then((responseData: any) => {
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

  console.log('getFilteredRestaurants, requestBody:');
  console.log(request.body);

  let queryExpression: any = {};

  // build query expression

  if (request.body.hasOwnProperty('restaurantCategories')) {
    const restaurantCategories: any[] = request.body.restaurantCategories;
    if (restaurantCategories.length > 0) {

      // const restaurantCategoryId: string = restaurantCategories[0].id;
      // const query = Restaurant.find({ categoryId: restaurantCategoryId });

      const restaurantCategoryIds: string[] = restaurantCategories.map((restaurantCategory: any) => {
        return restaurantCategory.id;
      });
      queryExpression = {
        categoryId: {
          $in: restaurantCategoryIds,
        },
      };
      // const query = Restaurant.find(queryExpression);

      // const promise: Promise<Document[]> = query.exec();
      // return promise.then((restaurantDocs: Document[]) => {
      //   console.log('Query results');
      //   console.log(restaurantDocs);
      //   response.status(201).json({
      //     success: true,
      //     data: restaurantDocs,
      //   });
      // });
    }
  }

  // const tagId: string = '5e4a9bed68e85b19d155a561';
  // const query = Tag.find({ _id: tagId });
  // const promise: Promise<Document[]> = query.exec();
  // return promise.then((tagDocs: Document[]) => {
  //   console.log('Query results');
  //   console.log(tagDocs);
  //   response.status(201).json({
  //     success: true,
  //     data: tagDocs,
  //   });
  // });

  // _id === id
  // rating corresponds to value
  // switch on operator
  //    equals
  //      $eq
  //    greaterThan
  //      $gt
  // Tag.find( { _id: tagId, rating: { mongoOperator: value }})


  if (request.body.hasOwnProperty('tagValues')) {
    const tagValues: any[] = request.body.tagValues;
    for (const tagSpec of tagValues) {
      const { id, operator, value } = tagSpec;
      console.log('tagSpec:');
      console.log(tagSpec);
      const rating: any = {
        $gt: value,
      };
      queryExpression = {
        tagId: id,
        rating,
      };
      const query = TaggedEntityRating.find(queryExpression);

      const promise: Promise<Document[]> = query.exec();
      return promise.then((tagDocs: Document[]) => {
        console.log('Query results');
        console.log(tagDocs);
        response.status(201).json({
          success: true,
          data: tagDocs,
        });
      });

    }
  }

  response.status(201).json({
    success: true,
  });

}
