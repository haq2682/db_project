import sql from "../db_config/config";

export default async function ItemsMigration(): Promise<void> {
    try {
        // Check if the products table exists
        await new Promise((resolve, reject) => {
            sql.query(`SELECT * FROM information_schema.tables WHERE table_schema = 'pharmacy' AND table_name = 'products'`,
                function (error, results) {
                    if (error) {
                        console.error("Error checking for table existence: ", error.sqlMessage);
                        reject(error);
                        return;
                    }
                    if (results.length === 0) {
                        console.error("Products table does not exist. You must first add the products table before adding the items table.");
                        reject(new Error("Products table does not exist."));
                        return;
                    }
                    resolve(results);
                }
            );
        });

        // Create the Items table if it doesn't exist
        await new Promise((resolve, reject) => {
            sql.query(`
                CREATE TABLE IF NOT EXISTS items (
                    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
                    item_name VARCHAR(255) NOT NULL,
                    item_price DECIMAL(10, 2) NOT NULL,
                    product_id INT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
                );
            `, function (error, results) {
                if (error) {
                    console.error("Error creating Items table: ", error.sqlMessage);
                    reject(error);
                    return;
                }
                console.log("Items table created successfully.");
                resolve(results);
            });
        });
    } catch (error) {
        console.error(error);
    }
}

ItemsMigration();
