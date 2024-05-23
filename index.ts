import {connectToDatabase} from './db_config/config';
import menu from "./menu";
import prompt from 'prompt-sync';

async function main() {
    // await connectToDatabase();
    menu();
    // let promptSync = prompt();
    // promptSync("Press enter key to exit the program...");
    // process.exit();
}

main();
