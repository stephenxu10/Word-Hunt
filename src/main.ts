import { slog } from "./slog";
import { StartController } from "./controller/StartController";

function main(): void {
  slog.info("Welcome to the game!");
  const startController = new StartController();
  startController.listenAndServe();
}

document.addEventListener("DOMContentLoaded", () => {
  main();
});
