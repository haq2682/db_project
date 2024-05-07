import sql from '../db_config/config';

export default async function ProductMigration():Promise<void> {
    try {
        await new Promise((resolve) => {
            sql.query(`SELECT * FROM information_schema.tables WHERE table_schema = 'pharmacy' AND table_name = 'users'`, function(error, results) {
                if(error) {
                    console.error("Error checking for table existance: ", error);
                    return;
                }
                if(results.length === 0) {
                    console.error("Users table does not exist. You must first add the users table before adding the products table.");
                    return;
                }
                return resolve(results);
            });
        });
        await new Promise((resolve) => {
            sql.query(`SELECT * FROM information_schema.tables WHERE table_schema = 'pharmacy' AND table_name = 'categories'`, function(error, results) {
                if(error) {
                    console.error("Error checking for table existance: ", error);
                    return;
                }
                if(results.length === 0) {
                    console.error("Categories table does not exist. You must first add the categories table before adding the products table.");
                    return;
                }
                return resolve(results);
            });
        });
        await new Promise((resolve) => {
            sql.query(`
                CREATE TABLE IF NOT EXISTS products (
                    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
                    name VARCHAR(50),
                    unit_price FLOAT NOT NULL,
                    quantity INT NOT NULL DEFAULT 1,
                    stock_status VARCHAR(15) DEFAULT 'in stock',
                    category_id INT NOT NULL,
                    user_id INT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                );
            `, function(error, results) {
                if (error) {
                    console.error("Error creating products table: ", error.sqlMessage);
                    return;
                }
                console.log("Products table created successfully.");
                return resolve(results);
            });
        });
    }
    catch(error) {
        console.error(error);
    }
}

ProductMigration();