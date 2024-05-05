import Faker from '../faker/faker';
import User from '../models/User';
import connection from '../db_config/config';

const UserSeeder = (length:number) => {
    for(let i = 0; i < length; i++) {
        let user = new User(Faker.firstName(), Faker.lastName(), Faker.username(), Faker.email(), Faker.randomString(), Faker.contactNumber(), Faker.address(), Faker.randomInteger(1, 2));
        user.save();
    }
}

export default UserSeeder;