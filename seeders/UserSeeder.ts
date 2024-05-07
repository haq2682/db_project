import Faker from '../faker/faker';
import User from '../models/User';
import {connectToDatabase} from '../db_config/config';

const UserSeeder = async (length:number) => {
    await connectToDatabase();
    for(let i = 0; i < length; i++) {
        let user = new User(Faker.firstName(), Faker.lastName(), Faker.username(), Faker.email(), Faker.randomString(), Faker.contactNumber(), Faker.address(), Faker.randomInteger(1, 2));
        user.save();
    }
    console.log("User seeding completed");
}

UserSeeder(100);

export default UserSeeder;