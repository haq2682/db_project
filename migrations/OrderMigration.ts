import sql from "../db_config/config";

export default async function OrderMigration() {
    try {
        await new Promise((resolve) => {
            sql.query(`SELECT * FROM information_schema.tables WHERE table_schema='pharmacy' AND table_name='sales'`, function(error, results) {
                if(error) {
                    console.error("Error checking for table existance: ", error.sqlMessage);
                    return;
                }
                if(results.length === 0) {
                    console.error("Sales table not found. You must first add sales table before inserting orders table.");
                    return;
                }
                resolve(results);
            })
        });

        await new Promise((resolve) => {
            sql.query(`
                CREATE TABLE IF NOT EXISTS orders (
                    id INT PRIMARY KEY NOT NULL,
                    sales_id INT NOT NULL,
                    user_id INT NOT NULL,
                    delivery_status VARCHAR(30) NOT NULL,
                    is_cancelled TINYINT(1) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (sales_id) REFERENCES sales(id) ON DELETE CASCADE,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                );
            `, function(error, results) {
                if(error) {
                    console.error("Error inserting table: ", error.sqlMessage);
                    return;
                }
                console.error("Orders table inserted successfully");
                resolve(results);
            })
        });
    }

    catch(error) {
        console.error(error);
    }
}

OrderMigration();