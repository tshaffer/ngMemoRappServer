import { Document } from 'mongoose';

import {
  UserEntity,
  RestaurantCategoryEntity,
  MenuItemEntity,
} from '../types';
import User from '../models/User';
import RestaurantCategory from '../models/RestaurantCategory';
import MenuItem from '../models/MenuItem';

// export const createUserDocument = (userEntity: UserEntity): Promise<Document | void> => {
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
