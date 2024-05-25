
import Faker from "../faker/faker";
import sql from '../db_config/config';
import SupplyOrder from "../models/SupplyOrder";

const SupplyOrderController = {
    all: ():Promise<SupplyOrder[]> => {
        return SupplyOrder.all();
    },
    find: async (id:number):Promise<SupplyOrder[]> => {
        return await SupplyOrder.find(id);
    },
    insert: (user_id:number, ):void => {
        let id = Faker.randomInteger(1, 999999999);
        let newsupplyorder = new SupplyOrder(id, user_id);
        newsupplyorder.save();
    },
    update: (id:number, attribute:string, value:unknown):void => {
        SupplyOrder.update(id, attribute, value);
    },
    delete: (id:number):unknown => {
        return SupplyOrder.delete(id);
    },
    authInsert: async (id:number, user_id:number|undefined,):Promise<void> => {
        let newSale = new SupplyOrder(id, user_id);
        await newSale.save();
    },
    generateReceipt: async (id:number):Promise<any> => {
        return new Promise((resolve, reject) => {
            sql.query(`select users.first_name as person_firstname, users.last_name as person_lastname, items.name as product_name, items.unit_price as product_unit_price, supplyOrders_items.quantity as product_quantity,  from supplyOrders inner join users on supplyOrders.user_id=users.id inner join supplyOrders_items on supplyOrders.id=supplyOrders_items.supplyorders_id inner join items on supplyOrders_items.item_id=items.id where supplyOreds.id=?`, [id], function(error, results) {
                if(error) reject(error);
                resolve(results);
            })
        });
    }
}

export default SupplyOrderController;