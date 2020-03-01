export interface RestaurantType {
  _id: string;
  yelpId: string;
  categoryId: string;
  tagIds: string[];
}

export interface TagValueRequest {
  id: string;
  operator: string;
  value: number;
}
