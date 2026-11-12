"use client";

import { useState } from "react";
import ProductImage from "../ProductImage";
import { focusRing } from "../ui";

// 大きい写真の枠の縦横比（横長の写真は4:3、縦長の画像は最大で4:5まで高くする）
const WIDEST = 4 / 3;
const TALLEST = 4 / 5;

export default function Gallery({ images, alt }: { images?: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const list = images ?? [];
  const current = list[index];
  const ratio = Math.min(WIDEST, Math.max(TALLEST, (current && ratios[current]) || WIDEST));

  return (
    <div className="flex flex-col gap-3">
      <div
        className="rounded-xl overflow-hidden bg-gray-50 border border-gray-100"
        style={{ aspectRatio: String(ratio) }}
      >
        {current ? (
          // 拡大して見られるよう、クリックで画像だけを別タブで開く
          <a
            href={current}
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-full h-full cursor-zoom-in ${focusRing}`}
            aria-label="画像を拡大して見る"
          >
            <ProductImage
              src={current}
              alt={alt}
              fit="contain"
              priority
              onLoad={(e) => {
                const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
                if (w && h) setRatios((r) => (r[current] ? r : { ...r, [current]: w / h }));
              }}
            />
          </a>
        ) : (
          <ProductImage alt={alt} fit="contain" />
        )}
      </div>
      {list.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {list.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`画像${i + 1}を表示`}
              aria-current={i === index}
              className={`aspect-[4/3] rounded-lg overflow-hidden bg-gray-50 border-2 transition-colors ${focusRing} ${
                i === index ? "border-[#1a3060]" : "border-transparent hover:border-gray-300"
              }`}
            >
              <ProductImage src={src} alt="" fit="cover" sizes="160px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
