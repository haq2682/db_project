import Faker from '../faker/faker';
import Sale from '../models/Sale';
import {connectToDatabase} from '../db_config/config';

const SaleSeeder = async (length:number) => {
    await connectToDatabase();
    for(let i = 0; i < length; i++) {
        let sale = new Sale(Faker.randomInteger(1, 100), Faker.randomInteger(1, 1000));
        sale.save();
    }
    console.log("Sale seeding completed");
}

SaleSeeder(100);

export default SaleSeeder;