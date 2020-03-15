import { Request, Response } from 'express';
import Restaurant from '../models/Restaurant';
import { Document } from 'mongoose';

import { isNil } from 'lodash';

import { FilterSpec, RestaurantReviewSpec, GeoLocationSpec } from '../types';

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

// example queries, from Compass

const geoQuery: any =
  [
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [
            -122.147944, 37.392333,
          ],
        },
        distanceField: 'dist.calculated',
        maxDistance: 10000,
        includeLocs: 'dist.location',
        spherical: true,
      },
    }, {
      $project: {
        _id: 0,
        restaurantName: 1,
      },
    },
  ];

const fullQuery: any =
  [
    {
      $match: {
        categoryNames: {
          $in: [
            'Burritos', 'Sandwiches',
          ],
        },
        'reviews.overallRating': {
          $exists: true,
          $ne: null,
        },
      },
    }, {
      $project: {
        overallRatingAvg: {
          $avg: '$reviews.overallRating',
        },
        _id: 0,
        restaurantName: 1,
        'reviews.userName': 1,
        'reviews.comments': 1,
        'reviews.overallRating': 1,
      },
    }, {
      $unwind: {
        path: '$reviews',
      },
    }, {
      $match: {
        $or: [
          {
            'reviews.userName': 'ted',
          }, {
            'reviews.userName': 'lori',
          },
        ],
        overallRatingAvg: {
          $gt: 6.9,
        },
      },
    }, {
      $project: {
        _id: 0,
        restaurantName: 1,
        'reviews.userName': 1,
        'reviews.comments': 1,
        'reviews.overallRating': 1,
      },
    },
  ];

export function getFilteredRestaurantsQuery(filterSpec: FilterSpec): any {

  debugger;

  const geoNearSpec = getGeoNearSpec(filterSpec);
  const firstMatchSpec = getFirstMatchSpec(filterSpec);
  const firstProjectSpec = getFirstProjectSpec(filterSpec);
  const unwindSpec = getUnwindSpec(filterSpec);
  const secondMatchSpec = getSecondMatchSpec(filterSpec);
  const secondProjectSpec = getSecondProjectSpec();

  const aggregateQuery: any[] = [];
  if (!isNil(geoNearSpec)) {
    aggregateQuery.push({
      $geoNear: geoNearSpec,
    });
  }
  aggregateQuery.push({
    $match: firstMatchSpec,
  });
  aggregateQuery.push({
    $project: firstProjectSpec,
  });
  if (!isNil(unwindSpec)) {
    aggregateQuery.push({
      $unwind: unwindSpec,
    });
  }
  if (!isNil(secondMatchSpec)) {
    aggregateQuery.push({
      $match: secondMatchSpec,
    });
  }
  aggregateQuery.push({
    $project: secondProjectSpec,
  });

  // console.log(aggregateQuery);

  return aggregateQuery;
  // return fullQuery;
  // return geoQuery;
}

// PIPELINE SPECS

function getGeoNearSpec(filterSpec: FilterSpec): any {

  if (!isNil(filterSpec.location)) {
    const geoLocationSpec: GeoLocationSpec = filterSpec.location;
    return {
      near: {
        type: 'Point',
        coordinates: geoLocationSpec.coordinates,
      },
      distanceField: 'dist.calculated',
      maxDistance: geoLocationSpec.maxDistance,
      includeLocs: 'dist.location',
      spherical: true,
    };
  }

  return null;
}

function getFirstMatchSpec(filterSpec: FilterSpec): any {

  let matchSpec: any = {};

  if (filterSpec.hasOwnProperty('categories')) {
    const categoriesMatchQuery = getCategoriesMatchSpecHelper(filterSpec.categories);
    matchSpec.categoryNames = categoriesMatchQuery;
  }

  if (filterSpec.hasOwnProperty('reviews')) {
    matchSpec = getReviewsMatchSpecHelper(matchSpec, filterSpec.reviews);
  }

  return matchSpec;
}

function getFirstProjectSpec(filterSpec: FilterSpec): any {

  const projectSpec: any = {};

  projectSpec.restaurantName = 1;
  projectSpec._id = 0;

  projectSpec['reviews.userName'] = 1;
  projectSpec['reviews.overallRating'] = 1;
  projectSpec['reviews.foodRating'] = 1;
  projectSpec['reviews.comments'] = 1;

  // TEDTODO - separate function?
  // implement additional remaining rating types
  if (!isNil(filterSpec.reviews)) {

    const reviewsSpec = filterSpec.reviews;

    if (!isNil(reviewsSpec.overallRating)) {
      projectSpec.overallRatingAvg = { $avg: '$reviews.overallRating' };
    }

    // didn't work
    // if (!isNil(reviewsSpec.menuItemRatings)) {
    //   projectSpec.menuItemRatingsCount = { $size: '$reviews.menuItemRatings' };
    //   projectSpec.menuItemRatingsExist = {
    //     // $not: [ { $size: reviewsSpec.menuItemRatings } ],
    //     $gt: [ { $size: '$reviews.menuItemRatings' }, 0 ],
    //   };
    // }
  }

  return projectSpec;
}

function getUnwindSpec(filterSpec: FilterSpec): any {
  if (!isNil(filterSpec.reviews) && filterSpec.reviews.userNames.length > 0) {
    return {
      path: '$reviews',
    };
  }
  return null;
}

function getSecondMatchSpec(filterSpec: FilterSpec): any {

  if (filterSpec.hasOwnProperty('reviews')) {

    const matchSpec: any = {};

    const reviewsSpec: RestaurantReviewSpec = filterSpec.reviews;

    if (reviewsSpec.userNames.length > 0) {
      const userNames: any[] = [];
      for (const userName of reviewsSpec.userNames) {
        userNames.push(
          { 'reviews.userName': userName },
        );
      }

      matchSpec.$or = userNames;
    }

    if (!isNil(reviewsSpec.overallRating)) {
      matchSpec.overallRatingAvg = { $gt: reviewsSpec.overallRating };
    }

    if (Object.keys(matchSpec).length > 0) {
      return matchSpec;
    }
  }

  return null;
}

function getSecondProjectSpec(): any {

  const projectSpec: any = {};

  projectSpec._id = 0;
  projectSpec.restaurantName = 1;
  projectSpec.overallRatingAvg = 1;

  projectSpec['reviews.userName'] = 1;
  projectSpec['reviews.overallRating'] = 1;
  projectSpec['reviews.foodRating'] = 1;
  projectSpec['reviews.comments'] = 1;

  return projectSpec;
}

// pipeline spec generator helper functions

function getCategoriesMatchSpecHelper(categoryNames: string[]): any {
  const specifiedCategories: any = {};
  specifiedCategories.$in = categoryNames;
  return specifiedCategories;
}

function getReviewsMatchSpecHelper(matchSpec: any, reviewsSpec: RestaurantReviewSpec) {
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

  // didn't work
  // if (!isNil(reviewsSpec.menuItemRatings)) {
  //   // reviewsSpec.menuItemRatings.forEach((menuItemRating, index) => {
  //   //   matchSpec['reviews.menuItemRatings[0]'] = ratingExists;
  //   // });
  //   matchSpec['reviews.menuItemRatings'] = {
  //     $not: [ { $size: 0 } ],
  //     // {
  //     //   $gt: 0,
  //     // },
  //   };
  // }

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

