import sql from "../db_config/config";

export default async function SupplyOrderMigration(): Promise<void> {
  try {
    await new Promise((resolve) => {
      sql.query(
        `SELECT * FROM information_schema.tables WHERE table_schema = 'pharmacy' AND table_name = 'users'`,
        function (error, results) {
          if (error) {
            console.error("Error checking for table existence: ", error);
            return;
          }
          if (results.length === 0) {
            console.error(
              "Users table does not exist. You must first add the users table before adding the supply orders table."
            );
            return;
          }
          return resolve(results);
        }
      );
    });
    await new Promise((resolve) => {
      sql.query(
        `
                CREATE TABLE IF NOT EXISTS supplyOrders (
                    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
                    user_id INT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                );
            `,
        function (error, results) {
          if (error) {
            console.error(
              "Error creating supply orders table: ",
              error.sqlMessage
            );
            return;
          }
          console.log("Supply orders table created successfully.");
          return resolve(results);
        }
      );
    });
  } catch (error) {
    console.error(error);
  }
}

SupplyOrderMigration();
