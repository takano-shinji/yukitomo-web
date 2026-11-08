export default function ProductImage({
  src,
  alt,
  fit = "cover",
  onLoad,
}: {
  src?: string;
  alt: string;
  fit?: "cover" | "contain";
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        onLoad={onLoad}
        className={`w-full h-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
      />
    );
  }
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#e8eef8] to-[#f5f7fb] text-xs text-gray-400">
      画像準備中
    </div>
  );
}
