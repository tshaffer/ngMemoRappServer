import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const RestaurantSchema = new Schema(
  {
    yelpId: { type: String, required: true },       // Yelp endpoint: /businesses/{id}. Details associated with this restaurant
    categoryId: { type: String, required: true },   // Restaurant category: pizza, burritos, sandwiches, etc. Should it be an array of categories?
                                                    //    and should category be a system tag?
    tagIds: [String],                               // Factual information associated with a restaurant (independent of a review). Not part of the yelp data.
                                                    // Does it just refer to things that are rated, or shouldn't it also include booleans?
                                                    //    booleans
                                                    //        take out available
                                                    //    ratable
                                                    //        menu items
                                                    //    
  },
);

export default mongoose.model('Restaurant', RestaurantSchema);
