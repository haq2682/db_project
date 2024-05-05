import {connectToDatabase} from './db_config/config';
import prompt from 'prompt-sync';

async function main() {
    await connectToDatabase();
    let promptSync = prompt();
    let r = promptSync("Press enter key to exit the program...");
    process.exit();
}

main();
