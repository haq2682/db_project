import Faker from '../faker/faker';
import SupplyOrder from '../models/SupplyOrder'; // Assuming you have a SupplyOrder model
import { connectToDatabase } from '../db_config/config';

const SupplyOrderSeeder = async (length: number) => {
    await connectToDatabase();
    for (let i = 0; i < length; i++) {
        let supplyOrder = new SupplyOrder(
            Faker.randomInteger(1, 100) // user_id
        );
        await supplyOrder.save();
    }
    console.log("Supply order seeding completed");
}

SupplyOrderSeeder(100);

export default SupplyOrderSeeder;
