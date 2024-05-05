import sql from '../db_config/config';

export default function UserMigration() {
    // Check if roles table exists
    sql.query(`SELECT * FROM information_schema.tables WHERE table_schema = 'pharmacy' AND table_name = 'roles'`, function(error, results) {
        if (error) {
            console.error("Error checking for table existence:", error);
            return;
        }
        if (results.length < 1) {
            console.log("Roles table does not exist. You must first add the roles table before adding the users table");
            return;
        }

        // Create users table
        sql.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
                first_name VARCHAR(15),
                last_name VARCHAR(15),
                username VARCHAR(20),
                email VARCHAR(30),
                password VARCHAR(255),
                contact VARCHAR(15),
                address VARCHAR(255),
                role_id INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
            );
        `, function(error) {
            if (error) {
                console.error("Error creating users table:", error);
                return;
            }
        });
    });
}
