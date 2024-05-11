import sql from '../db_config/config';

class ProductSupply {
    public id: number;
    public supplyOrderID: number;
    public productID: number;
    public productQuantity: number;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(supplyOrderID?: number, productID?: number, productQuantity?: number) {
        this.id = 0;
        this.supplyOrderID = supplyOrderID ?? 0;
        this.productID = productID ?? 0;
        this.productQuantity = productQuantity ?? 0;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    public async save(): Promise<void> {
        try {
            await new Promise((resolve) => {
                sql.query('INSERT INTO product_supply (supplyOrderID, productID, product_quantity) VALUES (?, ?, ?)', [this.supplyOrderID, this.productID, this.productQuantity], function (error,results) {
                    if (error) {
                        console.error("Error saving product supply: ", error.sqlMessage);
                        return;
                    }
                    console.log("Product supply saved successfully");
                    return resolve(results);
                });
            });
        } catch (error) {
            console.error(error);
        }
    }

    public static async all(): Promise<ProductSupply[]> {
        return new Promise((resolve) => {
            sql.query('SELECT * FROM product_supply', (error, results) => {
                if (error) {
                    console.error("Error fetching product supplies: ", error.sqlMessage);
                    return;
                }
                else resolve(results as ProductSupply[]);
            })
        })
    }

    public static async find(id: number): Promise<ProductSupply[]> {
        return new Promise((resolve) => {
            sql.query('SELECT * FROM product_supply WHERE id = ?', [id], (error, results) => {
                if (error) {
                    console.error("Error fetching product supplies: ", error.sqlMessage);
                    return;
                }
                else resolve(results as ProductSupply[]);
            })
        })
    }

    public static async update(id: number, attribute: string, value: unknown): Promise<void> {
        const query = `UPDATE product_supply SET ${attribute} = ? WHERE id = ?`;
        try {
            await new Promise((resolve) => {
                sql.query(query, [value, id], (error,results) => {
                    if (error) {
                        console.error("Error during updating: ", error.sqlMessage);
                        return;
                    }
                    console.log("Updation successful");
                    return resolve(results);
                });
            });
        } catch (error) {
            console.error(error);
        }
    }

    public static async delete(id: number): Promise<void> {
        try {
            await new Promise((resolve) => {
                sql.query('DELETE FROM product_supply WHERE id = ?', [id], function (error,results) {
                    if (error) {
                        console.error("Error deleting the product supply: ", error.sqlMessage);
                        return;
                    }
                    console.log("Deletion successful");
                    return resolve(results);
                });
            });
        } catch (error) {
            console.error(error);
        }
    }
}

export default ProductSupply;
