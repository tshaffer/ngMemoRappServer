import { Request, Response } from 'express';
import Restaurant from '../models/Restaurant';
import User from '../models/User';
import { fetchYelpBusinessDetails, fetchYelpBusinessByLocation } from './yelp';
import { Document } from 'mongoose';
// import { RestaurantType, TagValueRequest } from '../types';

import { UserEntity, RestaurantCategoryEntity, MenuItemEntity, RestaurantEntity } from '../types';
import {
  createUserDocument,
  createUserDocuments,
  createRestaurantCategoryDocuments,
  createMenuItemDocuments,
  createMenuItemDocument,
  createRestaurantCategoryDocument,
  createRestaurantDocuments,
  createRestaurantReviewDocuments,
} from './dbInterface';
import { isNil } from 'lodash';
import { truncate } from 'fs';
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
  const { menuItemName, description } = request.body;
  const menuItemEntity: MenuItemEntity = {
    menuItemName,
    description,
  };
  createMenuItemDocument(menuItemEntity)
    .then((menuItemDoc) => {
      const menuItemDocument = menuItemDoc as Document;
      console.log('added menuItemDocument');
      console.log(menuItemDocument);
      console.log(menuItemDocument.toObject());

      response.status(201).json({
        success: true,
        data: menuItemDocument,
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
  const { categoryName, description } = request.body;
  const restaurantCategoryEntity: RestaurantCategoryEntity = {
    categoryName,
    description,
  };
  createRestaurantCategoryDocument(restaurantCategoryEntity)
    .then((restaurantCategoryDoc) => {
      const restaurantCategoryDocument = restaurantCategoryDoc as Document;
      console.log('added restaurantCategoryDocument');
      console.log(restaurantCategoryDocument);
      console.log(restaurantCategoryDocument.toObject());

      response.status(201).json({
        success: true,
        data: restaurantCategoryDocument,
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

function buildAggregationExpression() {

  //     $match:
  //     {
  //       'reviews.overallRating': {
  //         $exists: true,
  //         $ne: null,
  //       },
  //       categoryNames: 'Burritos',
  //     },
  const matchConditions: any = {};
  matchConditions['reviews.overallRating'] = {
    $exists: true,
    $ne: null,
  };
  matchConditions.categoryNames = 'Burritos';

  //   $project:
  //   {
  //     restaurantName: 1,
  //     overallRatingAvg: { $avg: '$reviews.overallRating' },
  //     foodRatingAvg: { $avg: '$reviews.foodRating' },
  //     'reviews.userName': 1,
  //     'reviews.overallRating': 1,
  //     'reviews.foodRating': 1,
  //     'reviews.comments': 1,
  //   },
  const projectConditions: any = {};
  projectConditions.restaurantName = 1;
  projectConditions.overallRatingAvg = {
    $avg: '$reviews.overallRating',
  };
  projectConditions.foodRatingAvg = {
    $avg: '$reviews.foodRating',
  };
  projectConditions['reviews.userName'] = 1;
  projectConditions['reviews.overallRating'] = 1;
  projectConditions['reviews.foodRating'] = 1;
  projectConditions['reviews.comments'] = 1;

  //   $match:
  //   {
  //     overallRatingAvg: { $gt: 4 },
  //     foodRatingAvg: { $gt: 7.9 },
  //   },
  const matchConditions2: any = {};
  matchConditions2.overallRatingAvg = { $gt: 4 };
  matchConditions2.foodRatingAvg = { $gt: 7.9 };

  const aggregateQuery: any[] = [];
  aggregateQuery.push({
    $match: matchConditions,
  });
  aggregateQuery.push({
    $project: projectConditions,
  });
  aggregateQuery.push({
    $match: matchConditions2,
  });

  return aggregateQuery;
}

export function aggregationTest(request: Request, response: Response, next: any) {

  const aggregationExpression: any = buildAggregationExpression();
  console.log('aggregationExpression');
  console.log(aggregationExpression);

  const aggExpression: any = [
    {
      $match:
      {
        'reviews.overallRating': {
          $exists: true,
          $ne: null,
        },
        // categoryNames: 'Burritos',
        categoryNames: { $in: ['Burritos', 'Sandwiches'] },
      },
    },
    {
      $project:
      {
        restaurantName: 1,
        overallRatingAvg: { $avg: '$reviews.overallRating' },
        foodRatingAvg: { $avg: '$reviews.foodRating' },
        'reviews.userName': 1,
        'reviews.overallRating': 1,
        'reviews.foodRating': 1,
        'reviews.comments': 1,
      },
    },
    {
      $match:
      {
        overallRatingAvg: { $gt: 6.8 },
        foodRatingAvg: { $gt: 1 },
      },
    },
  ];
  console.log('aggExpression');
  console.log(aggExpression);

  // Restaurant.aggregate(aggregationExpression)
  Restaurant.aggregate(aggExpression)
    .exec((err, locations) => {
      if (err) {
        throw err;
      }
      response.status(201).json({
        success: true,
        restaurants: locations,
      });
    });
  // Restaurant.aggregate([
  //   {
  //     $match:
  //     {
  //       'reviews.overallRating': {
  //         $exists: true,
  //         $ne: null,
  //       },
  //       categoryNames: 'Burritos',
  //     },
  //   },
  //   // {
  //   //   $project:
  //   //   {
  //   //     restaurantName: 1,
  //   //     overallRatingAvg: { $avg: '$reviews.overallRating' },
  //   //     foodRatingAvg: { $avg: '$reviews.foodRating' },
  //   //     'reviews.userName': 1,
  //   //     'reviews.overallRating': 1,
  //   //     'reviews.foodRating': 1,
  //   //     'reviews.comments': 1,
  //   //   },
  //   // },
  //   // {
  //   //   $match:
  //   //   {
  //   //     overallRatingAvg: { $gt: 4 },
  //   //     foodRatingAvg: { $gt: 7.9 },
  //   //   },
  //   // },
  //   // {
  //   //   $sort:
  //   //     { overallRatingAvg: -1 },
  //   // },
  // ]).exec((err, locations) => {
  //   if (err) {
  //     throw err;
  //   }
  //   console.log(locations);
  //   response.status(201).json({
  //     success: true,
  //     restaurants: locations,
  //   });
  // });
}

// check to see if all elements in target exist in arr
const checker = (arr: any, target: any) => target.every((v: any) => arr.includes(v));


export const populateUsers = () => {
  const userEntities: UserEntity[] = [
    { userName: 'ted', password: 'letTedIn', email: 'ted@pizza.com' },
    { userName: 'lori', password: 'letLoriIn', email: 'lori@peony.com' },
    { userName: 'rachel', password: 'letRachelIn', email: 'rachel@babies.com' },
  ];
  return createUserDocuments(userEntities);
};

export const populateRestaurantCategories = () => {
  const restaurantCategoryEntities: RestaurantCategoryEntity[] = [
    { categoryName: 'Burritos', description: 'taqueria' },
    { categoryName: 'Pizza', description: 'pizza and other italian favorites' },
    { categoryName: 'Sandwiches', description: 'Place that serves sandwiches.' },
    { categoryName: 'Coffee', description: 'Lattes, etc.' },
    { categoryName: 'Ice Cream', description: 'cones, milk shakes, etc.' },
  ];
  return createRestaurantCategoryDocuments(restaurantCategoryEntities);
};

export const populateMenuItems = () => {
  const menuItemEntities: MenuItemEntity[] = [
    { menuItemName: 'Meatball Sandwich' },
    { menuItemName: 'Macaroni & Cheese' },
  ];
  return createMenuItemDocuments(menuItemEntities);
};

const getAllYelpData = (yelpBusinessIds: string[]): Promise<any[]> => {

  const yelpBusinessDetails: any[] = [];

  const processNextYelpBusiness = (index: number): Promise<number[]> => {
    console.log('processNextActivity, index: ' + index);

    if (index >= yelpBusinessIds.length) {
      return Promise.resolve(yelpBusinessDetails);
    }

    const yelpBusinessId: string = yelpBusinessIds[index];

    return fetchYelpBusinessDetails(yelpBusinessId)
      .then((businessDetails: any) => {
        yelpBusinessDetails.push(businessDetails);
        return processNextYelpBusiness(index + 1);
      });
  };

  return processNextYelpBusiness(0);
};

export const populateRestaurants = () => {
  const restaurants: RestaurantEntity[] = [
    {
      restaurantName: 'Zoccolis',
      categoryNames: ['Sandwiches'],
      yelpBusinessDetails: { id: 'bD5-lIjvV6miih3O1eqW_w' },
      menuItemNames: ['Meatball Sandwich'],
      reviews: [],
      visitReviews: [],
    },
    {
      restaurantName: 'Bravo Taqueria',
      categoryNames: ['Burritos'],
      yelpBusinessDetails: { id: 'cDtfZM6toBEpaFPGI4f6ZA' },
      menuItemNames: [''],
      reviews: [],
      visitReviews: [],
    },
    {
      restaurantName: 'La Costeña',
      categoryNames: ['Burritos'],
      yelpBusinessDetails: { id: 'Y-cwAyfIHDObQi8KCDe8Pw' },
      menuItemNames: [''],
      reviews: [],
      visitReviews: [],
    },
    {
      restaurantName: 'Chiquitas',
      categoryNames: ['Burritos'],
      yelpBusinessDetails: { id: 'SDism5DnPRDGJohjQDd-ng' },
      menuItemNames: [''],
      reviews: [],
      visitReviews: [],
    },
    {
      restaurantName: "Howie's Artisan Pizza",
      categoryNames: ['Pizza'],
      yelpBusinessDetails: { id: 'wBMzAzT3haIsaA0JoDr1-Q' },
      menuItemNames: [''],
      reviews: [],
      visitReviews: [],
    },
    {
      restaurantName: 'High Street Market & Deli',
      categoryNames: ['Sandwiches'],
      yelpBusinessDetails: { id: 'tgx533AzRRPFVdVP2el2rw' },
      menuItemNames: [''],
      reviews: [],
      visitReviews: [],
    },
  ];

  const yelpBusinessIds: string[] = restaurants.map((restaurant: any) => {
    return restaurant.yelpBusinessDetails.id;
  });

  return getAllYelpData(yelpBusinessIds).then((yelpBusinessDetails: any[]) => {
    for (let i = 0; i < restaurants.length; i++) {
      restaurants[i].yelpBusinessDetails = yelpBusinessDetails[i];
    }
    return createRestaurantDocuments(restaurants);
  });
};

export const populateRestaurantReviews = () => {

  const reviews: any[] = [];

  // LaCostena
  return createRestaurantReviewDocuments('5e65636eb6c2dee096d63ba1', [
    {
      userName: 'ted',
      comments: 'Pollo Borracho is especially flavorful. Nice and juicy.',
      overallRating: 8,
      foodRating: 9,
      serviceRating: 6.9,
      ambienceRating: 3,
    },
    {
      userName: 'lori',
      comments: 'Enjoy the carnitas burrito and the tacos.',
      overallRating: 6,
      foodRating: 7,
      serviceRating: 6,
      ambienceRating: 2,
    },
    {
      userName: 'rachel',
      comments: 'Super burritos are the best. Perfect to take home to Seattle',
      overallRating: 8.6,
      foodRating: 8.1,
      serviceRating: 6.6,
      ambienceRating: 5,
    },
  ])
    .then((laCostena: Document) => {
      reviews.push(laCostena);

      // Chiquitas
      return createRestaurantReviewDocuments('5e65636eb6c2dee096d63ba2', [
        {
          userName: 'ted',
          comments: 'Flavorful and juicy',
          overallRating: 7,
          foodRating: 8,
          serviceRating: 7.2,
          ambienceRating: 3.5,
        },
        {
          userName: 'lori',
          comments: 'Good carnitas burrito.',
          overallRating: 6.6,
          foodRating: 7.7,
          serviceRating: 6.9,
          ambienceRating: 3,
        },
      ])
      .then((chiquitas: Document) => {
        reviews.push(chiquitas);

        // Zoccoli's
        return createRestaurantReviewDocuments('5e65636eb6c2dee096d63b9f', [
          {
            userName: 'ted',
            comments: 'Great meatball sandwiches',
            overallRating: 7,
            foodRating: 8,
            serviceRating: 6,
            ambienceRating: 3,
          },
          {
            userName: 'lori',
            comments: 'Pastrami sandwich is really good.',
            overallRating: 7,
            foodRating: 7,
            serviceRating: 7,
            ambienceRating: 2,
          },
        ])
          .then((zoccolis: Document) => {
            // return Promise.resolve([zoccolis]);
            reviews.push(zoccolis);
            return Promise.resolve(reviews);
          });
        });
    });
};

export const populateDb = (request: Request, response: Response, next: any) => {
  populateRestaurantReviews()
    .then((restaurantDocuments: Document[]) => {
      response.status(201).json({
        success: true,
        restaurants: restaurantDocuments,
      });
    });
  // populateRestaurants()
  //   .then((restaurantDocuments: Document[]) => {
  //     response.status(201).json({
  //       success: true,
  //       restaurants: restaurantDocuments,
  //     });
  //   });
  // populateUsers()
  //   .then((userDocuments: Document[]) => {
  //     return populateRestaurantCategories()
  //       .then((restaurantCategoryDocuments: Document[]) => {
  //         return populateMenuItems()
  //           .then((menuItemDocuments: Document[]) => {
  //             console.log('userDocuments');
  //             console.log(userDocuments);
  //             console.log('restaurantCategories');
  //             console.log(restaurantCategoryDocuments);
  //             console.log('menuItems');
  //             console.log(menuItemDocuments);
  //             response.status(201).json({
  //               success: true,
  //               users: userDocuments,
  //               restaurantCategories: restaurantCategoryDocuments,
  //               menuItems: menuItemDocuments,
  //             });
  //           });
  //       });
  //   });
};
