import { Settings, DictionaryInfo, GameStartEvent } from "./../types";

declare global {
  interface DocumentEventMap {
    "dictionary-loaded": CustomEvent<DictionaryInfo>;
    "game-start": CustomEvent<GameStartEvent>;
  }
}

async function loadDictionary() : Promise<string>{
  try {
    const response = await fetch("http://localhost:3000/assets/words_alpha.txt") as Response
    if (!response.ok) {
      throw new Error(`Failed to load dictionary: ${response.statusText}`)
    }
    const dictionaryContent = await response.text();
    console.log("DICTIONARY SUCCESFFULY LOADED.")
    return dictionaryContent;

  } catch (error) {
    console.error("Error loading dictionary:", error);
    return "";
  }
}

class StartPage extends HTMLElement {
  private controller: AbortController | null = null;
  public _settings: Settings | null = {
    size: 4,
    time: 3,
  };
  public _startButton: HTMLButtonElement | null = null;
  public _settingsDialog: HTMLDialogElement | null = null;
  public _settingsIcon: HTMLElement | null = null;
  public _saveOptions: HTMLButtonElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.loadDictionary();

    if (this.shadowRoot) {
      let template = document.querySelector("#start-template");
      if (!(template instanceof HTMLTemplateElement)) {
        throw new Error("start page template does not exist");
      } else {
        this.shadowRoot.append(template.content.cloneNode(true));
        this._startButton = this.shadowRoot.querySelector("#start-button");
        this._settingsIcon = this.shadowRoot.querySelector(".settings-icon");
        this._settingsDialog =
          this.shadowRoot.querySelector("#settings-dialog");
        this._saveOptions = this.shadowRoot.querySelector("#save-settings");
      }
    } else {
      throw new Error("shadowRoot does not exist");
    }
  }

  async loadDictionary() {
    const dictionaryContent = await loadDictionary();
    const words = dictionaryContent.split("\n").map(word => word.trim());

    const dictionaryEvent = new CustomEvent("dictionary-loaded", {
      detail: { words: words },
    });
    document.dispatchEvent(dictionaryEvent)
  }

  connectedCallback() {
    this.controller = new AbortController();
    const options = { signal: this.controller.signal };

    this._settingsIcon?.addEventListener(
      "click",
      this.handleShowSettingsDialog.bind(this),
      options,
    );

    this._saveOptions?.addEventListener(
      "click",
      this.handleSaveSettings.bind(this),
      options,
    );

    // Handle the pressing of the start game button.
    this._startButton?.addEventListener(
      'click', 
      this.handleStartGame.bind(this),
      options,
    );
  }

  disconnectedCallback() {
    this.controller?.abort();
    this.controller = null;
  }

  handleShowSettingsDialog() {
    this._settingsDialog?.showModal();
  }

  handleSaveSettings() {
    if (this._settingsDialog) {
      this._settingsDialog.close();
    }
    const boardSizeInput =
      this.shadowRoot?.querySelector<HTMLInputElement>("#board-size");
    const timeLimitInput =
      this.shadowRoot?.querySelector<HTMLInputElement>("#time-limit");

    if (boardSizeInput && timeLimitInput) {
      const boardSize = parseInt(boardSizeInput.value, 10);
      const timeLimit = parseInt(timeLimitInput.value, 10);

      if (!isNaN(boardSize) && !isNaN(timeLimit)) {
        this._settings = {
          size: boardSize,
          time: timeLimit,
        };
        console.log("Settings saved:", this._settings);
      } else {
        console.error("Invalid settings provided");
      }
    }
  }

  handleStartGame(event: Event) {
    const startGameEvent = new CustomEvent("game-start", {
      detail: { settings: this._settings }, composed: true, bubbles: true
    });

    document.dispatchEvent(startGameEvent)
    const settings = (event as CustomEvent).detail.settings;
    console.log("Game Start Event Received!", settings);
  }
}

customElements.define("start-page", StartPage);

export class StartView {
  private _startPage: StartPage | null = null;

  constructor() {
    this._startPage = document.querySelector("start-page")
    if (!(this._startPage instanceof StartPage)) {
      console.log("no start page found");
    }
  }
}