import { Suspense } from "react";
import ConfirmDeleteClient from "./ConfirmDeleteAccountClient";

export default function ConfirmDeletePage() {
  return (
    <Suspense fallback={<div>Sayfa Yükleniyor...</div>}>
      <ConfirmDeleteClient />
    </Suspense>
  );
}
