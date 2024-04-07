import { StartView } from "../view/StartView";
import { WordModel } from "../model/WordModel";
import { DictionaryInfo } from "../types";


export class StartController {
    private _model: WordModel;
    private _view: StartView;

    constructor() {
        this._model = new WordModel()
        this._view = new StartView()
    }

    listenAndServe() {
        document.addEventListener("dictionary-change", (evt: CustomEvent<DictionaryInfo>) => {
            const inputFile = evt.detail.file

            if (inputFile) {
                this._model.loadDictionaryFromFile(inputFile)
            }
        })
    }
}