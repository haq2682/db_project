import sql from "../db_config/config";

export default async function SaleProductMigration():Promise<void> {
    try {
        await new Promise((resolve) => {
            sql.query(`SELECT * FROM information_schema.tables WHERE table_schema = 'pharmacy' AND table_name = 'sales'`,
                function(error, results) {
                    if(error) {
                        console.error("Error checking for table existance: ", error.sqlMessage);
                        return;
                    }
                    if(results.length === 0) {
                        console.error("Sales table does not exist. You must first add the sales table before adding the sales_products table.");
                        return;
                    }
                    return resolve(results);
                }
            );
        });
        await new Promise((resolve) => {
            sql.query(`SELECT * FROM information_schema.tables WHERE table_schema = 'pharmacy' AND table_name = 'products'`,
                function(error, results) {
                    if(error) {
                        console.error("Error checking for table existance: ", error.sqlMessage);
                        return;
                    }
                    if(results.length === 0) {
                        console.error("Products table does not exist. you must first add the products table before adding the sales_products table.");
                        return;
                    }
                    return resolve(results);
                }
            );
        });
        await new Promise((resolve) => {
            sql.query(`
                CREATE TABLE IF NOT EXISTS sales_products (
                    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
                    sales_id INT NOT NULL,
                    product_id INT NOT NULL,
                    quantity INT NOT NULL,
                    unit_price INT NOT NULL,
                    quantity_price INT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (sales_id) REFERENCES sales(id) ON DELETE CASCADE,
                    FOREIGN KEY (product_id) references products(id) ON DELETE CASCADE
                );
            `, function(error, results) {
                if(error) {
                    console.error("Error creating sales_products table: ", error.sqlMessage);
                    return;
                }
                console.log("Sales_Products table created successfully.");
                return resolve(results);
            });
        });
    }
    catch(error) {
        console.log(error);
    }
}

SaleProductMigration();