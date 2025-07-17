import database from "./../database.json";
import Person from "./person.js";
import { save } from "./repository.js";
import TerminalController from "./terminalController.js";

const DEFAULT_LANG = "pt-BR";
//onst DEFAULT_LANG = "es";
//const DEFAULT_LANG = "en";
//const DEFAULT_LANG = "rus";

const STOP_TERM = ":q";

const terminalController = new TerminalController();
terminalController.initializeTerminal(database, DEFAULT_LANG);

async function mainLoop() {
  try {
    const answer = await terminalController.question();
    if (answer === STOP_TERM) {
      terminalController.closeTerminal();
      console.log("process finished");
      return;
    }
    const person = Person.generateInstanceFromString(answer);
    terminalController.updateTable(person.formatted(DEFAULT_LANG));
    await save(person);

    return mainLoop();
  } catch (error) {
    console.error("Deu ruim", error);
    return mainLoop();
  }
}

await mainLoop();

//3 Aviao,Navio 100000 2001-08-10 2006-09-01
//2 Bike 20000 2020-01-01 2020-08-01
