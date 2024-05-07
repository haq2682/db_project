import sql from '../db_config/config';

export default async function UserMigration():Promise<void> {
    try {
        await new Promise((resolve) => {
            sql.query(`SELECT * FROM information_schema.tables WHERE table_schema = 'pharmacy' AND table_name = 'roles'`, 
                function(error, results) {
                    if(error) {
                        console.error("Error checking for table existance: ", error);
                        return;
                    }
                    if(results.length === 0) {
                        console.error("Roles table does not exist. You must first add the roles table before adding the users table.");
                        return;
                    }
                    return resolve(results);
                }
            )
        })
    }
    catch(error) {
        console.error(error);
    }
    sql.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
            first_name VARCHAR(15) NOT NULL,
            last_name VARCHAR(15) NOT NULL,
            username VARCHAR(20) NOT NULL,
            email VARCHAR(30) NOT NULL,
            password VARCHAR(255) NOT NULL,
            contact VARCHAR(15) NOT NULL,
            address VARCHAR(255) NOT NULL,
            role_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (role_id) REFERENCES roles(id)
        );
    `, function(error) {
        if (error) {
            console.error("Error creating users table: ", error.sqlMessage);
            return;
        }
        console.log('Users table created successfully.');
    });
}

UserMigration();