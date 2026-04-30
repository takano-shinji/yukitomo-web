export type Level = "beginner" | "allround" | "advanced";

export type Member = {
  id: string;
  name: string;
  iconUrl: string;
};

export type ScheduleItem = {
  date: string;
  place: string;
  content: string;
};

export type SnsLinks = {
  website?: string;
  instagram?: string;
  x?: string;
  line?: string;
};

export type Group = {
  id: string;
  name: string;
  iconUrl: string;
  recruitment: string;
  owner: Member;
  members: Member[];
  location: string;
  activityArea: string;
  level: Level;
  frequency: string;
  description: string;
  schedule: ScheduleItem[];
  gallery: string[];
  sns?: SnsLinks;
};
