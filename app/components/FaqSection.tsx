"use client";

import { useState } from "react";
import { FAQS } from "@/lib/faq";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-none">
      <button
        className="w-full flex items-center justify-between gap-4 py-4 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-sm md:text-base font-medium text-[#1a1a1a]">{q}</span>
        <span
          className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold transition-transform duration-200"
          style={{ backgroundColor: "#1a3060", transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          ＋
        </span>
      </button>
      {open && (
        <p className="pb-4 text-sm text-gray-500 leading-relaxed">{a}</p>
      )}
    </div>
  );
}

export default function FaqSection() {
  return (
    <section className="py-16 px-6 md:px-12 bg-gray-50">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <div className="text-center">
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">FAQ</p>
          <h2 className="text-xl md:text-2xl font-bold text-[#3d3d3d]">よくあるご質問</h2>
        </div>
        <div className="bg-white rounded-xl px-6 shadow-sm">
          {FAQS.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
