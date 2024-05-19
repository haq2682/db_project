import Faker from '../faker/faker';
import SupplyOrder from '../models/SupplyOrder';
import User from '../models/User';
import Product from '../models/Product';
import Item from '../models/Item';
import UserController from '../controllers/UserController';
import sql, { connectToDatabase } from '../db_config/config';

const SupplyOrderSeeder = async (length:number) => {
    await connectToDatabase();
    
    const getMaxId = (table:string):Promise<number> => {
        return new Promise((resolve, reject) => {
            sql.query(`SELECT MAX(id) as count FROM ${table}`, (error, results) => {
                if (error) reject(error);
                resolve(results[0].count);
            });
        });
    };

    const userCount:number = await getMaxId('users');
    const productCount:number = await getMaxId('products');

    const isProductInItems = async (productId:number) => {
        return new Promise((resolve, reject) => {
            sql.query(`SELECT * FROM items WHERE product_id=?`, [productId], (error, results) => {
                if (error) reject(error);
                resolve(results.length > 0);
            });
        });
    };

    const getProduct = async (productId:number) => {
        return await Product.find(productId);
    };

    const itemCount:number = await getMaxId('items');

    for (let i = 0; i < length; i++) {
        for (let i = 0; i < Faker.randomInteger(1, 10); i++) {
            let randomProductId:number;
            let product;
            while (true) {
                randomProductId = Faker.randomInteger(1, productCount);
                product = await getProduct(randomProductId);
                if (product && !(await isProductInItems(product[0].id))) {
                    break;
                }
            }
            let item = new Item(product[0].name, product[0].unit_price, product[0].id);
            await item.save();
        }
        let randomUser:number;
        let user:User;
        while (true) {
            randomUser = Faker.randomInteger(1, userCount);
            user = await UserController.findOwner(randomUser);
            if (user) break;
        }

        let randomSupplyOrderId:number;
        while (true) {
            randomSupplyOrderId = Faker.randomInteger(1, 999999999);
            const doesSupplyOrderExist = await new Promise((resolve, reject) => {
                sql.query(`SELECT * FROM supplyorders WHERE id=?`, [randomSupplyOrderId], (error, results) => {
                    if (error) reject(error);
                    resolve(results.length > 0);
                });
            });
            if (!doesSupplyOrderExist) break;
        }

        let supplyOrder = new SupplyOrder(randomSupplyOrderId, user.id);
        await supplyOrder.save();

        for (let j = 0; j < Faker.randomInteger(1, 5); j++) {
            let itemId:number;
            let itemExistance:Item;
            while (true) {
                itemId = Faker.randomInteger(1, itemCount);
                itemExistance = await new Promise((resolve, reject) => {
                    sql.query(`SELECT * FROM items WHERE id=?`, [itemId], (error, results) => {
                        if (error) reject(error);
                        resolve(results[0]);
                    });
                });
                if (itemExistance) break;
            }

            await new Promise((resolve, reject) => {
                sql.query(`INSERT INTO supplyorders_items (supplyOrder_id, item_id, item_quantity) VALUES (?,?,?)`, [randomSupplyOrderId, itemExistance.id, Faker.randomInteger(10, 50)], (error, results) => {
                    if (error) reject(error);
                    resolve(results);
                });
            });
        }
    }
    console.log("Supply order seeding completed");
};

SupplyOrderSeeder(100);

export default SupplyOrderSeeder;
