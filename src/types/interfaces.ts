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
