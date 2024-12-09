class GamePage extends HTMLElement {
  private controller: AbortController | null = null;
  public _timeDisplay: HTMLElement | null = null;
  public _scoreBox: HTMLElement | null = null;
  public _wordsTab: HTMLElement | null = null;
  public _gameBoard: HTMLElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    if (this.shadowRoot) {
      // Grab the template for the Game Page
      let template = document.querySelector("#game-template");

      if (!(template instanceof HTMLTemplateElement)) {
        throw new Error("Game page template does not exist");
      } else {
        this.shadowRoot.append(template.content.cloneNode(true));

        // The game timer
        this._timeDisplay = this.shadowRoot.querySelector("#time-remaining");

        // The score box
        this._scoreBox = this.shadowRoot.querySelector("#score")

        // The words tab
        this._wordsTab = this.shadowRoot.querySelector("#found-words")

        // The game board
        this._gameBoard = this.shadowRoot.querySelector("#game-board");
      }
    }
  }

  connectedCallback() {
    // Use this for event handling
    this.controller = new AbortController();
    // const options = { signal: this.controller.signal };

    console.log("Game Page connected to the DOM.");
  }

  disconnectedCallback() {
    this.controller?.abort();
    this.controller = null;
  }

  updateTimeDisplay(timeInSeconds: number) {
    if (this._timeDisplay) {
      // convert to display format
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;

      this._timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
  }
}

customElements.define("game-page", GamePage);

export class GameView {
  public _gamePage: GamePage | null = null;

  constructor(timeInMinutes: number, boardSize: number) {
    const timeInSeconds = timeInMinutes * 60;
    const gamePage = document.createElement("game-page") as GamePage;

    // Replace the DOM with the GamePage
    const app = document.getElementById("app");

    if (app) {
      app.innerHTML = "";
      app.appendChild(gamePage);

      // Adjust the settings
      gamePage.updateTimeDisplay(timeInSeconds);
      console.log(`Requested board size: ${boardSize}`);

      this._gamePage = gamePage;
    }
  }

  getBoardElement() : HTMLElement {
      return this._gamePage!._gameBoard!
  }

  updateScore(newScore: number) {
    if (this._gamePage?._scoreBox) {
      this._gamePage._scoreBox.innerHTML = newScore.toString();
    }
  }

  getCurrentScore() : number {
    if (this._gamePage?._scoreBox) {
      return parseInt(this._gamePage._scoreBox.textContent!)
    } else {
      return 0;
    }
  }

  addFoundWord(word: string) {
    if (this._gamePage?._wordsTab) {
      const wordElement = document.createElement("h3");
      wordElement.classList.add("word");
      wordElement.textContent = word;

      this._gamePage?._wordsTab.appendChild(wordElement);
    }
  }

  highlightCell(row: number, col: number) {
    const cell = this.getBoardElement().querySelector(`[data-row='${row}'][data-col='${col}']`);

    if (cell) {
      cell.classList.add("highlighted");
    }
  }

  clearTemporaryHighlights() {
    const highlightedCells = this.getBoardElement().querySelectorAll(".highlighted");
    highlightedCells.forEach(cell => cell.classList.remove("highlighted"));
  }

  renderBoard(board: string[][]) {
    const boardElement = this.getBoardElement();

    if (boardElement) {
      // Clear any previous board content
      boardElement.innerHTML = "";

      // Add cells to the board
      board.forEach((row, rowIndex) => {
        row.forEach((letter, colIndex) => {
          const cellElement = document.createElement("div");
          cellElement.classList.add("cell");
          cellElement.textContent = letter;
          cellElement.setAttribute("data-row", rowIndex.toString());
          cellElement.setAttribute("data-col", colIndex.toString());
          boardElement.appendChild(cellElement);
        });
      });

      // Apply grid styles dynamically based on the board size
      const gridSize = board.length; // Assuming square grid
      boardElement.style.display = "grid";
      boardElement.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
      boardElement.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
    }
  }
}
