import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const RestaurantReviewSchema = new Schema(
  {
    restaurantId: { type: String, required: true},  // MongoDB id of restaurant getting reviewed
    userId: { type: String, required: true },       // MongoDB id of user who authored review
    comments: { type: String },
    taggedEntityRatingIds: [String],                // MongoDB id's of taggedEntityRating objects that refer to specific property of the restaurant visit (the tag)
                                                    //    and the rating of that property
  },
);

export default mongoose.model('RestaurantReview', RestaurantReviewSchema);
