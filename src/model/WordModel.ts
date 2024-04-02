import WordTrie from "../trie";
import * as fs from "fs";
import * as path from "path";

export class WordModel {
  public _wordTrie: WordTrie;
  private _dictionaryPath: string = "./words_alpha.txt";

  constructor() {
    this._wordTrie = new WordTrie();
    this.loadDictionary();
  }

  loadDictionary() {
    fs.readFile(
      path.join(__dirname, this._dictionaryPath),
      "utf8",
      (err, data) => {
        if (err) {
          console.error("Error reading the dictionary file: ", err);
          return;
        }
        const words = data.split("\n");
        words.forEach((word) => {
          this._wordTrie.insert(word.trim());
        });
        console.log("Dictionary loaded successfully!");
      },
    );
  }
}
