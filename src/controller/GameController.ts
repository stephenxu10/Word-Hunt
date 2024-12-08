/*
Facilitates updating the state of the View based on the model (game state). Handles events such as:
    - starting and running the timer
    - showing the results when the timer concludes

More to come!
*/
import { GameModel } from "../model/GameModel";
import { GameView } from "../view/GameView";

export class GameController {
    private _gameModel : GameModel | null = null;
    private _gameView: GameView | null = null;
    private intervalId: number | null = null;

    constructor(model: GameModel, view: GameView) {
        this._gameModel = model;
        this._gameView = view;
    }

    startTimer() {
        if (this.intervalId != null) {
            clearInterval(this.intervalId);
        }

        this.intervalId = window.setInterval(() => {
            this._gameModel!.decrementTime();
            this._gameView!._gamePage!.updateTimeDisplay(this._gameModel!.getTime())

            if (this._gameModel!.getTime() <= 0) {
                this.stopTimer();

                // Handle game ending logic and what not
            }
        }, 1000)
    }

    stopTimer() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        } 
    }
}