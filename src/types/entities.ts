export interface UserEntity {
  userName: string;
  password: string;
  email: string;
}

export interface RestaurantCategoryEntity {
  categoryName: string;
  description?: string;
}

export interface MenuItemEntity {
  menuItemName: string;
  description?: string;
}

export interface RestaurantReviewEntity {
  userName: string;
  comments?: string;
  overallRating?: number;
  foodRating?: number;
  serviceRating?: number;
  ambienceRating?: number;
  parkingRating?: number;
  menuItemRatings?: [];
}

export interface RestaurantViewReviewEntity {
  userName: string;
  date: Date;
  comments: string;
}

export interface RestaurantEntity {
  restaurantName: string;
  location?: GeoLocation;
  categoryNames: string[];
  yelpBusinessDetails?: any;
  menuItemNames: string[];
  reviews: RestaurantReviewEntity[];
  visitReviews: RestaurantViewReviewEntity[];
}

export interface GeoLocation {
  type: string;
  coordinates: number[];
}
