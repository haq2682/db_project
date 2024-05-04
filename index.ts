import {Faker} from "./faker/faker";

function main() {
    for(let i = 0; i < 10; i++) {
        let name = Faker.firstName();
        console.log(name);
    } 
}

main();