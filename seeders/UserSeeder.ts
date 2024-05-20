import Faker from '../faker/faker';
import sql, {connectToDatabase} from '../db_config/config';

const UserSeeder = async (length:number, dateStart:string, dateEnd:string) => {
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
    let created_at:any;
    let updated_at:any;
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
        created_at = Faker.date(dateStart, dateEnd);
        updated_at = created_at;

        await new Promise((resolve, reject) => {
            sql.query(`INSERT INTO users (first_name, last_name, username, email, password, contact, address, role_id, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)`, [firstName, lastName, username, email, password, contact, address, role_id, created_at, updated_at],function(error, results) {
                if(error) reject(error);
                resolve(results);
            })
        })
    }
    console.log("User seeding completed");
}

UserSeeder(100, '2023-05-20T00:00:00', '2024-05-20T23:59:59');

export default UserSeeder;