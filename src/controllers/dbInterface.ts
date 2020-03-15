import { Document } from 'mongoose';

import {
  UserEntity,
  RestaurantCategoryEntity,
  RestaurantEntity,
  MenuItemEntity,
  RestaurantReviewEntity,
} from '../types';
import User from '../models/User';
import RestaurantCategory from '../models/RestaurantCategory';
import MenuItem from '../models/MenuItem';
import Restaurant from '../models/Restaurant';

export const createUserDocuments = (userDocuments: UserEntity[]): Promise<Document[]> => {
  return new Promise((resolve: any, reject: any) => {
    User.collection.insert(userDocuments, (err, docs) => {
      if (err) {
        console.log(err);
        if (err.code === 11000) {
          console.log('createUserDocuments: duplicate key error');
          resolve([]);
        } else {
          reject(err);
        }
      }
      else {
        console.log(docs);
        resolve(docs);
      }
    });
  });
};

export const createRestaurantCategoryDocuments = (restaurantCategories: RestaurantCategoryEntity[]): Promise<Document[]> => {
  return new Promise((resolve: any, reject: any) => {
    RestaurantCategory.collection.insert(restaurantCategories, (err, docs) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      else {
        console.log(docs);
        resolve(docs);
      }
    });
  });
};

export const createMenuItemDocuments = (menuItems: MenuItemEntity[]): Promise<Document[]> => {
  return new Promise((resolve: any, reject: any) => {
    MenuItem.collection.insert(menuItems, (err, docs) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      else {
        console.log(docs);
        resolve(docs);
      }
    });
  });
};

export const createUserDocument = (userEntity: UserEntity): Promise<any> => {
  return User.create(userEntity)
    .then((user: Document) => {
      return Promise.resolve(user);
    });
};

export const createRestaurantCategoryDocument = (restaurantCategoryEntity: RestaurantCategoryEntity): Promise<any> => {
  return RestaurantCategory.create(restaurantCategoryEntity)
    .then((user: Document) => {
      return Promise.resolve(user);
    });
};

export const createMenuItemDocument = (menuItemEntity: MenuItemEntity): Promise<any> => {
  return MenuItem.create(menuItemEntity)
    .then((user: Document) => {
      return Promise.resolve(user);
    });
};

export const createRestaurantDocuments = (restaurants: RestaurantEntity[]): Promise<Document[]> => {
  return new Promise((resolve: any, reject: any) => {
    Restaurant.collection.insert(restaurants, (err, docs) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      else {
        console.log(docs);
        resolve(docs);
      }
    });
  });
};

export const createRestaurantReviewDocuments = (yelpId: string, reviews: RestaurantReviewEntity[]): Promise<Document> => {
  
  const query = Restaurant.findOneAndUpdate(
    { 'yelpBusinessDetails.id': yelpId },
    { reviews },
  );
  
  const promise: Promise<Document> = query.exec();
  return promise
    .then((restaurant: Document) => {
      return Promise.resolve(restaurant);
    }).catch( (err: any) => {
      console.log(err);
      debugger;
      return Promise.reject(err);
    });
};
