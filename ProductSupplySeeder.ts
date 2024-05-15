import Faker from '../faker/faker';
import ProductSupply from '../models/ProductSupply'; // Assuming you have a SupplyOrder model
import { connectToDatabase } from '../db_config/config';

const ProductSupplySeeder = async (length: number) => {
    await connectToDatabase();
    for (let i = 0; i < length; i++) {
        let productSupply = new ProductSupply(
            Faker.randomInteger(1, 100), // suppluorder_id
            Faker.randomInteger(1, 100), // product_id
            Faker.randomInteger(1, 50),   // product_quantity
            
        );
        productSupply.save();
    }
    console.log("Product Supply seeding completed");
}

ProductSupplySeeder(100);

export default ProductSupplySeeder;
