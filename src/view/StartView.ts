import { Settings } from "./../types";

export class StartPage extends HTMLElement {
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

  connectedCallback() {
    this.controller = new AbortController();
    const options = { signal: this.controller.signal };

    this._startButton?.addEventListener(
      "click",
      this.handleStart.bind(this),
      options,
    );

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
  }

  disconnectedCallback() {
    this.controller?.abort();
    this.controller = null;
  }

  handleStart(event: MouseEvent) {}

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
}

customElements.define("start-page", StartPage);
