import sql from '../db_config/config';

export default function RoleMigration() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS roles (
            id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
            role VARCHAR(15) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `;
    sql.query(createTableQuery, function(error) {
        if (error) {
            console.error("Error creating roles table:", error);
            return;
        }

        const roles = ['owner', 'customer'];
        const insertQuery = "INSERT INTO roles (role) VALUES (?)";
        roles.forEach(role => {
            sql.query(insertQuery, [role], function(error) {
                if (error) {
                    console.error(`Error inserting role '${role}':`, error);
                    return;
                }
            });
        });
        console.log("Roles table inserted successfully");
    });
}

RoleMigration();
