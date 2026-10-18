export interface FoodAddon {
  id: string;
  name: string;
  price: number;
}

export interface FoodItemEntity {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
  ratingCount: number;
  categoryId: string;
  calories: number;
  prepTimeMinutes: number;
  isPopular: boolean;
  isSpicy: boolean;
  isVegetarian: boolean;
  availableAddons: FoodAddon[];
  createdAt?: string;
  updatedAt?: string;
}
