import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const RestaurantVisitReviewSchema = new Schema(
  {
    restaurantId: { type: String, required: true},  // MongoDB id of restaurant getting reviewed
    userId: { type: String, required: true },       // MongoDB id of user who authored visit review
    date: { type: Date, required: true },
    comments: { type: String },
    tagInstanceIds: [String],                       // Is this really necessary? Remove unless I can come up with an example
                                                    // MongoDB id's of tagInstance objects that refer to specific property of the restaurant visit (the tag)
                                                    //    and the rating of that property
                                                    //    TagInstance properties
                                                    //      tagId: referenced property 
                                                    //      tagTargetId: id of this restaurant review
                                                    //      rating: review value
    // rating information available as follows - not in this table
    //    Tag's: refer to the item getting rated (perVisit = false)
    //    TagInstance's:
    //      tagId: item getting reviewed
    //      tagTargetId: restaurant or restaurantReview? (first guess - restaurant)
    //      rating: for the item getting reviewed at this restaurant
  },
);

export default mongoose.model('RestaurantVisitReview', RestaurantVisitReviewSchema);
