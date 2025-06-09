import Image from "next/image";

export function Logo() {
  return (
    <div className="relative h-8 max-w-[10.847rem]">
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