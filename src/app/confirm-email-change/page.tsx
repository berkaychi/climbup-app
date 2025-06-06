export const dynamic = "force-dynamic";
import { Suspense } from "react";
import ConfirmEmailChangeClient from "./ConfirmEmailChangeClient";

export default function ConfirmEmailChangePage() {
  return (
    <Suspense fallback={<p className="text-gray-700 p-6">Onaylanıyor...</p>}>
      <ConfirmEmailChangeClient />
    </Suspense>
  );
}
