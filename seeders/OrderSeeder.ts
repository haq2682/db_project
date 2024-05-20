import sql from "../db_config/config";
import SaleSeeder from "./SaleSeeder";
import Faker from "../faker/faker";
import User from "../models/User";
import UserController from "../controllers/UserController";

const OrderSeeder = async (length:number, dateStart:string, dateEnd:string) => {
    
    let user_count:any;

    await new Promise((resolve) => {
        sql.query(`SELECT MAX(id) AS count FROM users;`, function(error, results) {
            if(error) {
                console.error("An error ocurred while getting count of users: ", error.sqlMessage);
                return;
            }
            user_count = results[0].count;
            resolve(results);
        })
    });

    let sale_id:number[];
    let id:number;
    let random_user_id:number;
    let random_user:User;
    let created_at:any;
    let updated_at:any;
    for(let i = 0; i < length; i++) {
        sale_id = await SaleSeeder(1, dateStart, dateEnd);
        id = sale_id[0];
        created_at = Faker.date(dateStart, dateEnd);
        updated_at = created_at;
        while(true) {
            random_user_id = Faker.randomInteger(1, user_count);
            random_user = await UserController.findCustomer(random_user_id);
            if(random_user) break;
        }
        await new Promise((resolve, reject) => {
            sql.query(`INSERT INTO orders (id, sales_id, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`, [id, sale_id, random_user_id, created_at, updated_at], function(error, results) {
                if(error) reject(error);
                resolve(results);
            })
        })
    }
    console.log("Order seeding completed");
}

OrderSeeder(100, '2024-05-19T17:30:20', '2024-06-19T17:30:20');

export default OrderSeeder;