import Faker from '../faker/faker';
import Product from '../models/Product';
import sql, {connectToDatabase} from '../db_config/config';
import User from '../models/User';
import UserController from "../controllers/UserController";

const ProductSeeder = async (length:number, dateStart:string, dateEnd:string) => {
    await connectToDatabase();
    let user_count:number = await new Promise((resolve, reject) => {
        sql.query("SELECT MAX(id) AS count FROM users", function(error, results) {
            if(error) reject(error);
            resolve(results[0].count);
        });
    })

    let randomNo:number;
    let user:User;
    let created_at:any;
    let updated_at:any;
    for(let i = 0; i < length; i++) {
        created_at = Faker.date(dateStart, dateEnd);
        updated_at = created_at;
        while(true) {
            randomNo = Faker.randomInteger(1, user_count)
            user = await UserController.findOwner(randomNo);
            if(user) break;
        }
        await new Promise((resolve, reject) => {
            sql.query(`INSERT INTO products (name, unit_price, quantity, stock_status, category_id, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [Faker.randomString(), Faker.randomInteger(10, 300), Faker.randomInteger(1, 50), 'in stock', Faker.randomInteger(1, 17), user.id, created_at, updated_at], function(error, results) {
                if(error) reject(error);
                resolve(results);
            });
        })
    }
    console.log("Product seeding completed");
}

ProductSeeder(100, '2023-05-20T00:00:00', '2024-05-20T23:59:59');

export default ProductSeeder;