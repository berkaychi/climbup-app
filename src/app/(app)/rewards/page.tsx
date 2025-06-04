"use client";
import React from "react";

const RewardsPage = () => (
  <div className="max-w-3xl mx-auto p-6 space-y-8">
    <h1 className="text-3xl font-bold">Ödüller ve Puanlama Kuralları</h1>

    <section>
      <h2 className="text-2xl font-semibold mb-4">1. Steps (S) Kazanma</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>
          <strong>Dakika Başına:</strong> Her tamamlanan odak dakikası için 1 S
        </li>
        <li>
          <strong>Seans Bonusu:</strong>
          <ul className="list-disc list-inside ml-6 mt-1">
            <li>5–14 dk: +5 S</li>
            <li>15–29 dk: +10 S</li>
            <li>30–44 dk: +20 S</li>
            <li>45–59 dk: +30 S</li>
            <li>60+ dk: +40 S</li>
          </ul>
        </li>
        <li>
          <strong>Streak Çarpanı:</strong>
          <ul className="list-disc list-inside ml-6 mt-1">
            <li>0–2 gün seri: 1.0×</li>
            <li>3–6 gün seri: 1.2×</li>
            <li>7–13 gün seri: 1.5×</li>
            <li>14–29 gün seri: 1.8×</li>
            <li>30+ gün seri: 2.0×</li>
          </ul>
        </li>
      </ul>
    </section>

    <section>
      <h2 className="text-2xl font-semibold mb-4">
        2. Ek Anlık Steps Kaynakları
      </h2>
      <ul className="list-disc list-inside space-y-2">
        <li>
          <strong>ToDo Tamamlama Bonusu:</strong> +20 S (otomatik + FocusSession
          ilişkili tamamlanınca)
        </li>
        <li>
          <strong>“Yeni Rota” Keşfi:</strong>
          <ul className="list-disc list-inside ml-6 mt-1">
            <li>İlk kez farklı SessionType: +50 S</li>
            <li>İlk kez yeni özel Tag kullanımı: +50 S</li>
          </ul>
        </li>
      </ul>
    </section>

    <section>
      <h2 className="text-2xl font-semibold mb-4">
        3. Rozet Kilometre Taşları
      </h2>
      <ul className="list-disc list-inside space-y-2">
        <li>
          <strong>Zirve Akıncısı</strong> (completed_focus_sessions):
          <ul className="list-disc list-inside ml-6 mt-1">
            <li>5 seans: +50 S</li>
            <li>20 seans: +100 S</li>
            <li>50 seans: +200 S</li>
          </ul>
        </li>
        <li>
          <strong>İrtifa Koleksiyoncusu</strong> (total_focus_duration_hours):
          <ul className="list-disc list-inside ml-6 mt-1">
            <li>10 saat: +75 S</li>
            <li>50 saat: +150 S</li>
            <li>150 saat: +275 S</li>
          </ul>
        </li>
        <li>
          <strong>Malzeme Depocusu</strong> (total_todos_completed):
          <ul className="list-disc list-inside ml-6 mt-1">
            <li>10 görev: +60 S</li>
            <li>50 görev: +120 S</li>
            <li>150 görev: +240 S</li>
          </ul>
        </li>
      </ul>
    </section>

    <section>
      <h2 className="text-2xl font-semibold mb-4">
        4. Stepstones (SS) ve Dönüşüm
      </h2>
      <p>Her 10 Steps (S) = 1 Stepstone (SS)</p>
    </section>
  </div>
);

export default RewardsPage;
