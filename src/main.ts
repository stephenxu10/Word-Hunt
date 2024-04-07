import { slog } from "./slog";
import { StartController } from "./controller/StartController";

function main(): void {
  slog.info("Welcome to the game!");
  const startController = new StartController();
  startController.listenAndServe()
}

/* Register event handler to run after the page is fully loaded. */
document.addEventListener("DOMContentLoaded", () => {
  main();
});
