export default class WordTrie {
  children: Map<string, WordTrie>;
  isEndOfWord: boolean;

  constructor() {
    this.children = new Map<string, WordTrie>();
    this.isEndOfWord = false;
  }

  insert(word: string) {
    let node: WordTrie = this;
    let i = 0;

    while (i < word.length) {
      let char = word[i].toUpperCase();
      if (!node.children.has(char)) {
        node.children.set(char, new WordTrie());
      }
      node = node.children.get(char)!;
      i = i + 1;
    }
    node.isEndOfWord = true;
  }

  search(word: string) {
    let node: WordTrie = this;
    for (let i = 0; i < word.length; i++) {
      let char = word[i];

      if (node.children.has(char)) {
        node = node.children.get(char)!;
      } else {
        return false;
      }
    }
    return node.isEndOfWord;
  }

  startsWith(prefix: string) {
    let node: WordTrie = this;
    for (let i = 0; i < prefix.length; i++) {
      let char = prefix[i];

      if (node.children.has(char)) {
        node = node.children.get(char)!;
      } else {
        return false;
      }
    }
    return true;
  }
}
