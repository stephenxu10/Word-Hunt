/*
The game model focuses on keeping track of the game state, including time remaining, board state, 
etc.
*/
import WordTrie from "../trie";

const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
];

// Weights assigned to each letter for randomly generating the board. Prioritizes the most frequent letters.
const letterWeights: { [key: string]: number } = {
    A: 8, B: 2, C: 3, D: 4, E: 8, F: 2, G: 2, H: 6, I: 7, J: 1,
    K: 1, L: 4, M: 2, N: 7, O: 8, P: 2, Q: 1, R: 6, S: 6, T: 9,
    U: 3, V: 1, W: 2, X: 1, Y: 2, Z: 1
  };

const letters = Object.keys(letterWeights);
const totalWeight = letters.reduce((sum, letter) => sum + letterWeights[letter], 0);

function getRandomLetter(): string {
    let random = Math.random() * totalWeight;

    for (const letter of letters) {
        random -= letterWeights[letter];

        if (random <= 0) {
            return letter
        }
    }

    return "E";
}

export class GameModel {
    public _remainingTime : number;
    public _board: string[][] = [];
    public _trie: WordTrie;
    public _boardSize: number; // Assume that the board is a square.

    constructor(startingTime: number, trie: WordTrie, boardSize: number) {
        this._remainingTime = startingTime;
        this._trie = trie;
        this._boardSize = boardSize;
        this._board = this.generateBoard(boardSize)
    }

    decrementTime() {
        if (this._remainingTime > 0) {
            this._remainingTime -= 1;
        }
    }

    getTime(): number {
        return this._remainingTime;
    }

    setTime(newTime: number) {
        this._remainingTime = newTime;
    }

    generateBoard(boardSize: number): string[][] {
        // Randomly generates the board in accordance to letter weights.
        const board = Array.from({ length: boardSize }, () =>
            Array.from({ length: boardSize }, () => getRandomLetter())
          );

        return board;
    }

    solve(): Set<string> {
        // Run DFS from every cell and return the foundWords
        const foundWords = new Set<string>();

        for (let r = 0; r < this._boardSize; r++) {
            for (let c = 0; c < this._boardSize; c++) {
                this.dfs(r, c, this._trie, "", foundWords, new Set<string>());
            }
        }
        return foundWords
    }

    dfs(row: number, col: number, trieNode: WordTrie, prefix: string, foundWords: Set<string>, visited: Set<string>) {
        /*
        A DFS algorithm to find all words on the board given the coordinate row, col location, the set of pre-existing words, 
        and a set of previously visited coordinates.

        Explores all eight directions and recurses on them. Consults the wordTrie to dramatically prune the search path.
        */
        if (row < 0 || row >= this._boardSize || col < 0 || col >= this._boardSize) {
            return;
        }

        const posKey = `${row}, ${col}`
        // Do nothing if already visited.
        if (visited.has(posKey)) {
            return;
        }
        
        // Prune the search if no words can be found from here.
        const char = this._board![row][col];
        if (!trieNode.children.has(char)) {
            return;
        }

        // Otherwise, we recurse on the neighbors
        const nextNode = trieNode.children.get(char)!;
        const newWord = prefix + char;

        // Mark the cell as visited
        visited.add(posKey);

        // Record a complete word, but do not stop since there can exist more words.
        if (nextNode.isEndOfWord) {
            foundWords.add(newWord)
        }

        for (const [dx, dy] of directions) {
            this.dfs(row + dx, col + dy, nextNode, newWord, foundWords, visited)
        }
        
        // Backtrack
        visited.delete(posKey);
    }
}