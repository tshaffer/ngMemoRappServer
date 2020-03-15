import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

// https://stackoverflow.com/questions/29299477/how-to-create-and-use-enum-in-mongoose
const RestaurantSchema = new Schema(
  {
    restaurantName: { type: String, required: true },             // possibly duplicates yelp name
    categoryNames: [{ type: String }],                       // Restaurant category: pizza, burritos, sandwiches, etc. Should it be an array of categories?
    yelpBusinessDetails: { type: Schema.Types.Mixed},   // Details associated with this restaurant
    
    // https://stackoverflow.com/questions/42019679/object-type-in-mongoose
    menuItemNames: [{ type: String }], 

    // https://mongoosejs.com/docs/customschematypes.html
    reviews: [{
      userName: { type: String, required: true },
      comments: { type: String },
      overallRating: { type: Number},
      foodRating: { type: Number},
      serviceRating: { type: Number},
      ambienceRating: { type: Number },
      parkingRating: { type: Number },
      outdoorEatingRating: { type: Number },
      menuItemRatings: [{
        menuItemName: { type: String, required: true },
        rating: { type: Number },
        comments: { type: String },
      }],
    }],
    visitReviews: [{
      userName: { type: String, required: true },
      date: { type: Date, default: Date.now, required: true },
      comments: { type: String, required: true },
    }],
  },
);

export default mongoose.model('Restaurant', RestaurantSchema);
