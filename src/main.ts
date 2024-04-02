import { slog } from "./slog";
import { WordModel } from "./model/WordModel";
import { StartPage } from "./view/StartView";

function main(): void {
  slog.info("Welcome to the game!");
  const startPage = new StartPage();
  const wordModel = new WordModel();
}

/* Register event handler to run after the page is fully loaded. */
document.addEventListener("DOMContentLoaded", () => {
  main();
});
