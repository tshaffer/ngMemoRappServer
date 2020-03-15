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
    { categoryName: 'Burritos', description: 'Taquerias only' },
    { categoryName: 'Pizza' },
    { categoryName: 'Sandwiches' },
    { categoryName: 'Coffee' },
    { categoryName: 'Pasta' },
  ];
  return createRestaurantCategoryDocuments(restaurantCategoryEntities);
};

export const populateMenuItems = () => {
  const menuItemEntities: MenuItemEntity[] = [
    { menuItemName: 'Meatball Sandwich' },
    { menuItemName: 'Prosciutto and arugula pizza' },
    { menuItemName: 'Pollo burrito' },
    { menuItemName: 'Carnitas' },
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
      restaurantName: 'La Costeña',
      categoryNames: ['Burritos'],
      yelpBusinessDetails: { id: 'Y-cwAyfIHDObQi8KCDe8Pw' },
      menuItemNames: ['Pollo burrito', 'Carnitas'],
      reviews: [],
      visitReviews: [],
    },
    {
      restaurantName: 'State of Mind Public House & Pizzeria',
      categoryNames: ['Pizza'],
      yelpBusinessDetails: { id: 'a8gk25_MTKdtoOwBsiraDQ' },
      menuItemNames: [],
      reviews: [],
      visitReviews: [],
    },
    {
      restaurantName: 'Chiquitas',
      categoryNames: ['Burritos'],
      yelpBusinessDetails: { id: 'SDism5DnPRDGJohjQDd-ng' },
      menuItemNames: ['Pollo burrito', 'Carnitas'],
      reviews: [],
      visitReviews: [],
    },
    {
      restaurantName: 'Zoccolis',
      categoryNames: ['Sandwiches'],
      yelpBusinessDetails: { id: 'bD5-lIjvV6miih3O1eqW_w' },
      menuItemNames: ['Meatball Sandwich'],
      reviews: [],
      visitReviews: [],
    },
    {
      restaurantName: "Howie's Artisan Pizza",
      categoryNames: ['Pizza', 'Sandwiches'],
      yelpBusinessDetails: { id: 'wBMzAzT3haIsaA0JoDr1-Q' },
      menuItemNames: ['Meatball Sandwich', 'Prosciutto and arugula pizza'],
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
    {
      restaurantName: 'Pizza Chicago',
      categoryNames: ['Pizza'],
      yelpBusinessDetails: { id: 'C2e_QIpD0QgiHlu_2Ari0A' },
      menuItemNames: ['Meatball Sandwich'],
      reviews: [],
      visitReviews: [],
    },
    {
      restaurantName: 'Terún',
      categoryNames: ['Pizza', 'Pasta'],
      yelpBusinessDetails: { id: 'pLqiFFz1JScp8wMMyXcx-w' },
      menuItemNames: ['Prosciutto and arugula pizza'],
      reviews: [],
      visitReviews: [],
    },
    {
      restaurantName: 'Napoletana Pizzeria',
      categoryNames: ['Pizza', 'Pasta'],
      yelpBusinessDetails: { id: 'Ce5JgEwL7G3HwalAFBcZEQ' },
      menuItemNames: ['Prosciutto and arugula pizza'],
      reviews: [],
      visitReviews: [],
    },
    {
      restaurantName: 'Pizzeria La Bufala',
      categoryNames: ['Pizza', 'Pasta'],
      yelpBusinessDetails: { id: 'tXA2SpZ79lyWxuTwjZkkgg' },
      menuItemNames: ['Prosciutto and arugula pizza'],
      reviews: [],
      visitReviews: [],
    },
    {
      restaurantName: 'Sandwich Bug',
      categoryNames: ['Sandwiches'],
      yelpBusinessDetails: { id: 'tKph0F6dMc9wnxpwjK4upA' },
      menuItemNames: [''],
      reviews: [],
      visitReviews: [],
    },
    {
      restaurantName: 'Taqueria La Cazuela',
      categoryNames: ['Burritos'],
      yelpBusinessDetails: { id: 'wFEb3Yx4dlwObCeYpm3-Fw' },
      menuItemNames: ['Pollo burrito', 'Carnitas'],
      reviews: [],
      visitReviews: [],
    },
    {
      restaurantName: 'Los Gallos Taqueria',
      categoryNames: ['Burritos'],
      yelpBusinessDetails: { id: 'FI5J97RTWw9vxGtLWvpEGA' },
      menuItemNames: ['Pollo burrito', 'Carnitas'],
      reviews: [],
      visitReviews: [],
    },
    {
      restaurantName: 'Cafe Iveta',
      categoryNames: ['Coffee'],
      yelpBusinessDetails: { id: 'DT74WaOqIZkiL1otlxNhQg' },
      menuItemNames: [''],
      reviews: [],
      visitReviews: [],
    },
    {
      restaurantName: 'Verve Palo Alto',
      categoryNames: ['Coffee'],
      yelpBusinessDetails: { id: 'AzoWYX6pPjbEMajA86caqg' },
      menuItemNames: [''],
      reviews: [],
      visitReviews: [],
    },
    {
      restaurantName: 'Firefly',
      categoryNames: ['Coffee'],
      yelpBusinessDetails: { id: 'W0JveBM6AVr35_lr5-EXTg' },
      menuItemNames: [''],
      reviews: [],
      visitReviews: [],
    },
    {
      restaurantName: 'Saint Frank',
      categoryNames: ['Coffee'],
      yelpBusinessDetails: { id: 'jiVieLy9l_FtoWQASmMlag' },
      menuItemNames: [''],
      reviews: [],
      visitReviews: [],
    },
    {
      restaurantName: 'Bluestone Lane',
      categoryNames: ['Coffee'],
      yelpBusinessDetails: { id: 'yVWJXJVDIAmUspOl4t57Dg' },
      menuItemNames: [''],
      reviews: [],
      visitReviews: [],
    },
    {
      restaurantName: 'Zombie Runner',
      categoryNames: ['Coffee'],
      yelpBusinessDetails: { id: 'z4RM2qx5Gi-Igsns9e-6Hw' },
      menuItemNames: [''],
      reviews: [],
      visitReviews: [],
    },
    {
      restaurantName: 'Caffè Bonini',
      categoryNames: ['Coffee'],
      yelpBusinessDetails: { id: 'AqpZTy5jF-lncQ0048LVdA' },
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
      restaurants[i].location = {
        type: 'Point',
        coordinates: [
          yelpBusinessDetails[i].coordinates.longitude,
          yelpBusinessDetails[i].coordinates.latitude,
        ],
      };
    }
    return createRestaurantDocuments(restaurants);
  });
};

