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
  // menuItemRatings?: [];
}

export interface RestaurantViewReviewEntity {
  userName: string;
  date: Date;
  comments: string;
}

export interface RestaurantEntity {
  restaurantName: string;
  categoryNames: string[];
  yelpBusinessDetails?: any;
  menuItemNames: string[];
  reviews: RestaurantReviewEntity[];
  visitReviews: RestaurantViewReviewEntity[];
}
