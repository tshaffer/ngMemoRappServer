export interface FilterSpec {
  categories?: string[];
  location?: GeoLocationSpec;
  menuItems?: string[];
  reviews?: RestaurantReviewSpec;
}

export interface GeoLocationSpec {
  coordinates: number[];
  maxDistance: number;
}

export interface RestaurantReviewSpec extends RestaurantRatings {
  userNames: string[];
}

export interface RestaurantRatings {
  comments?: string;
  overallRating?: number;
  foodRating?: number;
  serviceRating?: number;
  ambienceRating?: number;
  parkingRating?: number;
  outdoorEatingRating?: number;
  menuItemRatings?: MenuItemRating[];
}

export interface MenuItemRating {
  menuItemName: string;
  rating: number;
}

export interface RestaurantType {
  _id: string;
  yelpId: string;
  categoryId: string;
  tagIds: string[];
}
