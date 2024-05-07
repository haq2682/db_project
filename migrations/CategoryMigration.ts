import sql from '../db_config/config';

export default function CategoryMigration() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS categories (
            id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
            category VARCHAR(30) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `;
    sql.query(createTableQuery, function(error) {
        if (error) {
            console.error("Error creating categories table: ", error.sqlMessage);
            return;
        }
        const categories = ['pill', 'tablet', 'syrup','bandage', 'powder', 'facial', 'machine', 'tooth paste', 'tooth brush', 'hand sanitizer', 'fragrance', 'shampoo', 'cream', 'ointment', 'lotion', 'soap', 'miscellaneous'];
        const insertQuery = "INSERT INTO categories (category) VALUES (?)";
        categories.forEach(category => {
            sql.query(insertQuery, [category], function(error) {
                if (error) {
                    console.error(`Error inserting category '${category}':`, error);
                    return;
                }
            });
        });
        console.log("Categories table inserted successfully");
    });
}

CategoryMigration();