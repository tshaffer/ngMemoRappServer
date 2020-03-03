import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

// https://stackoverflow.com/questions/29299477/how-to-create-and-use-enum-in-mongoose
const RestaurantSchema = new Schema(
  {
    name: { type: String, required: true },             // possibly duplicates yelp name
    // or categoryId?
    category: [{ type: String }],                       // Restaurant category: pizza, burritos, sandwiches, etc. Should it be an array of categories?
    overallRating: { type: Number },                    // in db, or calculated from reviews?
    foodRating: { type: Number },                       // in db, or calculated from reviews?
    serviceRating: { type: Number },                    // in db, or calculated from reviews?
    yelpBusinessDetails: { type: Schema.Types.Mixed},   // Details associated with this restaurant
    
    // https://stackoverflow.com/questions/42019679/object-type-in-mongoose
    menuItems: [{
      menuItemName: { type: String, required: true },
    }],

    // https://mongoosejs.com/docs/customschematypes.html
    reviews: [{
      user: { type: String, required: true },
      comments: { type: String },
      overallRating: { type: Number},
      foodRating: { type: Number},
      serviceRating: { type: Number},
      menuItemRatings: [{
        menuItemName: { type: String, required: true },
        rating: { type: Number },
        comments: { type: String },
      }],
    }],
    visitReviews: [{
      user: { type: String, required: true },
      date: { type: Date, default: Date.now, required: true },
      comments: { type: String, required: true },
    }],
  },
);

export default mongoose.model('Restaurant', RestaurantSchema);
