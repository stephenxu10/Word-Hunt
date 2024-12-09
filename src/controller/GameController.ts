/*
Facilitates updating the state of the View based on the model (game state). Handles events such as:
    - starting and running the timer
    - showing the results when the timer concludes

More to come!
*/
import { GameModel } from "../model/GameModel";
import { GameView } from "../view/GameView";
import { CellPosition } from "../types";

function getCellCoordinates(cell: HTMLElement): CellPosition {
  const row = parseInt(cell.getAttribute("data-row") || "0", 10);
  const col = parseInt(cell.getAttribute("data-col") || "0", 10);

  return {row, col};
}

export class GameController {
  private _gameModel: GameModel | null = null;
  private _gameView: GameView | null = null;
  private intervalId: number | null = null;
  private _currentPath: CellPosition[] = [];
  private isSelecting = false;

  constructor(model: GameModel, view: GameView) {
    this._gameModel = model;
    this._gameView = view;

    // Handle mouse events here.
    const boardElement = this._gameView.getBoardElement();
    boardElement.addEventListener("mousedown", this.handleMouseDown.bind(this));
    boardElement.addEventListener("mouseup", this.handleMouseUp.bind(this));
    boardElement.addEventListener("mousemove", this.handleMouseMove.bind(this));
    boardElement.addEventListener("mouseleave", this.handleMouseLeave.bind(this));
  }

  initializeGame() {
    // Initiates the game by generating the board and starting the timer.
    this.startTimer();
    this._gameView!.renderBoard(this._gameModel!._board);
  }

  completeSelection() {
    // Inspect the traversed path.
    const pathScore = this._gameModel?.scorePath(this._currentPath)!;

    if (pathScore > 0) {
      this._gameView?.updateScore(this._gameView.getCurrentScore() + pathScore)
      this._gameView?.addFoundWord(this._currentPath.map(pos => this._gameModel?._board[pos.row][pos.col]).join(""))
    } 

    // clear the current path and highlighted cells
    this._currentPath = [];
    this._gameView?.clearTemporaryHighlights();
  }
  
  handleMouseDown(event: MouseEvent) {
    const cell = event.target as HTMLElement;

    if (cell.classList.contains("cell")) {
      this.isSelecting = true;
      const position = getCellCoordinates(cell);
      this._currentPath = [position];

      this._gameView?.highlightCell(position.row, position.col);
    }
  }

  handleMouseMove(event: MouseEvent) {
    // Handles mouse movement by adding traversed cells to the currentPath
    if (!this.isSelecting) {
      return
    }

    const cell = event.target as HTMLElement;
    if (cell && cell.classList.contains("cell")) {
      const cellPosition = getCellCoordinates(cell);
      const alreadyInPath = this._currentPath.some(
        position => position.row === cellPosition.row && position.col === cellPosition.col
      );

      if (!alreadyInPath) {
        this._currentPath.push(cellPosition);
        this._gameView?.highlightCell(cellPosition.row, cellPosition.col);
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
        this.stopTimer();

        // Handle game ending logic and what not
      }
    }, 1000);
  }

  stopTimer() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
