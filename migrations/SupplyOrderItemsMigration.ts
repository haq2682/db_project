import sql from "../db_config/config";

export default async function SupplyOrderItemsMigration(): Promise<void> {
  try {
    await new Promise((resolve, reject) => {
      sql.query(
        `SELECT * FROM information_schema.tables WHERE table_schema = 'pharmacy' AND table_name = 'supplyOrders'`,
        function (error, results) {
          if (error) {
            console.error(
              "Error checking for table existence: ",
              error.sqlMessage
            );
            reject(error);
            return;
          }
          if (results.length === 0) {
            console.error(
              "Supply orders table does not exist. You must first add the supply orders table before adding the SupplyOrderItems table."
            );
            reject(new Error("Supply orders table does not exist."));
            return;
          }
          resolve(results);
        }
      );
    });
    await new Promise((resolve, reject) => {
      sql.query(
        `SELECT * FROM information_schema.tables WHERE table_schema = 'pharmacy' AND table_name = 'items'`,
        function (error, results) {
          if (error) {
            console.error(
              "Error checking for table existence: ",
              error.sqlMessage
            );
            reject(error);
            return;
          }
          if (results.length === 0) {
            console.error(
              "Items table does not exist. You must first add the Items table before adding the SupplyOrderItems table."
            );
            reject(new Error("Items  table does not exist."));
            return;
          }
          resolve(results);
        }
      );
    });
    await new Promise((resolve, reject) => {
      sql.query(
        `
                CREATE TABLE IF NOT EXISTS supplyOrders_items (
                    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
                    supplyOrder_id INT NOT NULL,
                    item_id INT NOT NULL,
                    item_quantity INT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (supplyOrder_id) REFERENCES supplyOrders(id) ON DELETE CASCADE,
                    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
                );
            `,
        function (error, results) {
          if (error) {
            console.error(
              "Error creating SupplyOrderItems table: ",
              error.sqlMessage
            );
            reject(error);
            return;
          }
          console.log("SupplyOrder_Items table created successfully.");
          resolve(results);
        }
      );
    });
  } catch (error) {
    console.error(error);
  }
}

SupplyOrderItemsMigration();
