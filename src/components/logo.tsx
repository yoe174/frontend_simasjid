import Image from "next/image";

export function Logo() {
  return (
    <div className="relative h-16 max-w-[18rem]"> {/* Lebih besar lagi */}
      <Image
        src="/image/logobaru.png"
        fill
        alt="Logo Aplikasi Anda"
        role="presentation"
        quality={100}
        className="object-contain"
      />
    </div>
  );
}