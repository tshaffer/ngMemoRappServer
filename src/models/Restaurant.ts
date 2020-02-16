import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const RestaurantSchema = new Schema(
  {
    yelpId: { type: Number, required: true },
    categoryId: { type: Number, required: true },
    tags: [Number],
  },
);

export default mongoose.model('Restaurant', RestaurantSchema);
