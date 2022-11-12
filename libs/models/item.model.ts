export interface ItemData {
  by: string;
  descendants?: number;
  id: number;
  kids?: number[];
  score: number;
  time: number;
  title: string;
  text?: string;
  type: string;
  url: string;
}

export interface ItemDataWithNo extends ItemData {
  no: number;
}
