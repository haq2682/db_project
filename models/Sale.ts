import User from './User';
import sql from '../db_config/config';

class Sale {
    public id:number;
    public user_id:number;
    public user:User;
    public total_amount:number;
    public is_refunded:number;
    public created_at:Date;
    public updated_at:Date;

    public constructor(id?:number, user_id?:number, total_amount?:number) {
        this.id = id ?? 0;
        this.user_id = user_id ?? 0;
        this.user = new User();
        this.total_amount = total_amount ?? 0;
        this.is_refunded = 0;
        this.created_at = new Date();
        this.updated_at = new Date();
    }

    public async save():Promise<void> {
        try {
            await new Promise((resolve) => {
                sql.query('insert into sales (id, user_id, total_amount, is_refunded) values (?,?,?,?);', [this.id, this.user_id, this.total_amount, this.is_refunded], function(error, results) {
                    if(error) {
                        console.error("Error saving sale: ", error.sqlMessage);
                        return;
                    }
                    console.log("Sale saved successfully");
                    resolve(results);
                });
            })
        }
        catch(error) {
            console.error(error);
        }
    }

    public static async all():Promise<unknown> {
        return new Promise((resolve) => {
            sql.query(`select *, sales.id from sales inner join users on sales.user_id=users.id inner join sales_products on sales.id=sales_products.sales_id inner join products on sales_products.product_id=products.id`, (error, results) => {
                if(error) {
                    console.error("Error fetching sales: ", error.sqlMessage);
                    return;
                }
                else resolve(results);
            })
        })
    }

    public static async find(id:number):Promise<unknown> {
        return new Promise((resolve) => {
            sql.query(`select *, sales.id from sales where id=? inner join users on sales.user_id=users.id`, [id], (error, results) => {
                if(error) {
                    console.error("Error fetching sales: ", error.sqlMessage);
                    return;
                }
                else resolve(results);
            })
        })
    }

    public static async update(id: number, attribute: string, value: unknown):Promise<void> {
        const query = `UPDATE sales SET ${attribute}=? WHERE id=?`;
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
                sql.query('delete from sales where id=?', [id], function(error, results) {
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

export default Sale;