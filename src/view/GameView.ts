class GamePage extends HTMLElement {
    private controller : AbortController | null = null;
    private _timeDisplay: HTMLElement | null = null;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        if (this.shadowRoot) {
            // Grab the template for the Game Page
            let template = document.querySelector("#game-template");

            if (!(template instanceof HTMLTemplateElement)) {
                throw new Error("Game page template does not exist");
            } else {
                this.shadowRoot.append(template.content.cloneNode(true));

                // The game timer
                this._timeDisplay = this.shadowRoot.querySelector("#time-remaining")
            }
        }
    }

    connectedCallback() {
        // Use this for event handling
        this.controller = new AbortController();
        const options = { signal: this.controller.signal };

        console.log("Game Page connected to the DOM.")
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
    public _gamePage : GamePage | null = null;

    constructor(timeInMinutes: number, boardSize: number) {
        const timeInSeconds = timeInMinutes * 60;
        const gamePage = document.createElement("game-page") as GamePage;
        
        // Replace the DOM with the GamePage
        const app = document.getElementById("app");

        if (app) {
            app.innerHTML = ""
            app.appendChild(gamePage);

            // Adjust the settings
            gamePage.updateTimeDisplay(timeInSeconds);
            console.log(`Requested board size: ${boardSize}`)

            this._gamePage = gamePage;
        }

    }
}