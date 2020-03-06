import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const RestaurantCategorySchema = new Schema(
  {
    categoryName: { type: String, required: true },
    description: { type: String },
  },
);

export default mongoose.model('RestaurantCategory', RestaurantCategorySchema);
