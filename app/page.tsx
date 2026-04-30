import { getGroups } from "@/lib/api";
import GroupsSection from "@/app/components/GroupsSection";
import AppBadges from "@/app/components/AppBadges";
import FaqSection from "@/app/components/FaqSection";

const HERO_BG = "https://storage.googleapis.com/studio-design-asset-files/projects/EjOQJw1oqJ/s-961x1704_v-fms_webp_cff9f9ba-5af5-40b1-a1b3-2fd5f8504676.webp";

export default async function Home() {
  const groups = await getGroups();

  return (
    <main className="flex flex-col">
      {/* Section 1: キャッチコピー */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 md:px-12 bg-white">
        <img src="/雪ともロゴ.png" alt="雪とも" className="w-32 md:w-40 mb-8 md:mb-10" />
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#3d3d3d] mb-6 md:mb-8 leading-relaxed">
          一人で滑るよりも、みんなで滑る方がもっと楽しい！
        </h1>
        <p className="text-sm md:text-base text-[#3d3d3d] mb-3">
          全国のスキー・スノボサークル、クラブチームが集結。
        </p>
        <p className="text-sm md:text-base text-[#3d3d3d] mb-10 md:mb-12">
          あなたのレベルやホームゲレンデに合わせて、
          <br />
          最高の「雪とも」が見つかる。
        </p>
      </section>

      <GroupsSection groups={groups} heroBg={HERO_BG} />

      {/* ご利用の流れ */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-10">
          <h2 className="text-xl md:text-2xl font-bold text-[#3d3d3d] tracking-wide">ご利用の流れ</h2>
          <div className="w-full flex flex-col gap-6">
            {[
              {
                step: "01",
                title: "アプリをダウンロード",
                desc: "App Store または Google Play から「雪とも」を無料でダウンロード。",
              },
              {
                step: "02",
                title: "グループを探す",
                desc: "所在地やレベルで絞り込み、自分に合ったグループを見つける。",
              },
              {
                step: "03",
                title: "オーナーにメッセージを送る",
                desc: "気になるグループのオーナーに参加申請のメッセージを送って、一緒に滑ろう！",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex items-start gap-5">
                <div
                  className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: "#1a3060" }}
                >
                  {step}
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-bold text-[#1a1a1a] mb-1">{title}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <AppBadges />
        </div>
      </section>

      {/* グループオーナー向け */}
      <section className="py-16 px-6 md:px-12" style={{ backgroundColor: "#2d3f55" }}>
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-8 text-center">
          <p className="text-xs tracking-widest text-white/60 uppercase">For Group Owners</p>
          <h2 className="text-xl md:text-2xl font-bold text-white leading-relaxed">
            メンバー募集をしたい方はこちら
          </h2>
          <p className="text-sm text-white/70 leading-relaxed">
            新しく仲間を探している人が一番気にするのは、
            <br />
            <span className="text-white font-medium">「どんな人がいるか」</span>と<span className="text-white font-medium">「どんな活動をしているか」</span>です。
          </p>

          {/* アテンション */}
          <div className="flex items-center gap-3 w-full">
            <div className="flex-1 h-px bg-white/20" />
            <div className="flex items-center gap-2 bg-yellow-400 text-[#1a3060] text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
              🏔 メンバー募集のポイント！
            </div>
            <div className="flex-1 h-px bg-white/20" />
          </div>

          {/* 2ステップ */}
          <div className="w-full flex flex-col gap-4 text-left">
            <div className="bg-white/10 rounded-xl p-5 flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                01
              </div>
              <div>
                <p className="text-white font-bold mb-1">メンバーリストを充実させる</p>
                <p className="text-sm text-white/70 leading-relaxed">
                  既存のメンバーを雪ともアプリに招待して、グループページのメンバー一覧を充実させましょう。どんな仲間がいるかが伝わると、参加希望者が安心して応募できます。
                </p>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-5 flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                02
              </div>
              <div>
                <p className="text-white font-bold mb-1">活動スケジュールを登録する</p>
                <p className="text-sm text-white/70 leading-relaxed">
                  いつ・どこで滑るかをスケジュールに登録しましょう。活動の頻度や場所が明確なグループほど、グループ一覧の上位に表示され、新規メンバーに見つけてもらいやすくなります。
                </p>
              </div>
            </div>
          </div>

          <AppBadges />
          <p className="text-xs text-white/50">グループの作成はアプリから無料で行えます</p>
        </div>
      </section>

      <FaqSection />

      {/* Section 5: CTA */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div
          className="max-w-3xl mx-auto rounded-xl py-12 md:py-16 px-6 md:px-12 flex flex-col items-center gap-8 text-center"
          style={{ backgroundColor: "#1a3060" }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-white">
            さあ、雪ともと最高のシーズンを作ろう！
          </h2>
          <AppBadges />
        </div>
      </section>
    </main>
  );
}
