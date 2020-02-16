import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const RestaurantSchema = new Schema(
  {
    yelpId: { type: String, required: true },
    categoryId: { type: String, required: true },
    tags: [String],
  },
);

export default mongoose.model('Restaurant', RestaurantSchema);
