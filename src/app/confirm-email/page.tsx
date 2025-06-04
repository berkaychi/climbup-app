export const dynamic = "force-dynamic";
import { Suspense } from "react";
import ConfirmEmailClient from "./ConfirmEmailClient";

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<p className="text-gray-700 p-6">Onaylanıyor...</p>}>
      <ConfirmEmailClient />
    </Suspense>
  );
}
