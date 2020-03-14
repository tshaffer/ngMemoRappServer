import { Request, Response } from 'express';
import Restaurant from '../models/Restaurant';
import { Document } from 'mongoose';

import { isNil } from 'lodash';

import { FilterSpec, RestaurantReviewSpec } from '../types';

/*
{{URL}}/api/v1/filteredRestaurants

{
  "filters": {
    "categories": [ "Sandwiches", "Pizza" ],
    "menuItems": [ "Meatball Sandwich", "Mac & Cheese" ],
    "reviews": [
      "userName": "ted",
      "overallRating": 5.0,
      "foodRating": 5.0,
      "serviceRating": 5.0,
      "ambienceRating": 5.0,
      "parkingRating": 5.0,
      "takeout": true,
    ]
  }
}

Future additions:
    "reviews": [
      "menuItemRatings": [
        "Meatball Sandwich": 5.0,
        "Mac & Cheese": 5.0
      ]
    ],
    "location": {
        "latitude": 37.7670169511878,
          "longitude": -122.42184275
    }

  Less clear:
    "visitReviews"
*/

export function getFilteredRestaurants(request: Request, response: Response, next: any) {
  
  const aggExpression: any = getFilteredRestaurantsQuery(request.body.filterSpec);

  Restaurant.aggregate(aggExpression)
    .exec((err, restaurants) => {
      if (err) {
        throw err;
      }
      response.status(201).json({
        success: true,
        restaurants,
      });
    });

}

export function getFilteredRestaurantsQuery(filterSpec: FilterSpec): any {

  const matchSpec = getMatchSpec(filterSpec);
  const projectSpec = getProjectSpec(filterSpec);
  const ratingsValuesMatchSpec = getRatingsValuesMatchSpec(filterSpec);

  const aggregateQuery: any[] = [];
  aggregateQuery.push({
    $match: matchSpec,
  });
  aggregateQuery.push({
    $project: projectSpec,
  });
  aggregateQuery.push({
    $match: ratingsValuesMatchSpec,
  });

  console.log(aggregateQuery);

  return aggregateQuery;
}

function getMatchSpec(filterSpec: FilterSpec): any {

  let matchSpec: any = {};

  if (filterSpec.hasOwnProperty('categories')) {
    const categoriesMatchQuery = getCategoriesMatchSpec(filterSpec.categories);
    matchSpec.categoryNames = categoriesMatchQuery;    
  }

  if (filterSpec.hasOwnProperty('reviews')) {
    matchSpec = getReviewsMatchSpec(matchSpec, filterSpec.reviews);
  }

  return matchSpec;
}

function getCategoriesMatchSpec(categoryNames: string[]): any {
  const specifiedCategories: any = {};
  specifiedCategories.$in = categoryNames;
  return specifiedCategories;
}

function getReviewsMatchSpec(matchSpec: any, reviewsSpec: RestaurantReviewSpec) {
  const ratingExists: any = {
    $exists: true,
    $ne: null,
  };
  if (!isNil(reviewsSpec.overallRating)) {
    matchSpec['reviews.overallRating'] = ratingExists;
  }
  if (!isNil(reviewsSpec.foodRating)) {
    matchSpec['reviews.foodRating'] = ratingExists;
  }
  if (!isNil(reviewsSpec.serviceRating)) {
    matchSpec['reviews.serviceRating'] = ratingExists;
  }
  if (!isNil(reviewsSpec.ambienceRating)) {
    matchSpec['reviews.ambienceRating'] = ratingExists;
  }
  // TEDTODO
  // parking
  // takeout

  return matchSpec;
}

function getProjectSpec(filterSpec: FilterSpec): any {

  const projectSpec: any = {};

  projectSpec.restaurantName = 1;
  projectSpec._id = 0;

  projectSpec['reviews.userName'] = 1;
  projectSpec['reviews.overallRating'] = 1;
  projectSpec['reviews.foodRating'] = 1;
  projectSpec['reviews.comments'] = 1;

  // TEDTODO - separate function?
  // remaining ratings
  if (!isNil(filterSpec.reviews)) {

    const reviewsSpec = filterSpec.reviews;

    if (!isNil(reviewsSpec.overallRating)) {
      projectSpec.overallRatingAvg = { $avg: '$reviews.overallRating' };
    }
  }

  return projectSpec;
}

function getRatingsValuesMatchSpec(filterSpec: FilterSpec): any {

  const matchSpec: any = {};

  if (filterSpec.hasOwnProperty('reviews')) {

    const reviewsSpec: RestaurantReviewSpec = filterSpec.reviews;
    
    if (!isNil(reviewsSpec.overallRating)) {
      matchSpec.overallRatingAvg = {
        $gt: reviewsSpec.overallRating,
      };
    }

    // TEDTODO
    //   separate function?
    //   additional ratings types.
  }

  return matchSpec;
}


export function protoGetFilteredRestaurants(request: Request, response: Response, next: any) {

  const categoryNamesQuerySubExpression = getCategoryNamesQuerySubExpression(request);
  const menuItemNamesQuerySubExpression = getMenuItemNamesQuerySubExpression(request);
  if (!isNil(categoryNamesQuerySubExpression) && !isNil(menuItemNamesQuerySubExpression)) {
    const queryExpression = {
      menuItemNames: menuItemNamesQuerySubExpression,
      categoryNames: categoryNamesQuerySubExpression,
    };

    const query = Restaurant.find(queryExpression);
    const promise: Promise<Document[]> = query.exec();
    return promise.then((restaurantDocs: Document[]) => {
      response.status(201).json({
        success: true,
        restaurants: restaurantDocs,
      });
    });
  }
}

const getCategoryNamesQuerySubExpression = (request: Request) => {
  if (request.body.hasOwnProperty('restaurantCategories')) {
    const restaurantCategories: any[] = request.body.restaurantCategories;
    if (restaurantCategories.length > 0) {
      const categoryNames: string[] = restaurantCategories.map((restaurantCategory: any) => {
        return restaurantCategory.categoryName;
      });
      const querySubExpression: any = {};
      querySubExpression.$in = categoryNames;
      return querySubExpression;
    }
  }
  return null;
};

const getMenuItemNamesQuerySubExpression = (request: Request) => {
  if (request.body.hasOwnProperty('menuItems')) {
    const menuItems: any[] = request.body.menuItems;
    if (menuItems.length > 0) {
      const menuItemNames: string[] = menuItems.map((menuItem: any) => {
        return menuItem.menuItemName;
      });
      const querySubExpression: any = {};
      querySubExpression.$in = menuItemNames;
      return querySubExpression;
    }
  }
  return null;
};

