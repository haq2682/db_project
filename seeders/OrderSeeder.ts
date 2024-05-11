import sql from "../db_config/config";
import Order from "../models/Order";
import SaleSeeder from "./SaleSeeder";
import Faker from "../faker/faker";

const OrderSeeder = async (length:number) => {
    let sale_id:number[] = await SaleSeeder(1);
    let id:number = sale_id[0];
    let user_count:any;

    await new Promise((resolve) => {
        sql.query(`SELECT COUNT(*) AS count FROM users;`, function(error, results) {
            if(error) {
                console.error("An error ocurred while getting count of users: ", error.sqlMessage);
                return;
            }
            user_count = results[0].count;
            resolve(results);
        })
    });

    for(let i = 0; i < length; i++) {
        let order:Order = new Order(id, Faker.randomInteger(1, user_count));
        order.save();
    }
    console.log("Order seeding completed");
}

OrderSeeder(1);

export default OrderSeeder;