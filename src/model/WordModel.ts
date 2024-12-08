import WordTrie from "../trie";

export class WordModel {
  public _wordTrie: WordTrie;

  constructor() {
    this._wordTrie = new WordTrie();
  }

  loadDictionaryFromFile(file: File) {
    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      const text = event.target?.result as string | null;

      if (text) {
        const words = text.split("\n");
        words.forEach((word) => {
          this._wordTrie.insert(word.trim());
        });
        console.log("Dictionary loaded successfully!");
      } else {
        console.error("No text found in file.");
      }
    };

    reader.onerror = (event) => {
      console.error("Error reading the dictionary file:", event.target?.error);
    };

    reader.readAsText(file);
  }
}
