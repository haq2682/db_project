import Faker from '../faker/faker';
import Sale from '../models/Sale';
import UserController from "../controllers/UserController";
import sql, {connectToDatabase} from '../db_config/config';

const SaleSeeder = async (length:number, dateStart:string, dateEnd:string) => {
    // await connectToDatabase();

    let sales:number[] = [];

    let user_count:any;
    let products:any;

    await new Promise((resolve) => {
        sql.query(`SELECT MAX(id) AS count FROM users;`, function(error, results) {
            if(error) {
                console.error("An error occurred while getting count of users: ", error.sqlMessage);
                return;
            }
            user_count = results[0].count;
            resolve(results);
        })
    });

    await new Promise((resolve) => {
        sql.query(`SELECT * FROM products;`, function(error, results) {
            if(error) {
                console.error("An error occurred while getting products count: ", error.sqlMessage);
                return;
            }
            products = results;
            resolve(results);
        })
    });

    let id:number;
    let user_id:number;
    let total_amount:number = 0;
    let randomProduct:any;
    let randomNo:number;
    let quantity:number;
    let unit_price:number;
    let quantity_price:number;
    let created_at:any;
    let updated_at:any;

    for(let i = 0; i < length; i++) {
        id = Faker.randomInteger(1, 999999999);
        created_at = Faker.date(dateStart, dateEnd);
        updated_at = created_at;

        while(true) {
            user_id = Faker.randomInteger(1, user_count);
            let user = await UserController.find(user_id);
            if(user) break;
        }
        randomNo = Faker.randomInteger(1, 5);
        try {
            await new Promise((reject, resolve) => {
                sql.query(`INSERT INTO sales (id, user_id, total_amount, created_at, updated_at, is_refunded) VALUES (?, ?, ?, ?, ?, ?)`, [id, user_id, total_amount, created_at, updated_at, 0], function(error, results) {
                    if(error) reject(error);
                    resolve(results);
                })
            })
        }
        catch(error) {
            console.error(error);
        }
        
        for(let i = 0; i < randomNo; i++) {
            while(true) {
                randomProduct = products[Faker.randomInteger(1, products.length)];
                if(randomProduct) break;
            }
            quantity = Faker.randomInteger(1, randomProduct.quantity);
            unit_price = randomProduct.unit_price;
            quantity_price = unit_price * quantity;
            total_amount += quantity_price;
            await new Promise((resolve) => {
                sql.query(`INSERT INTO sales_products (sales_id, product_id, quantity, unit_price, quantity_price, created_at, updated_at) VALUES (?,?,?,?,?,?,?)`, [id, randomProduct.id, quantity, unit_price, quantity_price, created_at, updated_at],
                    function(error, results) {
                        if(error) {
                            console.error("Error inserting into Sales_Products table: ", error.sqlMessage);
                            return;
                        }
                        resolve(results);
                    }
                );
            })
        }

        await Sale.update(id, 'total_amount', total_amount);
        total_amount = 0;
        sales.push(id);
    }
    console.log("Sale seeding completed");
    return sales;
}

// SaleSeeder(100, '2024-05-19T17:30:20', '2024-06-19T17:30:20');

export default SaleSeeder;