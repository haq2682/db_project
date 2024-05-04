import firstNames from './firstNames';

export const Faker = {
    firstName: ():string => {
        return firstNames[Math.floor(Math.random() * firstNames.length)];
    }
}