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

export class GameModel {
    private _remainingTime : number;
    private _board: string[][] | null;
    private _trie: WordTrie;
    private _boardSize: number; // Assume that the board is a square.

    constructor(board: string[][] | null, startingTime: number, trie: WordTrie, boardSize: number) {
        this._remainingTime = startingTime;
        this._board = board;
        this._trie = trie;
        this._boardSize = boardSize;
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