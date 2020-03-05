import { Document } from 'mongoose';

import { UserEntity } from '../types';
import User from '../models/User';

// export const createUserDocument = (userEntity: UserEntity): Promise<Document | void> => {
export const createUserDocument = (userEntity: UserEntity): Promise<any> => {
  return User.create(userEntity)
    .then((user: Document) => {
      return Promise.resolve(user);
    });
};
