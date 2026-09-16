export default function AppBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <a
        href="https://apps.apple.com/jp/app/%E9%9B%AA%E3%81%A8%E3%82%82/id1550594097"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download on the App Store"
      >
        <img
          src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
          alt="Download on the App Store"
          className="h-12"
        />
      </a>
      <a
        href="https://play.google.com/store/apps/details?id=com.yukitomo.app&hl=ja"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get it on Google Play"
      >
        {/* Google Playバッジは画像に余白が内包されているため高さを大きく設定 */}
        <img
          src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
          alt="Get it on Google Play"
          className="h-[64px]"
        />
      </a>
    </div>
  );
}
