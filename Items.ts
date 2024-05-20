import sql from '../db_config/config';

class Item {
    public id: number;
    public item_name: string;
    public item_price: number;
    public product_id: number;
    public created_at: Date;
    public updated_at: Date;

    public constructor(item_name?: string, item_price?: number, product_id?: number) {
        this.id = 0;
        this.item_name = item_name ?? '';
        this.item_price = item_price ?? 0;
        this.product_id = product_id ?? 0;
        this.created_at = new Date();
        this.updated_at = new Date();
    }

    public async save(): Promise<void> {
        try {
            await new Promise((resolve, reject) => {
                sql.query(
                    'INSERT INTO items (item_name, item_price, product_id) VALUES (?, ?, ?)',
                    [this.item_name, this.item_price, this.product_id],
                    function (error, results) {
                        if (error) {
                            console.error("Error saving item: ", error.sqlMessage);
                            reject(error);
                            return;
                        }
                        console.log("Item saved successfully");
                        resolve(results);
                    }
                );
            });
        } catch (error) {
            console.error(error);
        }
    }

    public static async all(): Promise<Item[]> {
        return new Promise((resolve, reject) => {
            sql.query('SELECT *,items.id FROM items inner join products on items.product_id = products.id', (error, results) => {
                if (error) {
                    console.error("Error fetching items: ", error.sqlMessage);
                    reject(error);
                    return;
                }
                resolve(results as Item[]);
            });
        });
    }

    public static async find(id: number): Promise<Item[]> {
        return new Promise((resolve, reject) => {
            sql.query('SELECT *,items.id FROM items WHERE id = ? inner join products on items.product_id = products.id', [id], (error, results) => {
                if (error) {
                    console.error("Error fetching item: ", error.sqlMessage);
                    reject(error);
                    return;
                }
                resolve(results as Item[]);
            });
        });
    }

    public static async update(id: number, attribute: string, value: unknown): Promise<void> {
        const query = `UPDATE items SET ${attribute} = ? WHERE id = ?`;
        try {
            await new Promise((resolve, reject) => {
                sql.query(query, [value, id], (error, results) => {
                    if (error) {
                        console.error("Error during updating: ", error.sqlMessage);
                        reject(error);
                        return;
                    }
                    console.log("Update successful");
                    resolve(results);
                });
            });
        } catch (error) {
            console.error(error);
        }
    }

    public static async delete(id: number): Promise<void> {
        try {
            await new Promise((resolve, reject) => {
                sql.query('DELETE FROM items WHERE id = ?', [id], function (error, results) {
                    if (error) {
                        console.error("Error deleting the item: ", error.sqlMessage);
                        reject(error);
                        return;
                    }
                    console.log("Deletion successful");
                    resolve(results);
                });
            });
        } catch (error) {
            console.error(error);
        }
    }
}

export default Item;
