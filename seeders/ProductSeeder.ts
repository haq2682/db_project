import Faker from '../faker/faker';
import Product from '../models/Product';
import {connectToDatabase} from '../db_config/config';

const ProductSeeder = async (length:number) => {
    await connectToDatabase();
    for(let i = 0; i < length; i++) {
        let product = new Product(Faker.randomString(), Faker.randomInteger(10, 300), Faker.randomInteger(1, 50), 'in stock', Faker.randomInteger(1, 25), Faker.randomInteger(1, 100));
        product.save();
    }
    console.log("Product seeding completed");
}

ProductSeeder(100);

export default ProductSeeder;