import './db_config/config';
import Faker from "./faker/faker";
import UserSeeder from "./seeder/UserSeeder";

function main() {
    UserSeeder(10000);
}

main();
