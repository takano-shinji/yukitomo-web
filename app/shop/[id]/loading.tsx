// 商品ページの読み込み中に出す骨組み
export default function ProductLoading() {
  return (
    <main
      className="max-w-5xl mx-auto px-6 py-8 md:py-12 grid grid-cols-1 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-8 md:gap-12 animate-pulse"
      aria-busy="true"
      aria-label="読み込み中"
    >
      <div className="aspect-[4/3] rounded-xl bg-gray-100" />
      <div className="flex flex-col gap-4">
        <div className="h-6 w-3/4 rounded bg-gray-100" />
        <div className="h-8 w-32 rounded bg-gray-100" />
        <div className="h-12 w-full rounded bg-gray-100" />
      </div>
    </main>
  );
}
