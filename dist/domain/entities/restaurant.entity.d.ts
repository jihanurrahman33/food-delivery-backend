export interface RestaurantEntity {
    id: string;
    name: string;
    imageUrl: string;
    logoUrl: string;
    rating: number;
    ratingCount: number;
    deliveryTime: string;
    deliveryFee: number;
    distanceKm: number;
    address: string;
    tags: string[];
    isOpen: boolean;
    isFeatured: boolean;
    isFavorite?: boolean;
    chefUserId?: string;
    createdAt?: string;
    updatedAt?: string;
}
