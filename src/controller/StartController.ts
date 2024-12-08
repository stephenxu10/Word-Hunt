import { StartView } from "../view/StartView";
import { WordModel } from "../model/WordModel";
import { DictionaryInfo, GameStartEvent} from "../types";
import { GameView } from "../view/GameView";
import { GameModel } from "../model/GameModel";
import { GameController } from "../controller/GameController";

export class StartController {
  private _model: WordModel;
  private _view: StartView;

  constructor() {
    this._model = new WordModel();
    this._view = new StartView();

    console.log(this._view)
  }

  listenAndServe() {
    document.addEventListener(
      "dictionary-loaded",
      (evt: CustomEvent<DictionaryInfo>) => {
        const words = evt.detail.words;

        if (words) {
          this._model.loadDictionaryFromWords(words);
        }
      },
    );

    document.addEventListener(
      "game-start",
      (evt: CustomEvent<GameStartEvent>) => {
          const settings = evt.detail.settings

          // start the game with the specified settings!
          if (settings) {
            const selectedTimeInMinutes = settings.time
            const boardSize = settings.size

            const gameView = new GameView(selectedTimeInMinutes, boardSize);
            const gameModel = new GameModel(selectedTimeInMinutes * 60, this._model._wordTrie, boardSize)
            console.log(gameModel._board)
            console.log(gameModel.solve())

            const gameController = new GameController(gameModel, gameView);
            gameController.initializeGame()
          }
      }
    )

  }
}
