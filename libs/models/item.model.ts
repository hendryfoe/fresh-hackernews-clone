export interface ItemData {
  by: string;
  descendants?: number;
  id: number;
  kids?: number[];
  score: number;
  time: number; // Unix Time
  title: string;
  text: string;
  type: string; // "job", "story", "comment", "poll", or "pollopt"
  url: string;
  deleted?: boolean;
  dead?: boolean;
  parent?: number;
  poll?: number;
  parts: string;
}
export interface ItemDataWithNo extends ItemData {
  no: number;
}
export interface ItemDataWithChildren extends ItemData {
  children?: ItemDataWithChildren[];
}

export interface ItemDataEntity {
  parent: ItemData;
  children?: ItemDataWithChildren[];
}
