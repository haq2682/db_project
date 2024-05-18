import sql from '../db_config/config';

class SupplyOrderItems {
    public id: number;
    public supplyOrderID: number;
    public itemID: number;
    public itemQuantity: number;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(supplyOrderID?: number, itemID?: number, itemQuantity?: number) {
        this.id = 0;
        this.supplyOrderID = supplyOrderID ?? 0;
        this.itemID = itemID ?? 0;
        this.itemQuantity = itemQuantity ?? 0;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    public async save(): Promise<void> {
        try {
            await new Promise((resolve, reject) => {
                sql.query('INSERT INTO SupplyOrderItems (supplyOrderID, itemID, item_quantity) VALUES (?, ?, ?)', [this.supplyOrderID, this.itemID, this.itemQuantity], function (error, results) {
                    if (error) {
                        console.error("Error saving supply order item: ", error.sqlMessage);
                        reject(error);
                        return;
                    }
                    console.log("Supply order item saved successfully");
                    resolve(results);
                });
            });
        } catch (error) {
            console.error(error);
        }
    }

    public static async all(): Promise<SupplyOrderItems[]> {
        return new Promise((resolve, reject) => {
            sql.query('SELECT * FROM SupplyOrderItems', (error, results) => {
                if (error) {
                    console.error("Error fetching supply order items: ", error.sqlMessage);
                    reject(error);
                    return;
                }
                resolve(results as SupplyOrderItems[]);
            });
        });
    }

    public static async find(id: number): Promise<SupplyOrderItems[]> {
        return new Promise((resolve, reject) => {
            sql.query('SELECT * FROM SupplyOrderItems WHERE id = ?', [id], (error, results) => {
                if (error) {
                    console.error("Error fetching supply order items: ", error.sqlMessage);
                    reject(error);
                    return;
                }
                resolve(results as SupplyOrderItems[]);
            });
        });
    }

    public static async update(id: number, attribute: string, value: unknown): Promise<void> {
        const query = `UPDATE SupplyOrderItems SET ${attribute} = ? WHERE id = ?`;
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
                sql.query('DELETE FROM SupplyOrderItems WHERE id = ?', [id], function (error, results) {
                    if (error) {
                        console.error("Error deleting the supply order item: ", error.sqlMessage);
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

export default SupplyOrderItems;
