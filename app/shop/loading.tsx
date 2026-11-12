// 在庫の取得などで表示が遅れるときに、白画面の代わりに出す骨組み
export default function ShopLoading() {
  return (
    <main className="flex flex-col animate-pulse" aria-busy="true" aria-label="読み込み中">
      <div className="w-full aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9] bg-gray-100" />
      <div className="max-w-4xl w-full mx-auto px-6 pt-12 pb-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-gray-100 overflow-hidden">
            <div className="aspect-[4/3] bg-gray-100" />
            <div className="p-5 flex flex-col gap-3">
              <div className="h-3 w-16 rounded bg-gray-100" />
              <div className="h-4 w-3/4 rounded bg-gray-100" />
              <div className="h-3 w-full rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
