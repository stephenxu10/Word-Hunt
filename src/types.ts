export type Settings = {
  size: number;
  time: number;
};

export type DictionaryInfo = {
  file: File;
};

export type GameStartEvent = {
  settings: Settings;
}