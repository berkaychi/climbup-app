"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useStoreItems } from "@/hooks/useStoreItems";
import { StoreService } from "@/lib/storeService";

const StorePage = () => {
  const authHelpers = useAuth();
  const { user, isLoading: authLoading } = authHelpers;
  const router = useRouter();
  const { userProfile, isLoadingUserProfile, mutateUserProfile } =
    useUserProfile();
  const { storeItems, isLoadingStoreItems, storeItemsError, mutateStoreItems } =
    useStoreItems();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div>Loading...</div>
      </div>
    );
  }

  if (isLoadingUserProfile || isLoadingStoreItems) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div>Loading store...</div>
      </div>
    );
  }

  if (storeItemsError) {
    return (
      <div className="text-center text-red-500">Error loading store items</div>
    );
  }

  const handlePurchase = async (itemId: number, price: number) => {
    const balance = userProfile?.stepstones ?? 0;
    if (balance < price) {
      alert("Yetersiz stepstone bakiyesi.");
      return;
    }
    try {
      const response = await StoreService.purchase(itemId, authHelpers);
      alert(response.message);
      mutateUserProfile();
      mutateStoreItems();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      alert(message || "Satın alma sırasında bir hata oluştu.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Mağaza</h1>
      <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">
        Bakiyeniz:{" "}
        <span className="font-semibold">{userProfile?.stepstones ?? 0}</span> 🪙
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {storeItems?.map((item) => (
          <div
            key={item.storeItemId}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-lg p-4 shadow-lg"
          >
            <img
              src={item.iconUrl}
              alt={item.name}
              className="w-16 h-16 mx-auto mb-2"
            />
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-1">
              {item.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {item.description}
            </p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold">{item.priceSS} 🪙</span>
              <button
                onClick={() => handlePurchase(item.storeItemId, item.priceSS)}
                disabled={(userProfile?.stepstones ?? 0) < item.priceSS}
                className={`px-3 py-1 text-sm font-medium rounded ${
                  (userProfile?.stepstones ?? 0) < item.priceSS
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
              >
                Satın Al
              </button>
            </div>
          </div>
        ))}
        {!storeItems?.length && (
          <p className="col-span-full text-center text-gray-500">
            Mağazada ürün bulunmuyor.
          </p>
        )}
      </div>
    </div>
  );
};

export default StorePage;
