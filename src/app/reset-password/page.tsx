export const dynamic = "force-dynamic";
import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="text-gray-700 p-6">Yükleniyor...</p>}>
      <ResetPasswordClient />
    </Suspense>
  );
}
