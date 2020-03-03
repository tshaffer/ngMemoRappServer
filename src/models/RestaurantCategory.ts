import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const RestaurantCategorySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
);

export default mongoose.model('RestaurantCategory', RestaurantCategorySchema);
