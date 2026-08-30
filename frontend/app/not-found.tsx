import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-wrap py-20 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
        <Compass size={30} aria-hidden />
      </div>
      <h1 className="mt-6">Laman tidak ditemukan</h1>
      <p className="mx-auto mt-3 max-w-md text-[var(--text-muted)]">
        Sepertinya halaman yang Anda cari tidak tersedia. Kembali ke beranda untuk
        terus belajar wayang Bali.
      </p>
      <Link href="/" className="btn btn-primary mt-6">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