export const populateRestaurantReviews = () => {

  const reviews: any[] = [];

  // LaCostena
  return createRestaurantReviewDocuments('-cwAyfIHDObQi8KCDe8Pw', [
    {
      userName: 'ted',
      comments: 'Pollo Borracho: flavorful juicy. Carne Asada - a little dry.',
      overallRating: 8,
      foodRating: 8,
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
  ]).then((laCostena: Document) => {
    reviews.push(laCostena);

    // State of Mind
    return createRestaurantReviewDocuments('a8gk25_MTKdtoOwBsiraDQ', [
      {
        userName: 'ted',
        comments: 'Grandmas Pie is my favorite. Goat cheese is good as well.',
        overallRating: 7,
        foodRating: 7,
        serviceRating: 7.2,
        ambienceRating: 3.5,
      },
      {
        userName: 'lori',
        comments: '',
        overallRating: 6.6,
        foodRating: 7.7,
        serviceRating: 6.9,
        ambienceRating: 3,
      },
    ]);
  }).then((stateOfMind: Document) => {
    reviews.push(stateOfMind);

    // Chiquitas
    return createRestaurantReviewDocuments('SDism5DnPRDGJohjQDd-ng', [
      {
        userName: 'ted',
        comments: 'Flavorful and juicy burritos. Fun little place.',
        overallRating: 7,
        foodRating: 7,
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
    ]);
  }).then((chiquitas: Document) => {
    reviews.push(chiquitas);

    // Zoccoli's
    return createRestaurantReviewDocuments('bD5-lIjvV6miih3O1eqW_w', [
      {
        userName: 'ted',
        comments: 'Meatball sandwiches very good. Get soggy fairly quickly. Chicken pesto tasty but chicken is a little dry.',
        overallRating: 7,
        foodRating: 7.5,
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
    ]);
  }).then((zoccolis: Document) => {
    reviews.push(zoccolis);

    // Howie's Artisan Pizza
    return createRestaurantReviewDocuments('wBMzAzT3haIsaA0JoDr1-Q', [
      {
        userName: 'lori',
        comments: '',
        overallRating: 5,
        foodRating: 8.5,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
      {
        userName: 'ted',
        comments: 'Pizza Bianco is one of my favorites. Next best - arugula/prosciutto. Pesto is good as well.',
        overallRating: 5,
        foodRating: 8.5,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
    ]);
  }).then((docs: Document) => {
    reviews.push(docs);

    // High Street Market & Deli
    return createRestaurantReviewDocuments('tgx533AzRRPFVdVP2el2rw', [
      {
        userName: 'lori',
        comments: '',
        overallRating: 5,
        foodRating: 5,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
      {
        userName: 'ted',
        comments: 'Turkey and pesto, hold the lettuce',
        overallRating: 5,
        foodRating: 8.5,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
    ]);
  }).then((docs: Document) => {
    reviews.push(docs);

    // Pizza Chicago
    return createRestaurantReviewDocuments('C2e_QIpD0QgiHlu_2Ari0A', [
      {
        userName: 'lori',
        comments: '',
        overallRating: 5,
        foodRating: 5,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
      {
        userName: 'ted',
        comments: 'Buttery crust. Excellent sausage. Watch out for diced tomatoes.',
        overallRating: 5,
        foodRating: 7,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
    ]);
  }).then((docs: Document) => {
    reviews.push(docs);

    // Terun
    return createRestaurantReviewDocuments('pLqiFFz1JScp8wMMyXcx-w', [
      {
        userName: 'lori',
        comments: '',
        overallRating: 5,
        foodRating: 5,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
      {
        userName: 'ted',
        comments: 'Schiacciata (burrata and prosciutto). Terun pizza is 2nd favorite. Pasta with Ragu is really good.',
        overallRating: 5,
        foodRating: 8.5,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
    ]);
  }).then((docs: Document) => {
    reviews.push(docs);

    // Napoletana Pizzeria
    return createRestaurantReviewDocuments('Ce5JgEwL7G3HwalAFBcZEQ', [
      {
        userName: 'lori',
        comments: '',
        overallRating: 5,
        foodRating: 5,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
      {
        userName: 'ted',
        comments: 'Carbonara really good. Flute limoncello - one of our favorite desserts.',
        overallRating: 5,
        foodRating: 8,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
    ]);
  }).then((docs: Document) => {
    reviews.push(docs);

    // Pizzeria La Bufala
    return createRestaurantReviewDocuments('tXA2SpZ79lyWxuTwjZkkgg', [
      {
        userName: 'lori',
        comments: '',
        overallRating: 5,
        foodRating: 9,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
      {
        userName: 'ted',
        comments: 'Pesto gnocchi is their best menu item. They seem open to letting you build your own pizza even though that is not on the menu.',
        overallRating: 5,
        foodRating: 5,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
    ]);
  }).then((docs: Document) => {
    reviews.push(docs);

    // Sandwich Bug
    return createRestaurantReviewDocuments('tKph0F6dMc9wnxpwjK4upA', [
      {
        userName: 'lori',
        comments: '',
        overallRating: 5,
        foodRating: 5,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
      {
        userName: 'ted',
        comments: 'Bug bread, turkey, pepper jack, garlic & herb, and green pesto. Really good. Pretty big.',
        overallRating: 5,
        foodRating: 8,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
    ]);
  }).then((docs: Document) => {
    reviews.push(docs);

    // Taqueria La Cazuela
    return createRestaurantReviewDocuments('wFEb3Yx4dlwObCeYpm3-Fw', [
      {
        userName: 'lori',
        comments: '',
        overallRating: 5,
        foodRating: 5,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
      {
        userName: 'ted',
        comments: 'Chips / salsa excellent. Burritos are good (no onions / cilanto, hot sauce) but need lots of salsa to make them juicy enough. Excellent outdoor garden seating.',
        overallRating: 5,
        foodRating: 7.5,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
    ]);
  }).then((docs: Document) => {
    reviews.push(docs);

    // Los Gallos Taqueria
    return createRestaurantReviewDocuments('FI5J97RTWw9vxGtLWvpEGA', [
      {
        userName: 'lori',
        comments: '',
        overallRating: 5,
        foodRating: 7.5,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
      {
        userName: 'ted',
        comments: 'Order regular grilled chicken burrito, no salsa, add cheese. Very good but needs lots of salsa.',
        overallRating: 5,
        foodRating: 7.5,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
    ]);
  }).then((docs: Document) => {
    reviews.push(docs);

    // Cafe Iveta
    return createRestaurantReviewDocuments('DT74WaOqIZkiL1otlxNhQg', [
      {
        userName: 'lori',
        comments: '',
        overallRating: 5,
        foodRating: 5,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
      {
        userName: 'ted',
        comments: 'A little inconsistent but used to make excellent lattes with really creamy milk. Spicy egg biscuit is my favorite. We also sometimes get the scrambled egg sandwich. Try the breakfast burrito.',
        overallRating: 5,
        foodRating: 8,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
    ]);
  }).then((docs: Document) => {
    reviews.push(docs);

    // Verve Palo Alto
    return createRestaurantReviewDocuments('AzoWYX6pPjbEMajA86caqg', [
      {
        userName: 'lori',
        comments: '',
        overallRating: 5,
        foodRating: 5,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
      {
        userName: 'ted',
        comments: 'Great outdoor seating.',
        overallRating: 5,
        foodRating: 7,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
    ]);
  }).then((docs: Document) => {
    reviews.push(docs);

    // Firefly
    return createRestaurantReviewDocuments('W0JveBM6AVr35_lr5-EXTg', [
      {
        userName: 'lori',
        comments: '',
        overallRating: 5,
        foodRating: 5,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
      {
        userName: 'ted',
        comments: 'Latte is almost always way too hot, so it\'s good to get to go. I recall really liking the flavor of their coffee.',
        overallRating: 5,
        foodRating: 7,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
    ]);
  }).then((docs: Document) => {
    reviews.push(docs);

    // Saint Frank
    return createRestaurantReviewDocuments('jiVieLy9l_FtoWQASmMlag', [
      {
        userName: 'ted',
        comments: 'Seem really into the coffee making. No syrups.',
        overallRating: 5,
        foodRating: 7,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
      {
        userName: 'lori',
        comments: '',
        overallRating: 5,
        foodRating: 5,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
    ]);
  }).then((docs: Document) => {
    reviews.push(docs);

    // Bluestone Lane
    return createRestaurantReviewDocuments('yVWJXJVDIAmUspOl4t57Dg', [
      {
        userName: 'ted',
        comments: 'Good latte. Great outdoor seating. Food was good, not great but way overpriced.',
        overallRating: 5,
        foodRating: 7,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
      {
        userName: 'lori',
        comments: '',
        overallRating: 5,
        foodRating: 5,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
    ]);
  }).then((docs: Document) => {
    reviews.push(docs);

    // Zombie Runner
    return createRestaurantReviewDocuments('z4RM2qx5Gi-Igsns9e-6Hw', [
      {
        userName: 'ted',
        comments: 'Very good latte.',
        overallRating: 5,
        foodRating: 7,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
      {
        userName: 'lori',
        comments: '',
        overallRating: 5,
        foodRating: 5,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
    ]);
  }).then((docs: Document) => {
    reviews.push(docs);

    // Caffe Bonini
    return createRestaurantReviewDocuments('AqpZTy5jF-lncQ0048LVdA', [
      {
        userName: 'ted',
        comments: 'Really like this place. Good latte.',
        overallRating: 5,
        foodRating: 8,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
      {
        userName: 'lori',
        comments: '',
        overallRating: 5,
        foodRating: 5,
        serviceRating: 5,
        ambienceRating: 5,
        parkingRating: 5,
        menuItemRatings: [],
      },
    ]);
  }).then((docs: Document) => {
    reviews.push(docs);
    return Promise.resolve(reviews);
  });
};

export const populateDb = (request: Request, response: Response, next: any) => {
  let users: any;
  let restaurantCategories: any;
  let restaurants: any;
  let restaurantReviews: any;

  populateUsers()
    .then((userDocuments: Document[]) => {
      users = userDocuments;
      return populateRestaurantCategories();
    }).then((restaurantCategoryDocuments: Document[]) => {
      restaurantCategories = restaurantCategoryDocuments;
      return populateRestaurants();
    }).then((restaurantDocuments: Document[]) => {
      restaurants = restaurantDocuments;
      return populateRestaurantReviews();
    }).then((restaurantReviewDocuments: Document[]) => {
      restaurantReviews = restaurantReviewDocuments;
      console.log('populateDB complete');
      response.status(201).json({
        success: true,
        users,
        restaurantCategories,
        restaurants,
        restaurantReviews,
      });
    });
};
