import Order from "../models/Order";
import sql from "../db_config/config";
const OrderController = {
    all: ():Promise<unknown> => {
        return Order.all();
    },
    find: async (id:number):Promise<Order> => {
        return await Order.find(id);
    },
    insert: async (sales_id:number, user_id:number|undefined):Promise<void> => {
        let newOrder = new Order(sales_id, user_id);
        await newOrder.save();
    },
    update: (id:number, attribute:string, value:string):void => {
        Order.update(id, attribute, value);
    },
    delete: (id:number):unknown => {
        return Order.delete(id);
    },
    cancelOrder: async (id:number):Promise<void> => {
        return new Promise((resolve, reject) => {
            sql.query(`UPDATE orders SET is_cancelled=1 WHERE orders.id=?`, [id], function(error, results) {
                if(error) reject(error);
                resolve(results);
            })
        })
    },
    allByCustomer: async (id:number|undefined):Promise<any> => {
        return new Promise((resolve, reject) => {
            sql.query(`select *, orders.id from orders inner join users on orders.user_id=users.id inner join sales on orders.sales_id=sales.id inner join sales_products on sales.id=sales_products.sales_id inner join products on sales_products.product_id=products.id WHERE orders.user_id=?`, function(error, results) {
                if(error) reject(error);
                resolve(results);
            });
        })
    },
    findOrderByCustomerUsername: async (username:string):Promise<any> => {
        let string = `%${username}%`
        return new Promise((resolve, reject) => {
            sql.query(`select *, orders.id from orders inner join users on orders.user_id=users.id inner join sales on orders.sales_id=sales.id inner join sales_products on sales.id=sales_products.sales_id inner join products on sales_products.product_id=products.id WHERE users.username LIKE ?`, [string], function(error, results) {
                if(error) reject(error);
                resolve(results);
            })
        })
    },
    allByAuth: async (id:number|undefined):Promise<any> => {
        return new Promise((resolve, reject) => {
            sql.query(`select *, orders.id from orders inner join users on orders.user_id=users.id inner join sales on orders.sales_id=sales.id inner join sales_products on sales.id=sales_products.sales_id inner join products on sales_products.product_id=products.id WHERE sales.user_id=?`, [id], function(error, results) {
                if(error) reject(error);
                resolve(results);
            })
        })
    }
}

export default OrderController;