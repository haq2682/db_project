import Sale from "../models/Sale";
import Faker from "../faker/faker";
import sql from '../db_config/config';

const SaleController = {
    all: async ():Promise<Sale[]> => {
        return await Sale.all();
    },
    find: async (id:number):Promise<Sale[]> => {
        return await Sale.find(id);
    },
    insert: async (user_id:number, total_amount:number):Promise<void> => {
        let id = Faker.randomInteger(1, 999999999);
        let newSale = new Sale(id, user_id, total_amount);
        await newSale.save();
    },
    update: async (id:number, attribute:string, value:unknown):Promise<void> => {
        await Sale.update(id, attribute, value);
    },
    delete: async (id:number):Promise<unknown> => {
        return await Sale.delete(id);
    },
    authInsert: async (id:number, user_id:number|undefined, total_amount:number):Promise<void> => {
        let newSale = new Sale(id, user_id, total_amount);
        await newSale.save();
    },
    generateReceipt: async (id:number):Promise<any> => {
        return new Promise((resolve, reject) => {
            sql.query(`select users.first_name as salesperson_firstname, users.last_name as salesperson_lastname, products.name as product_name, products.unit_price as product_unit_price, sales_products.quantity as product_quantity, sales_products.quantity_price as product_quantity_price, sales.total_amount as total from sales inner join users on sales.user_id=users.id inner join sales_products on sales.id=sales_products.sales_id inner join products on sales_products.product_id=products.id where sales.id=?`, [id], function(error, results) {
                if(error) reject(error);
                resolve(results);
            })
        });
    }
}

export default SaleController;