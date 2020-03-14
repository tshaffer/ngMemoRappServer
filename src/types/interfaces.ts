export interface FilterSpec {
  categories?: string[];
  menuItems?: string[];
  reviews?: RestaurantReviewSpec;
}

export interface RestaurantReviewSpec {
  userName?: string;
  overallRating?: number;
  foodRating?: number;
  serviceRating?: number;
  ambienceRating?: number;
  parkingRating?: number;
  takeout?: boolean;
}

export interface RestaurantType {
  _id: string;
  yelpId: string;
  categoryId: string;
  tagIds: string[];
}
