

async function manageSupplyOrders() {
  console.clear();
  console.log("Manage Supply Orders functionality");
  while (true) {
    console.log(`(1) Add a Supply Order.
(2) Remove a Supply Order.
(3) View Supply Orders.
(4) Find Supply Order.
(5) Update Supply Order.
(6) Exit.`);

    const choice = promptSync("Enter your choice: ");
    switch (choice) {
      case "1": {
        console.clear();
        console.log("Add a Supply Order");
        const id = Faker.randomInteger(1, 999999999);
        let insertMore = "y";
        let itemName;
        let item: any;
        let quantity : number;
        let total_amount = 0;
        let inserted = false;

        while (insertMore.toLowerCase() === "y" || insertMore.toLowerCase() === "yes") {
          while (true) {
            itemName = promptSync('Please enter the name of the Item: ');
            try {
              item = await ItemController.findByName(itemName);
            } catch (error) {
              console.error(error);
            }
            if (!item) {
              console.error("Item not found, please input again");
              continue;
            }
            quantity = parseInt(promptSync(`Please enter the quantity: `));
            if (quantity > 0) break;
            else console.error("Invalid quantity, please input again");
          }

          total_amount += item.item_price * quantity;

          if (!inserted) {
            try {
              await SupplyOrderController.authInsert(id, auth?.id);
              inserted = true;
            } catch (error) {
              console.error(error);
            }
          }

          try {
            await new Promise((resolve, reject) => {
              sql.query(`INSERT INTO supplyOrders_items (supplyOrder_id, item_id, item_quantity) VALUES (?, ?, ?)`,
                [id, item.id, quantity],
                (error, results) => {
                  if (error) reject(error);
                  resolve(results);
                });
            });
          } catch (error) {
            console.error(error);
          }

          if (item.product_id === null) {
            let productId;
            try {
              const result = await new Promise((resolve, reject) => {
                sql.query(`INSERT INTO products (name, price, stock_status, quantity) VALUES (?, ?, ?, ?)`,
                  [item.item_name, item.item_price, 'in stock', quantity],
                  function (error, results) {
                    if (error) reject(error);
                    resolve(results.insertId);
                  });
              });
              productId = result;
              await ItemController.update(item.id, 'product_id', productId);
            } catch (error) {
              console.error(error);
            }
          } else {
            try {
              const product = await ProductController.find(item.product_id);
              const newQuantity = product[0].quantity + quantity;
              await ProductController.update(item.product_id, 'quantity', newQuantity);
            } catch (error) {
              console.error(error);
            }
          }

          insertMore = promptSync("Do you want to add more items? y/n: ");
        }

        try {
          await SupplyOrderController.generateReceipt(id);
        } catch (error) {
          console.error(error);
        }

        console.log("Supply order added successfully");
        promptSync("Press enter key to continue...");
        break;
      }

      case "2": {
        console.clear();
        console.log("Remove a Supply Order");
        let id;
        let supplyOrder;

        while (true) {
          id = parseInt(promptSync("Enter the id of the supply order you want to delete: "));
          if (id >= 1) break;
        }

        supplyOrder = await SupplyOrderController.find(id);
        if (supplyOrder.length === 0) {
          console.error("Supply order does not exist");
        } else {
          await SupplyOrderController.delete(supplyOrder[0].id);
          console.log("Delete successful");
        }
        promptSync("Press enter key to continue...");
        break;
      }

      case "3": {
        console.log("View Supply Orders");
        const supplyOrders = await SupplyOrderController.all();
        if (supplyOrders.length === 0) {
          console.error("No supply orders made yet");
        } else {
          console.log(supplyOrders);
        }
        promptSync("Press enter key to continue...");
        break;
      }

      case "4": {
        console.log("Find Supply Order");
        let id;
        let supplyOrder;

        while (true) {
          id = parseInt(promptSync("Enter the id of the supply order you want to find: "));
          if (id >= 1) break;
        }

        supplyOrder = await SupplyOrderController.find(id);
        if (supplyOrder.length === 0) {
          console.error("Supply order does not exist");
        } else {
          console.log(supplyOrder);
        }
        promptSync("Press enter key to continue...");
        break;
      }

      case "5": {
        console.clear();
        console.log("Update a Supply Order");
        let id;
        let supplyOrder;

        while (true) {
          id = parseInt(promptSync("Enter the id of the supply order you want to update: "));
          if (id >= 1) break;
        }

        supplyOrder = await SupplyOrderController.find(id);
        if (supplyOrder.length === 0) {
          console.error("Supply order does not exist");
          promptSync("Press enter key to continue...");
          break;
        }

        let updateMore = "y";
        while (updateMore.toLowerCase() === "y" || updateMore.toLowerCase() === "yes") {
          let itemName;
          let item;
          let quantity;

          while (true) {
            itemName = promptSync('Please enter the name of the Item to update: ');
            try {
              item = await ItemController.findByName(itemName);
            } catch (error) {
              console.error(error);
            }
            if (!item) {
              console.error("Item not found, please input again");
              continue;
            }
            quantity = parseInt(promptSync(`Please enter the new quantity: `));
            if (quantity > 0) break;
            else console.error("Invalid quantity, please input again");
          }

          try {
            await new Promise((resolve, reject) => {
              sql.query(`UPDATE supplyOrders_items SET item_quantity = ? WHERE supplyOrder_id = ? AND item_id = ?`,
                [quantity, id, item.id],
                (error, results) => {
                  if (error) reject(error);
                  resolve(results);
                });
            });
            console.log("Item quantity updated successfully");
          } catch (error) {
            console.error(error);
          }

          updateMore = promptSync("Do you want to update more items? y/n: ");
        }

        promptSync("Press enter key to continue...");
        break;
      }

      case "6": {
        console.clear();
        console.log("Exiting ...");
        ownerMenu();
        return;
      }

      default: {
        console.log("Invalid choice, please select a valid option");
        break;
      }
    }
  }
}
