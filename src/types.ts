export type LangLevel = 'Casual'|'Formal'|'Neutral';

export interface FormData {
  sentence: string;
  engTrans: string;
  jpnTrans: string;
  lngProtoc?: LangLevel;
  rcdID?: string;
};
