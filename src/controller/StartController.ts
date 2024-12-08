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
          console.log("YO OVER HERE!")
          const settings = evt.detail.settings

          // start the game with the specified settings!
          if (settings) {
            const selectedTimeInMinutes = settings.time
            const boardSize = settings.size

            const gameView = new GameView(selectedTimeInMinutes, boardSize);

            // TODO: Randomly generate the board here instead of keeping this as null.
            const gameModel = new GameModel(null, selectedTimeInMinutes * 60, this._model._wordTrie, boardSize)

            const gameController = new GameController(gameModel, gameView);
            gameController.startTimer()
          }
      }
    )

  }
}
