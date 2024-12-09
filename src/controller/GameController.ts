/*
Facilitates updating the state of the View based on the model (game state). Handles events such as:
    - starting and running the timer
    - showing the results when the timer concludes

More to come!
*/
import { GameModel } from "../model/GameModel";
import { GameView } from "../view/GameView";
import { EndView } from "../view/EndView";
import { CellPosition } from "../types";

function getCellCoordinates(cell: HTMLElement): CellPosition {
  const row = parseInt(cell.getAttribute("data-row") || "0", 10);
  const col = parseInt(cell.getAttribute("data-col") || "0", 10);

  return { row, col };
}

export class GameController {
  private _gameModel: GameModel | null = null;
  private _gameView: GameView | null = null;
  private intervalId: number | null = null;
  private _currentPath: CellPosition[] = [];
  private _foundWords: string[] = [];
  private isSelecting = false;

  constructor(model: GameModel, view: GameView) {
    this._gameModel = model;
    this._gameView = view;

    // Handle mouse events here.
    const boardElement = this._gameView.getBoardElement();
    boardElement.addEventListener("mousedown", this.handleMouseDown.bind(this));
    boardElement.addEventListener("mouseup", this.handleMouseUp.bind(this));
    boardElement.addEventListener("mousemove", this.handleMouseMove.bind(this));
    boardElement.addEventListener(
      "mouseleave",
      this.handleMouseLeave.bind(this),
    );
  }

  initializeGame() {
    // Initiates the game by generating the board and starting the timer.
    this.startTimer();
    this._gameView!.renderBoard(this._gameModel!._board);
  }

  completeSelection() {
    // Inspect the traversed path.
    const pathScore = this._gameModel?.scorePath(this._currentPath)!;
    const wordFromPath = this._currentPath
      .map((pos) => this._gameModel?._board[pos.row][pos.col])
      .join("");

    const notFound = !this._foundWords.includes(wordFromPath);

    if (pathScore > 0 && notFound) {
      this._gameView?.updateScore(this._gameView.getCurrentScore() + pathScore);
      this._gameView?.addFoundWord(wordFromPath);
      this._foundWords.push(wordFromPath);
    }

    // clear the current path, highlighted cells, and drawn arrows
    this._currentPath = [];
    this._gameView?.clearTemporaryHighlights();
    this._gameView?.clearArrows();
  }

  handleMouseDown(event: MouseEvent) {
    const cell = event.target as HTMLElement;

    if (cell.classList.contains("cell")) {
      this.isSelecting = true;
      const position = getCellCoordinates(cell);
      this._currentPath = [position];

      this._gameView?.highlightCell(position.row, position.col, "highlighted");
    }
  }

  handleMouseMove(event: MouseEvent) {
    // Handles mouse movement by adding traversed cells to the currentPath
    if (!this.isSelecting) {
      return;
    }

    const cell = event.target as HTMLElement;
    if (cell && cell.classList.contains("cell")) {
      const cellPosition = getCellCoordinates(cell);
      const alreadyInPath = this._currentPath.some(
        (position) =>
          position.row === cellPosition.row &&
          position.col === cellPosition.col,
      );

      if (!alreadyInPath) {
        const lastPosition = this._currentPath[this._currentPath.length - 1];
        this._currentPath.push(cellPosition);
        const currWord = this._currentPath
          .map((pos) => this._gameModel!._board[pos.row][pos.col])
          .join("");
        this._gameView?.highlightCell(
          cellPosition.row,
          cellPosition.col,
          "highlighted",
        );

        // Draw an arrow from last position to current position
        this._gameView?.drawArrow(lastPosition, cellPosition);

        // Check if the currently highlighted path forms a new valid word. If so, highlight
        // the cells green to reflect this.
        if (
          this._gameModel!.scorePath(this._currentPath) > 0 &&
          !this._foundWords.includes(currWord)
        ) {
          this._currentPath.forEach((cell) => {
            this._gameView?.highlightCell(
              cell.row,
              cell.col,
              "highlighted-green",
            );
          });
        }

        // Found a previously found word - highlight the path orange to reflect this
        else if (this._gameModel!.scorePath(this._currentPath) > 0) {
          this._currentPath.forEach((cell) => {
            this._gameView?.highlightCell(
              cell.row,
              cell.col,
              "highlighted-orange",
            );
          });
        }

        // Otherwise, the word in the current path is not an actual word
        else {
          this._currentPath.forEach((cell) => {
            this._gameView?.highlightCell(cell.row, cell.col, "highlighted");
          });
        }
      }
    }
  }

  handleMouseUp(event: MouseEvent) {
    if (this.isSelecting) {
      this.isSelecting = false;
      this.completeSelection();
    }
  }

  handleMouseLeave(event: MouseEvent) {
    if (this.isSelecting) {
      this.isSelecting = false;
      this.completeSelection();
    }
  }

  startTimer() {
    if (this.intervalId != null) {
      clearInterval(this.intervalId);
    }

    this.intervalId = window.setInterval(() => {
      this._gameModel!.decrementTime();
      this._gameView!._gamePage!.updateTimeDisplay(this._gameModel!.getTime());

      if (this._gameModel!.getTime() <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  endGame() {
    // Ends the game by stopping the timer and converting to the end page
    this.stopTimer();

    // Solve the board to get all the possible words
    const allWords = this._gameModel?.solve();
    const endView = new EndView(
      this._foundWords,
      allWords!,
      this._gameView!.getCurrentScore(),
    );

    if (endView) {
      console.log("DOM connected to the end page.");
    }
  }
}
