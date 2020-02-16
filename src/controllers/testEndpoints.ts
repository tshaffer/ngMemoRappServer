import { Request, Response } from 'express';
import Restaurant from '../models/Restaurant';
import RestaurantCategory from '../models/RestaurantCategory';
import Tag from '../models/Tag';
import TagInstance from '../models/TagInstance';
import User from '../models/User';

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

export function createTagInstance(request: Request, response: Response, next: any) {
  console.log('createTagInstance');
  console.log(request.body);
  TagInstance.create(request.body).then((tagInstance: any) => {
    response.status(201).json({
      success: true,
      data: tagInstance,
    });
  });
}

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

