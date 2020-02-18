import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const RestaurantVisitReviewSchema = new Schema(
  {
    restaurantId: { type: String, required: true},  // MongoDB id of restaurant getting reviewed
    userId: { type: String, required: true },       // MongoDB id of user who authored visit review
    date: { type: Date, required: true },
    comments: { type: String },
    taggedEntityRatingIds: [String],                       // Is this really necessary? Remove unless I can come up with an example
  },
);

export default mongoose.model('RestaurantVisitReview', RestaurantVisitReviewSchema);
