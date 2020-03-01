import { Request, Response } from 'express';
import Restaurant from '../models/Restaurant';
import RestaurantCategory from '../models/RestaurantCategory';
import Tag from '../models/Tag';
import TaggedEntityRating from '../models/TaggedEntityRating';
import User from '../models/User';
import { fetchYelpBusinessDetails, fetchYelpBusinessByLocation } from './yelp';
import RestaurantReview from '../models/RestaurantReview';
import { Document } from 'mongoose';
import { RestaurantType, TagValueRequest } from '../types';

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

  let queryExpression: any = {};

  // build query expression

  if (request.body.hasOwnProperty('restaurantCategories')) {
    const restaurantCategories: any[] = request.body.restaurantCategories;
    if (restaurantCategories.length > 0) {

      const restaurantCategoryIds: string[] = restaurantCategories.map((restaurantCategory: any) => {
        return restaurantCategory.id;
      });

      queryExpression = {
        categoryId: {
          $in: restaurantCategoryIds,
        },
      };
      const query = Restaurant.find(queryExpression);
      const promise: Promise<Document[]> = query.exec();
      return promise.then((restaurantDocs: Document[]) => {

        const restaurantsFilteredByQuery: RestaurantType[] = restaurantDocs.map((restaurantDoc) => {
          return restaurantDoc.toObject();
        });

        console.log('restaurantsFilteredByCategories');
        console.log(restaurantsFilteredByQuery);

        if (request.body.hasOwnProperty('tagValues')) {
          const tagValueRequests: TagValueRequest[] = request.body.tagValues;
          const tagIds: string[] = tagValueRequests.map((tagValue) => {
            return tagValue.id;
          });

          // get the restaurants that contain all the tags
          const restaurantsFilteredByTags = restaurantsFilteredByQuery.filter((restaurant, index, arr) => {
            const restaurantTagIds: string[] = restaurant.tagIds;
            // do all tagIds exist in restaurantTagIds?
            return checker(restaurantTagIds, tagIds);
          });

          console.log('restaurantsFilteredByTags');
          console.log(restaurantsFilteredByTags);

          //
          const tagSpecQueries: any[] = [];
          for (const tagSpec of tagValueRequests) {
            const { id, operator, value } = tagSpec;
            // console.log('tagSpec:');
            // console.log(tagSpec);
            let rating: any;
            switch (operator) {
              case 'greaterThan':
                rating = { $gt: value };
                break;
              case 'equals':
                rating = { $eq: value };
                break;
              case 'lessThan':
                rating = { $lt: value };
                break;
            }
            tagSpecQueries.push({
              tagId: id,
              rating,
            });
          }

          performTagSpecQueries(tagSpecQueries)
            .then( (taggedEntityRatingsDocuments: any[][]) => {
              console.log('taggedEntityRatingsDocuments');
              console.log(taggedEntityRatingsDocuments);

              const restaurantsFilteredByTaggedEntityRatings = restaurantsFilteredByTags.filter((restaurant, index, arr) => {
                console.log(restaurant);
                for (const taggedEntityRatingsDocument of taggedEntityRatingsDocuments) {
                  for (const taggedEntityRatingDocument of taggedEntityRatingsDocument) {
                    const taggedEntityRating = taggedEntityRatingDocument.toObject();
                    console.log(taggedEntityRating);
                    if (taggedEntityRating.tagTargetId !== restaurant._id.toString()) {
                      return false;
                    }
                  }                  
                }
                return true;
              });

              console.log('matching restaurants');
              console.log(restaurantsFilteredByTaggedEntityRatings);

            });


          // perform further filtering on the restaurants - only take those that where the taggedEntityRatings documents include them 
          // (their restaurantId is in the taggedEntityRatings)
        }

        response.status(201).json({
          success: true,
          data: restaurantDocs,
        });
      });
    }
  }
  response.status(201).json({
    success: true,
  });
}

function performTagSpecQueries(tagSpecQueries: any[]): Promise<any[]> {

  const taggedEntityRatingsDocuments: any[] = [];

  const performNextTagSpecQuery = (index: number): Promise<any[]> => {

    // console.log('performNextTagSpecQuery, index: ' + index);

    if (index >= tagSpecQueries.length) {
      // console.log(taggedEntityRatingsDocuments);
      return Promise.resolve(taggedEntityRatingsDocuments);
    }

    const querySpec: any = tagSpecQueries[index];

    const tagSpecQuery = TaggedEntityRating.find(querySpec);
    const tagSpecPromise: Promise<Document[]> = tagSpecQuery.exec();
    return tagSpecPromise
      .then((taggedEntityRatings: Document[]) => {
        taggedEntityRatingsDocuments.push(taggedEntityRatings);
        return performNextTagSpecQuery(index + 1);
      });
  };

  return performNextTagSpecQuery(0);
}

// check to see if all elements in target exist in arr
const checker = (arr: any, target: any) => target.every((v: any) => arr.includes(v));
