export default function ProductImage({ src, alt }: { src?: string; alt: string }) {
  if (src) {
    return <img src={src} alt={alt} className="w-full h-full object-cover" />;
  }
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#e8eef8] to-[#f5f7fb] text-xs text-gray-400">
      画像準備中
    </div>
  );
}
