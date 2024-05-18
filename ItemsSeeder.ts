import Faker from '../faker/faker';
import Items from '../models/Items';
import { connectToDatabase } from '../db_config/config';

const ItemSeeder = async (length: number) => {
    await connectToDatabase();
    for (let i = 0; i < length; i++) {
        let item = new Items(
            Faker.randomString(),               // item_name
            Faker.randomInteger(10, 300),       // item_price
            Faker.randomInteger(1, 100)         // product_id
        );
        await item.save();  // Ensure save is awaited
    }
    console.log("Item seeding completed");
}

ItemSeeder(100);

export default ItemSeeder;
