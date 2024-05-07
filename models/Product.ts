import sql from '../db_config/config';
import User from "./User";
import Category from "./Category";

class Product {
    public id:number;
    public name:string;
    public unit_price:number;
    public quantity:number = 1;
    public stock_status:string = 'in stock';
    public category_id:number;
    public category:Category;
    public user_id:number;
    public user:User;
    public created_at:Date;
    public updated_at:Date;

    public constructor(name?:string, unit_price?:number, quantity?:number, stock_status?:string, category_id?:number, user_id?:number) {
        this.id = 0;
        this.name = name ?? '';
        this.unit_price = unit_price ?? 0;
        this.quantity = quantity ?? 0;
        this.stock_status = stock_status ?? '';
        this.category_id = category_id ?? 0;
        this.category = new Category;
        this.user_id = user_id ?? 0;
        this.user = new User();
        this.created_at = new Date();
        this.updated_at = new Date();
    }

    public async save():Promise<void> {
        try {
            await new Promise(() => {
                sql.query('insert into products (name, unit_price, quantity, stock_status, category_id, user_id) values (?,?,?,?,?,?)', [this.name, this.unit_price, this.quantity, this.stock_status, this.category_id, this.user_id], function(error) {
                    if(error) {
                        console.error("Error saving product: ", error.sqlMessage);
                        return;
                    }
                    console.log("Product saved successfully");
                });
            })
        }
        catch(error) {
            console.error(error);
        }
    }

    public static async all():Promise<Product[]> {
        return new Promise((resolve) => {
            sql.query(`select *, products.id from products inner join users on products.user_id=users.id inner join categories on products.category_id=categories.id`, (error, results) => {
                if(error) {
                    console.error("Error fetching products: ", error.sqlMessage);
                    return;
                }
                else resolve(results as Product[]);
            })
        })
    }

    public static async find(id:number):Promise<Product[]> {
        return new Promise((resolve) => {
            sql.query(`select *, products.id from products where id=? inner join users on products.user_id=users.id inner join categories on products.category_id=categories.id`, [id], (error, results) => {
                if(error) {
                    console.error("Error fetching products: ", error.sqlMessage);
                    return;
                }
                else resolve(results as Product[]);
            })
        })
    }

    public static async update(id: number, attribute: string, value: unknown):Promise<void> {
        const query = `UPDATE products SET ${attribute}=? WHERE id=?`;
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
                sql.query('delete from products where id=?', [id], function(error, results) {
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

export default Product;