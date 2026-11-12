import Image from "next/image";

export default function ProductImage({
  src,
  alt,
  fit = "cover",
  onLoad,
  sizes = "(min-width: 768px) 50vw, 100vw",
  priority = false,
}: {
  src?: string;
  alt: string;
  fit?: "cover" | "contain";
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
  /** 画面に出る大きさの目安。小さく出す所は小さく指定して、読み込む画像を軽くする */
  sizes?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onLoad={onLoad}
          className={fit === "contain" ? "object-contain" : "object-cover"}
        />
      </div>
    );
  }
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#e8eef8] to-[#f5f7fb] text-xs text-gray-400">
      画像準備中
    </div>
  );
}
