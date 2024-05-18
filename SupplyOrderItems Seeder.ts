import Faker from '../faker/faker';
import SupplyOrderItems from '../models/SupplyOrderItems'; // Assuming you have a SupplyOrderItem model
import { connectToDatabase } from '../db_config/config';

const SupplyOrderItemSeeder = async (length: number) => {
    await connectToDatabase();
    for (let i = 0; i < length; i++) {
        let supplyOrderItem = new SupplyOrderItems(
            Faker.randomInteger(1, 100), // supplyOrderID
            Faker.randomInteger(1, 100), // itemID
            Faker.randomInteger(1, 50)   // itemQuantity
        );
        await supplyOrderItem.save();
    }
    console.log("Supply Order Item seeding completed");
}

SupplyOrderItemSeeder(100);

export default SupplyOrderItemSeeder;
