import Faker from '../faker/faker';
import connection from '../db_config/config';

const UserSeeder = (length:number) => {
    for(let i = 0; i < length; i++) {
        let user = {first_name: Faker.firstName(), last_name: Faker.lastName(), username: Faker.username(), email: Faker.email(), password: Faker.randomString(), contact: Faker.contactNumber(), address: Faker.address()};
        connection.query('insert into users set ?', user, function(error, results, fields) {
            if(error) throw error;
            console.log(results);
        } );
    }
    connection.end();
}

export default UserSeeder;