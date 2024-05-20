import Faker from '../faker/faker';
import User from '../models/User';
import Product from '../models/Product';
import Item from '../models/Item';
import UserController from '../controllers/UserController';
import sql, { connectToDatabase } from '../db_config/config';

let SupplyOrderSeeder = async (length:number, dateStart:string, dateEnd:string) => {
    await connectToDatabase();
    let getMaxId = (table:string):Promise<number> => {
        return new Promise((resolve, reject) => {
            sql.query(`SELECT MAX(id) as count FROM ${table}`, (error, results) => {
                if (error) reject(error);
                resolve(results[0].count);
            });
        });
    };
    
    let userCount:number = await getMaxId('users');
    let productCount:number = await getMaxId('products');
    
    let isProductInItems = async (productId:number) => {
        return new Promise((resolve, reject) => {
            sql.query(`SELECT * FROM items WHERE product_id=?`, [productId], (error, results) => {
                if (error) reject(error);
                resolve(results.length > 0);
            });
        });
    };
    
    let getProduct = async (productId:number) => {
        return await Product.find(productId);
    };
    
    let itemCount:number = await getMaxId('items');
    
    let created_at:any;
    let updated_at:any;
    for (let i = 0; i < length; i++) {
        created_at = Faker.date(dateStart, dateEnd);
        updated_at = created_at;
        
        for (let i = 0; i < Faker.randomInteger(1, 10); i++) {
            let attempts = 0;
            let maxAttempts = 10;
            let randomProductId:number;
            let product:Product[];
            while (attempts < maxAttempts) {
                randomProductId = Faker.randomInteger(1, productCount);
                product = await getProduct(randomProductId);
                if (product && !(await isProductInItems(product[0].id))) {
                    break;
                }
                attempts++;
            }
            if (attempts === maxAttempts) {
                // console.log(`Failed to find a suitable product after ${maxAttempts} attempts`);
                continue;
            }
    
            await new Promise((resolve, reject) => {
                sql.query(`INSERT INTO items (item_name, item_price, product_id, created_at, updated_at) VALUES (?,?,?,?,?)`, [product[0].name, product[0].unit_price, product[0].id, created_at, updated_at], function(error, results) {
                    if(error) reject(error);
                    resolve(results);
                });
            });
        }
    
        let attempts = 0;
        let maxAttempts = 10;
        let randomUser:number;
        let user:User;
        while (attempts < maxAttempts) {
            randomUser = Faker.randomInteger(1, userCount);
            user = await UserController.findOwner(randomUser);
            if (user) break;
            attempts++;
        }
        if (attempts === maxAttempts) {
            console.log(`Failed to find a suitable user after ${maxAttempts} attempts`);
            continue;
        }
    
        attempts = 0;
        let randomSupplyOrderId:number;
        while (attempts < maxAttempts) {
            randomSupplyOrderId = Faker.randomInteger(1, 999999999);
            let doesSupplyOrderExist = await new Promise((resolve, reject) => {
                sql.query(`SELECT * FROM supplyorders WHERE id=?`, [randomSupplyOrderId], (error, results) => {
                    if (error) reject(error);
                    resolve(results.length > 0);
                });
            });
            if (!doesSupplyOrderExist) break;
            attempts++;
        }
        if (attempts === maxAttempts) {
            console.log(`Failed to find a unique supply order ID after ${maxAttempts} attempts`);
            continue;
        }
    
        await new Promise((resolve, reject) => {
            sql.query(`INSERT INTO supplyorders (id, user_id, created_at, updated_at) VALUES (?,?,?,?)`, [randomSupplyOrderId, user.id, created_at, updated_at], function(error, results) {
                if(error) reject(error);
                resolve(results);
            });
        });
    
        for (let j = 0; j < Faker.randomInteger(1, 5); j++) {
            attempts = 0;
            let itemId:number;
            let itemExistance:Item;
            while (attempts < maxAttempts) {
                itemId = Faker.randomInteger(1, itemCount);
                itemExistance = await new Promise((resolve, reject) => {
                    sql.query(`SELECT * FROM items WHERE id=?`, [itemId], (error, results) => {
                        if (error) reject(error);
                        resolve(results[0]);
                    });
                });
                if (itemExistance) break;
                attempts++;
            }
            if (attempts === maxAttempts) {
                console.log(`Failed to find a suitable item after ${maxAttempts} attempts`);
                continue;
            }
    
            await new Promise((resolve, reject) => {
                sql.query(`INSERT INTO supplyorders_items (supplyOrder_id, item_id, item_quantity, created_at, updated_at) VALUES (?,?,?,?,?)`, [randomSupplyOrderId, itemExistance.id, Faker.randomInteger(10, 50), created_at, updated_at], (error, results) => {
                    if (error) reject(error);
                    resolve(results);
                });
            });
        }
    }
    console.log("Supply order seeding completed");
}

SupplyOrderSeeder(100, '2023-05-20T00:00:00', '2024-05-20T23:59:59');

export default SupplyOrderSeeder;