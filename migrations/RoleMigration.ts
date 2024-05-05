import sql from '../db_config/config';

export default function RoleMigration() {
    // Create roles table if not exists
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS roles (
            id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
            role VARCHAR(15),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `;
    sql.query(createTableQuery, function(error, results, fields) {
        if (error) {
            console.error("Error creating roles table:", error);
            return;
        }

        console.log("Roles table created successfully");

        // Insert roles
        const roles = ['owner', 'customer'];
        const insertQuery = "INSERT INTO roles (role) VALUES (?)";
        roles.forEach(role => {
            sql.query(insertQuery, [role], function(error, results, fields) {
                if (error) {
                    console.error(`Error inserting role '${role}':`, error);
                }
            });
        });
    });
}
