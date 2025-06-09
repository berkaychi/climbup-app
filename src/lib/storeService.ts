import { fetchWithAuth } from "./authFetch";
import { AuthContextType } from "../stores/authStore";
import {
  PurchaseStoreItemRequestDto,
  PurchaseStoreItemResponseDto,
  UseConsumableItemRequestDto,
  UseConsumableItemResponseDto,
} from "../types/store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class StoreService {
  static async purchase(
    storeItemId: number,
    authHelpers: AuthContextType
  ): Promise<PurchaseStoreItemResponseDto> {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/api/Store/purchase`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeItemId } as PurchaseStoreItemRequestDto),
      },
      authHelpers
    );

    const data: PurchaseStoreItemResponseDto = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Store item purchase failed.");
    }

    return data;
  }

  static async useConsumable(
    storeItemId: number,
    authHelpers: AuthContextType
  ): Promise<UseConsumableItemResponseDto> {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/api/Store/use-consumable`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeItemId } as UseConsumableItemRequestDto),
      },
      authHelpers
    );

    const data: UseConsumableItemResponseDto = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Use consumable item failed.");
    }

    return data;
  }
}
