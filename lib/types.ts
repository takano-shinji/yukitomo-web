export const PREFECTURES: { code: number; name: string }[] = [
  { code: 1, name: "北海道" },
  { code: 2, name: "青森県" },
  { code: 3, name: "岩手県" },
  { code: 4, name: "宮城県" },
  { code: 5, name: "秋田県" },
  { code: 6, name: "山形県" },
  { code: 7, name: "福島県" },
  { code: 8, name: "茨城県" },
  { code: 9, name: "栃木県" },
  { code: 10, name: "群馬県" },
  { code: 11, name: "埼玉県" },
  { code: 12, name: "千葉県" },
  { code: 13, name: "東京都" },
  { code: 14, name: "神奈川県" },
  { code: 15, name: "新潟県" },
  { code: 16, name: "富山県" },
  { code: 17, name: "石川県" },
  { code: 18, name: "福井県" },
  { code: 19, name: "山梨県" },
  { code: 20, name: "長野県" },
  { code: 21, name: "岐阜県" },
  { code: 22, name: "静岡県" },
  { code: 23, name: "愛知県" },
  { code: 24, name: "三重県" },
  { code: 25, name: "滋賀県" },
  { code: 26, name: "京都府" },
  { code: 27, name: "大阪府" },
  { code: 28, name: "兵庫県" },
  { code: 29, name: "奈良県" },
  { code: 30, name: "和歌山県" },
  { code: 31, name: "鳥取県" },
  { code: 32, name: "島根県" },
  { code: 33, name: "岡山県" },
  { code: 34, name: "広島県" },
  { code: 35, name: "山口県" },
  { code: 36, name: "徳島県" },
  { code: 37, name: "香川県" },
  { code: 38, name: "愛媛県" },
  { code: 39, name: "高知県" },
  { code: 40, name: "福岡県" },
  { code: 41, name: "佐賀県" },
  { code: 42, name: "長崎県" },
  { code: 43, name: "熊本県" },
  { code: 44, name: "大分県" },
  { code: 45, name: "宮崎県" },
  { code: 46, name: "鹿児島県" },
  { code: 47, name: "沖縄県" },
];

export const PREFECTURE_LABEL: Record<number, string> = Object.fromEntries(
  PREFECTURES.map((p) => [p.code, p.name])
);

export const PREFECTURE_CODE: Record<string, number> = Object.fromEntries(
  PREFECTURES.map((p) => [p.name, p.code])
);

/** レベル層(1:初心者歓迎 2:中上級者中心 3:オールレベル) */
export const LEVEL_RANGE_LABEL: Record<number, string> = {
  1: "初心者歓迎",
  2: "中上級者中心",
  3: "オールレベル",
};

export type ImageModel = {
  id: string;
  imageURL: string;
  createdDateTime: string;
};

export type GroupMemberModel = {
  accountId: string;
  nickname: string;
  iconImageId?: string;
  iconImageUrl?: string;
  /** メンバーシップ状態(1:承認済 5:招待中 6:申請中 9:ブロック) */
  status?: number;
  isOwner: boolean;
  joinedAt: string;
};

export type ScheduleContentsModel = {
  scheduleCode: string;
  startDate: string;
  endDate: string;
  eventName: string;
  freeSkiAreaName?: string;
  skiAreaId: string;
  isOpen: boolean;
  isRecruitment: boolean;
  comment: string;
  contactAddress: string;
};

export type ScheduleModel = {
  id: string;
  groupId?: string;
  groupName?: string;
  groupImageUrl?: string;
  accountId: string;
  scheduleContents: ScheduleContentsModel;
  commentCount?: number;
  likeCount?: number;
  isLiked?: boolean;
  isYukitomo?: boolean;
};

export type Group = {
  groupId: string;
  groupName: string;
  ownerAccountId: string;
  memberCount: number;
  isOwner?: boolean;
  thumbnailImageId?: string;
  thumbnailImageUrl?: string;
  coverImageId?: string;
  coverImageUrl?: string;
  galleryImageIds?: string[];
  galleryImages?: ImageModel[];
  /** 都道府県コード(1〜47の整数・ゼロ埋めなし) */
  prefectures?: number;
  activityArea?: string;
  activityFrequency?: string;
  levelRange?: number;
  profile?: string;
  recruitmentMessage?: string;
  /** 募集フラグ(1:募集中 0:募集停止) */
  recruitmentFlg?: number;
  /** 公開フラグ(1:公開 0:非公開) */
  publicFlg?: number;
  /** メンバーのスケジュール作成可否(1:メンバー作成可 0:オーナーのみ) */
  memberCanCreateScheduleFlg?: number;
  /** 呼び出し元のステータス(1:承認済 5:招待中 6:申請中 9:ブロック) */
  myStatus?: number;
  webUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  tikTokUrl?: string;
  youtubeUrl?: string;
  // このサイト独自の拡張（実APIでは別エンドポイント getGroupMemberList / getGroupSchedule 相当）
  memberList?: GroupMemberModel[];
  scheduleList?: ScheduleModel[];
};
