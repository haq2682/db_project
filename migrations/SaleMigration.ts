import sql from "../db_config/config";

export default async function SaleMigration():Promise<void> {
    try {
        await new Promise((resolve) => {
            sql.query(`SELECT * FROM information_schema.tables WHERE table_schema = 'pharmacy' AND table_name = 'users'`, function(error, results) {
                if(error) {
                    console.error("Error checking for table existance: ", error.sqlMessage);
                    return;
                }
                if(results.length === 0) {
                    console.log("Users table does not exist. You must first add the users table before adding the sales table.");
                    return;
                }
                return resolve(results);
            });
        });
        await new Promise((resolve) => {
            sql.query(`
                CREATE TABLE IF NOT EXISTS sales (
                    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
                    user_id INT NOT NULL,
                    total_amount FLOAT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                );
            `, function(error, results) {
                if(error) {
                    console.error("Error creating sales table: ", error.sqlMessage);
                    return;
                }
                console.log("Sales table created successfully.");
                return resolve(results);
            });
        });
    }
    catch(error) {
        console.log(error);
    }
}

SaleMigration();