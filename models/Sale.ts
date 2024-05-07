import User from './User';
import sql from '../db_config/config';

class Sale {
    public id:number;
    public user_id:number;
    public user:User;
    public total_amount:number;
    public created_at:Date;
    public updated_at:Date;

    public constructor(user_id?:number, total_amount?:number) {
        this.id = 0;
        this.user_id = user_id ?? 0;
        this.user = new User();
        this.total_amount = total_amount ?? 0;
        this.created_at = new Date();
        this.updated_at = new Date();
    }

    public async save():Promise<void> {
        try {
            await new Promise(() => {
                sql.query('insert into sales (user_id, total_amount) values (?,?);', [this.user_id, this.total_amount], function(error) {
                    if(error) {
                        console.error("Error saving sale: ", error.sqlMessage);
                        return;
                    }
                    console.log("Sale saved successfully");
                });
            })
        }
        catch(error) {
            console.log(error);
        }
    }

    public static async all():Promise<Sale[]> {
        return new Promise((resolve) => {
            sql.query(`select *, sales.id from sales inner join users on sales.user_id=users.id`, (error, results) => {
                if(error) {
                    console.error("Error fetching sales: ", error.sqlMessage);
                    return;
                }
                else resolve(results as Sale[]);
            })
        })
    }

    public static async find(id:number):Promise<Sale[]> {
        return new Promise((resolve) => {
            sql.query(`select *, sales.id from sales where id=? inner join users on sales.user_id=users.id`, [id], (error, results) => {
                if(error) {
                    console.error("Error fetching sales: ", error.sqlMessage);
                    return;
                }
                else resolve(results as Sale[]);
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