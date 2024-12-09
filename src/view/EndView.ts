import { StartView } from "./StartView";

class EndPage extends HTMLElement {
  private controller: AbortController = new AbortController();
  public _playAgainButton: HTMLButtonElement | null = null;
  public _foundWordsList: HTMLElement | null = null;
  public _missedWordsList: HTMLElement | null = null;
  public _scoreField: HTMLElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    if (this.shadowRoot) {
      // Grab the template for the end page
      let template = document.querySelector("#end-template");

      if (template instanceof HTMLTemplateElement) {
        this.shadowRoot.append(template.content.cloneNode(true));

        // Grab the play again button
        this._playAgainButton =
          this.shadowRoot.querySelector("#play-again-button");

        // Grab the found words panel
        this._foundWordsList =
          this.shadowRoot.querySelector("#found-words-list");

        // Grab the missed words panel
        this._missedWordsList =
          this.shadowRoot.querySelector("#missed-words-list");

        // Grab the score section
        this._scoreField = this.shadowRoot.querySelector("#final-score");
      }
    }
  }

  connectedCallback() {
    const options = { signal: this.controller.signal };

    // Add the event listener to the play again button.
    this._playAgainButton?.addEventListener(
      "click",
      this.handlePlayAgain.bind(this),
      options,
    );
  }
  handlePlayAgain() {
    // Handle the play again button getting clicked by returning to the start page
    const startView = new StartView();

    if (startView) {
      console.log("DOM connected to the start page.");
    }
  }
}

customElements.define("end-page", EndPage);

export class EndView {
  public _endPage: EndPage | null = null;

  constructor(foundWords: string[], allWords: Set<string>, score: number) {
    const endPage = document.createElement("end-page") as EndPage;

    // Replace the DOM with the end page
    const app = document.getElementById("app");
    if (app) {
      app.innerHTML = "";
      app.appendChild(endPage);

      this._endPage = endPage;

      // Fill in the earned score
      this._endPage._scoreField!.innerText = score.toString();

      // Filter out allWords to only include words not found
      const missedWords = Array.from(allWords).filter(
        (element) => !foundWords.includes(element),
      );
      const sortedMissedWords = missedWords.sort((a, b) => b.length - a.length);
      const sortedFoundWords = foundWords.sort((a, b) => b.length - a.length);

      // Include the sorted missed words and sorted words in the panels
      sortedMissedWords.forEach((word, index) => {
        const listElement = document.createElement("li");
        listElement.innerText = word;

        if (this._endPage?._missedWordsList) {
          this._endPage._missedWordsList.appendChild(listElement);
        }
      });

      sortedFoundWords.forEach((word, index) => {
        const listElement = document.createElement("li");
        listElement.innerText = word;

        if (this._endPage?._foundWordsList) {
          this._endPage._foundWordsList.appendChild(listElement);
        }
      });
    }
  }
}
