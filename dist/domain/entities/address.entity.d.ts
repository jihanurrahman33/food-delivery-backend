export interface AddressEntity {
    id: string;
    userId: string;
    label: string;
    fullAddress: string;
    street: string;
    apartment?: string;
    deliveryNotes?: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface PaymentCardEntity {
    id: string;
    userId: string;
    cardHolderName: string;
    cardNumber: string;
    expiryDate: string;
    brand: string;
    isDefault: boolean;
    createdAt: string;
}
