import Image from "next/image";

export function Logo() {
  return (
    <div className="flex items-center justify-center h-24"> {/* Center + cukup tinggi */}
      <Image
        src="/image/logobaru.png"
        width={200}   // Ganti sesuai kebutuhan
        height={200}  // Ganti sesuai proporsi logo
        alt="Logo Aplikasi Anda"
        quality={100}
        className="object-contain"
      />
    </div>
  );
}
