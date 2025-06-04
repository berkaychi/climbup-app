// climbup-app/src/types/store.ts

// Store item available in the store
export interface StoreItemResponseDto {
  storeItemId: number;
  name: string;
  description: string;
  category: string;
  priceSS: number;
  iconUrl: string;
  isConsumable: boolean;
  maxQuantityPerUser: number | null;
  effectDetails: string;
}

// Store item owned by the user
export interface UserStoreItemResponseDto {
  storeItemId: number;
  storeItemName: string;
  storeItemDescription: string;
  storeItemIconUrl: string;
  purchaseDate: string;
  quantity: number;
  isActive: boolean;
  isConsumable: boolean;
  effectDetails: string;
}

// Request DTO for purchasing a store item
export interface PurchaseStoreItemRequestDto {
  storeItemId: number;
}

// Response DTO after purchasing a store item
export interface PurchaseStoreItemResponseDto {
  success: boolean;
  message: string;
  remainingStepstones: number;
  purchasedItem?: StoreItemResponseDto | null;
}

// Request DTO for using a consumable store item
export interface UseConsumableItemRequestDto {
  storeItemId: number;
}

// Response DTO after using a consumable store item
export interface UseConsumableItemResponseDto {
  success: boolean;
  message: string;
  effectActivated?: string;
  remainingQuantity: number;
}
