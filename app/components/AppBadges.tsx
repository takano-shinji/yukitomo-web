export default function AppBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <a href="#" aria-label="Download on the App Store">
        <img
          src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
          alt="Download on the App Store"
          className="h-12"
        />
      </a>
      <a href="#" aria-label="Get it on Google Play">
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
