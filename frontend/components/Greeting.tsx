"use client";

import { useAuth } from "@/components/auth/AuthProvider";

/**
 * Sapaan beranda yang sadar sesi: menyapa nama admin bila sudah masuk,
 * selain itu sapaan netral untuk tamu.
 */
export function Greeting() {
  const { user } = useAuth();
  return (
    <div>
      <p className="text-sm text-[var(--text-muted)]">
        Selamat datang di platform belajar budaya
      </p>
      <h1 className="mt-1">
        {user ? (
          <>
            Selamat datang kembali,{" "}
            <span className="text-[var(--accent)]">{user.name}</span>
          </>
        ) : (
          <>
            Selamat belajar, <span className="text-[var(--accent)]">Tamu</span>
          </>
        )}
      </h1>
    </div>
  );
}
