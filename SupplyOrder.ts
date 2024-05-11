import sql from '../db_config/config';
import User from "./User";
import Category from "./Category";

class SupplyOrder {
    public id: number;
    public user_id: number;
    public product_id: number;
    public product_quantity: number;
    public created_at: Date;
    public updated_at: Date;

    public constructor(user_id?: number, product_id?: number, product_quantity?: number) {
        this.id = 0;
        this.user_id = user_id ?? 0;
        this.product_id = product_id ?? 0;
        this.product_quantity = product_quantity ?? 0;
        this.created_at = new Date();
        this.updated_at = new Date();
    }

    public async save(): Promise<void> {
        try {
            await new Promise(() => {
                sql.query('INSERT INTO supply_orders (user_id, product_id, product_quantity) VALUES (?, ?, ?)', [this.user_id, this.product_id, this.product_quantity], function (error) {
                    if (error) {
                        console.error("Error saving supply order: ", error.sqlMessage);
                        return;
                    }
                    console.log("Supply order saved successfully");
                });
            })
        }
        catch (error) {
            console.error(error);
        }
    }

    public static async all(): Promise<SupplyOrder[]> {
        return new Promise((resolve) => {
            sql.query('SELECT * FROM supply_orders', (error, results) => {
                if (error) {
                    console.error("Error fetching supply orders: ", error.sqlMessage);
                    return;
                }
                else resolve(results as SupplyOrder[]);
            })
        })
    }

    public static async find(id: number): Promise<SupplyOrder[]> {
        return new Promise((resolve) => {
            sql.query('SELECT * FROM supply_orders WHERE id = ?', [id], (error, results) => {
                if (error) {
                    console.error("Error fetching supply orders: ", error.sqlMessage);
                    return;
                }
                else resolve(results as SupplyOrder[]);
            })
        })
    }

    public static async update(id: number, attribute: string, value: unknown): Promise<void> {
        const query = `UPDATE supply_orders SET ${attribute} = ? WHERE id = ?`;
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
        catch (error) {
            console.error(error);
        }
    }

    public static async delete(id: number): Promise<void> {
        try {
            await new Promise((resolve) => {
                sql.query('DELETE FROM supply_orders WHERE id = ?', [id], function (error, results) {
                    if (error) {
                        console.error("Error deleting the instance: ", error.sqlMessage);
                        return;
                    }
                    console.log("Deletion successful");
                    return resolve(results);
                });
            })
        }
        catch (error) {
            console.error(error);
        }
    }
}

export default SupplyOrder;
