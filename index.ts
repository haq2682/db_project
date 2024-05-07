import {connectToDatabase} from './db_config/config';
import UserController from './controllers/UserController';
import prompt from 'prompt-sync';

async function main() {
    await connectToDatabase();
    let promptSync = prompt();
    promptSync("Press enter key to exit the program...");
    process.exit();
}

main();
