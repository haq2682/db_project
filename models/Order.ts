import Sale from "./Sale";
import User from "./User";
import sql from "../db_config/config";
import Faker from "../faker/faker";

class Order {
    public id:number;
    public sales_id:number;
    public sale:Sale;
    public user_id:number;
    public user:User;
    public delivery_status:string;
    public is_cancelled:number;

    public constructor(id:number, sales_id?:number, user_id?:number) {
        this.id = id ?? Faker.randomInteger(1, 999999999);
        this.sales_id = sales_id ?? 0;
        this.user_id = user_id ?? 0;
        this.delivery_status = 'provided to shipper';
        this.is_cancelled = 0;
        this.user = new User();
        this.sale = new Sale();
    }

    public async save():Promise<void> {
        try {
            await new Promise((resolve) => {
                sql.query(`insert into orders (id, sales_id, user_id, delivery_status, is_cancelled) VALUES (?,?,?,?,?)`, [this.id, this.sales_id, this.user_id, this.delivery_status, this.is_cancelled],
                    function(error, results) {
                        if(error) {
                            console.error("Error saving order: ", error.sqlMessage);
                            return;
                        }
                        console.log("Order saved successfully");
                        resolve(results);
                    } 
                );
            })
        }
        catch(error) {
            console.error(error);
        }
    }

    public static async all():Promise<Order[]> {
        return new Promise((resolve) => {
            sql.query(`select *, orders.id from orders inner join users on orders.user_id=users.id inner join sales on orders.sales_id=sales.id inner join sales_products on sales.id=sales_products.sales_id inner join products on sales_products.product_id=products.id`, 
            function(error, results) {
                if(error) {
                    console.error("Error fetching orders: ", error.sqlMessage);
                    return;
                }
                resolve(results);
            });
        })
    }

    public static async find(id:number):Promise<any> {
        return new Promise((resolve) => {
            sql.query(`select *, orders.id from orders inner join users on orders.user_id=users.id inner join sales on orders.sales_id=sales.id inner join sales_products on sales.id=sales_products.sales_id inner join products on sales_products.product_id=products.id where orders.id=?`, [id], function(error, results) {
                if(error) {
                    console.error("Error fetching order: ", error.sqlMessage);
                    return;
                }
                resolve(results[0]);
            })
        });
    }

    public static async update(id:number, attribute:string, value:unknown):Promise<void> {
        const query = `UPDATE orders SET ${attribute}=? WHERE id=?`;
        try {
            await new Promise((resolve) => {
                sql.query(query, [value, id], (error, results) => {
                    if (error) {
                        console.error("Error during updating: ", error.sqlMessage);
                        return;
                    }
                    console.log("Updation successful");
                    return resolve(results);
                });
            })
        }
        catch(error) {
            console.error(error);
        }
    }

    public static async delete(id:number):Promise<void> {
        try {
            await new Promise((resolve) => {
                sql.query('delete from orders where id=?', [id], function(error, results) {
                    if(error) {
                        console.error("Error deleting the instance: ", error.sqlMessage);
                        return;
                    }
                    console.log("Deletion successful");
                    return resolve(results);
                });
            })
        }
        catch(error) {
            console.log(error);
        }
    }
}

export default Order;