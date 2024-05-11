import sql from "../db_config/config";

export default async function ProductSupplyMigration(): Promise<void> {
    try {
        await new Promise((resolve) => {
            sql.query(`SELECT * FROM information_schema.tables WHERE table_schema = 'pharmacy' AND table_name = 'supply_orders'`,
                function (error, results) {
                    if (error) {
                        console.error("Error checking for table existence: ", error.sqlMessage);
                        return;
                    }
                    if (results.length === 0) {
                        console.error("Supply orders table does not exist. You must first add the supply orders table before adding the product_supply table.");
                        return;
                    }
                    return resolve(results);
                }
            );
        });
        await new Promise((resolve) => {
            sql.query(`SELECT * FROM information_schema.tables WHERE table_schema = 'pharmacy' AND table_name = 'products'`,
                function (error, results) {
                    if (error) {
                        console.error("Error checking for table existence: ", error.sqlMessage);
                        return;
                    }
                    if (results.length === 0) {
                        console.error("Products table does not exist. You must first add the products table before adding the product_supply table.");
                        return;
                    }
                    return resolve(results);
                }
            );
        });
        await new Promise((resolve) => {
            sql.query(`
                CREATE TABLE IF NOT EXISTS product_supply (
                    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
                    supplyOrderID INT NOT NULL,
                    productID INT NOT NULL,
                    product_quantity INT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (supplyOrderID) REFERENCES supply_orders(supplyOrderID) ON DELETE CASCADE,
                    FOREIGN KEY (productID) REFERENCES products(productID) ON DELETE CASCADE
                );
            `, function (error, results) {
                if (error) {
                    console.error("Error creating product_supply table: ", error.sqlMessage);
                    return;
                }
                console.log("Product_Supply table created successfully.");
                return resolve(results);
            });
        });
    } catch (error) {
        console.error(error);
    }
}

ProductSupplyMigration();
