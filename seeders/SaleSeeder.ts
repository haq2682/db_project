import Faker from '../faker/faker';
import Sale from '../models/Sale';
import sql, {connectToDatabase} from '../db_config/config';

const SaleSeeder = async (length:number) => {
    await connectToDatabase();

    let sales:number[] = [];

    let user_count:any;
    let products:any;

    await new Promise((resolve) => {
        sql.query(`SELECT COUNT(*) AS count FROM users;`, function(error, results) {
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

    for(let i = 0; i < length; i++) {
        id = Faker.randomInteger(1, 999999999);
        user_id = Faker.randomInteger(1, user_count);
        randomNo = Faker.randomInteger(1, 5);

        let sale:Sale = new Sale(id, user_id, total_amount);
        sale.save();

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
                sql.query(`INSERT INTO sales_products (sales_id, product_id, quantity, unit_price, quantity_price) VALUES (?,?,?,?,?)`, [id, randomProduct.id, quantity, unit_price, quantity_price],
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

        Sale.update(id, 'total_amount', total_amount);
        total_amount = 0;
        sales.push(id);
    }
    console.log("Sale seeding completed");
    return sales;
}

export default SaleSeeder;