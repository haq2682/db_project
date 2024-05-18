import Faker from '../faker/faker';
import User from '../models/User';
import {connectToDatabase} from '../db_config/config';

const UserSeeder = async (length:number) => {
    await connectToDatabase();
    let firstName:string;
    let lastName:string;
    let username:string;
    let email:string;
    let password:string;
    let contact:string;
    let address:string;
    let role_id:number;
    let randomNo:number;
    for(let i = 0; i < length; i++) {
        randomNo = Faker.randomInteger(1, 10000);
        firstName = Faker.firstName();
        lastName = Faker.lastName();
        username = `${firstName}${randomNo}`;
        email = Faker.email();
        password = Faker.randomString();
        contact = Faker.contactNumber();
        address = Faker.address();
        role_id = Faker.randomInteger(1, 2);

        let user = new User(firstName, lastName, username, email, password, contact, address, role_id);
        user.save();
    }
    console.log("User seeding completed");
}

UserSeeder(1);

export default UserSeeder;