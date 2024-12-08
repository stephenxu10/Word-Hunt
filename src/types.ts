export type Settings = {
  size: number;
  time: number;
};

export type DictionaryInfo = {
  words: Set<string>;
};

export type GameStartEvent = {
  settings: Settings;
}