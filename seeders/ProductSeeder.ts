import Faker from '../faker/faker';
import Product from '../models/Product';
import sql, {connectToDatabase} from '../db_config/config';
import User from '../models/User';
import UserController from "../controllers/UserController";

const ProductSeeder = async (length:number) => {
    await connectToDatabase();
    let user_count:number = await new Promise((resolve, reject) => {
        sql.query("SELECT MAX(id) AS count FROM users", function(error, results) {
            if(error) reject(error);
            resolve(results[0].count);
        });
    })
    console.log(user_count);

    let randomNo:number;
    let user:User;
    for(let i = 0; i < length; i++) {
        while(true) {
            randomNo = Faker.randomInteger(1, user_count)
            user = await UserController.find(randomNo);
            if(user) break;
        }
        let product = new Product(Faker.randomString(), Faker.randomInteger(10, 300), Faker.randomInteger(1, 50), 'in stock', Faker.randomInteger(1, 17), user.id);
        product.save();
    }
    console.log("Product seeding completed");
}

ProductSeeder(100);

export default ProductSeeder;