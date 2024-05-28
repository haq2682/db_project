import prompt from "prompt-sync";
import sql from "./db_config/config";
import User from "./models/User";
import UserController from "./controllers/UserController";
import ProductController from "./controllers/ProductController";
import SupplyOrderController from "./controllers/SupplyOrderController";
import Product from "./models/Product";
import Faker from './faker/faker';
import SaleController from "./controllers/SaleController";
import OrderController from "./controllers/OrderController";
import Sale from "./models/Sale";
import Order from "./models/Order";
import ViewController from "./controllers/ViewController";
import SupplyOrder from "./models/SupplyOrder";
var promptSync = prompt();
let auth:User | undefined;
// Function to handle user login
async function role() {
  console.log(`----ONLINE PHARMACY----
  (1) owner
  (2) Customer
  (0) Exit`);
  var r = promptSync("Select your role: ");
  switch (r) {
    case "1": {
      console.clear();
      await Owner();
      break;
    }
    case "2": {
      console.clear();
      await customerMenu();
      break;
    }
    case "0":
      process.exit();
    default: {
      console.clear();
      console.log("Invalid role selected.");
      await role();
      break;
    }
  }
}
async function Owner() {
  console.log("----Welcome To Online Pharmacy----");
  console.log(`1. Login.
2. Register.
3. Exit.`);

  const action = promptSync("Select an action : ");
  switch (action) {
    case "1": {
      console.clear();
      await login();
      break;
    }
    case "2": {
      console.clear();
      await register();
      break;
    }
    case "3": {
      console.clear();
      console.log("exiting");
      await role();
    }
    default: {
      console.clear();
      console.log("Invalid option selected.");
      await Owner();
      break;
    }
  }
}
async function register() {
  console.log("-----REGISTERATION----");

  let user: {
    first_name:string,
    last_name:string,
    email:string,
    username:string,
    password:string,
    contact:string,
    address:string,
    role_id:number
  } = {
    first_name: "",
    last_name: "",
    email: "",
    username:"",
    password: "",
    contact: "",
    address: "",
    role_id: 0
  };

  while(true) {
    user.first_name = promptSync("Enter your firstname: ");
    if(user.first_name.length >= 1) break;
  }
  
  while(true) {
    user.last_name = promptSync("Enter your lastname: ");
    if(user.last_name.length >= 1) break;
  }
  
  while(true) {
    user.email = promptSync("Enter your email: ");
    if(user.email.length >= 1) break;
  }

  while(true) {
    user.username = promptSync("Enter your username: ");
    if(user.username.length >= 1) break;
  }

  while(true) {
    user.password = promptSync("Enter your password: ", {echo: "*"});
    if(user.password.length >= 1) break;
  }
  
  while(true) {
    user.contact = promptSync("Enter your contact number: ");
    if(user.contact.length >= 1) break;
  }

  while(true) {
    user.address = promptSync("Enter your address: ");
    if(user.address.length >= 1) break;
  }

  console.log(`Enter your Role ID
  1. Owner.
  2. Customer.`);
  while(true) {
    user.role_id = parseInt(promptSync("Select a role: "));
    if(user.role_id === 1 || user.role_id === 2) break;
    else console.error("Role input is invalid, please try again");
  }
  let newUser = new User(user.first_name, user.last_name, user.username, user.email, user.password, user.contact, user.address, user.role_id);
  await newUser.save();
  console.log("User created successfully!");
  promptSync("Press enter to continue...");
  console.clear();
  await Owner();
}
async function login() {
  console.clear();
  console.log("----login to ONLINE PHARMACY----");
  
  let user: User | undefined;
  let username: string;
  let password: string;

  username = promptSync("Enter your username: ");

  try {
    user = await UserController.findByUsername(username);    
  }

  catch(error) {
    console.error(error);
  }

  if(!user) {
    promptSync("No account found with that username. Press enter key to try again...");
    login();
  }
  
  while(user && true) { // Ensure user is defined before checking password
    password = promptSync("Enter your password: ", { echo: "*" });
    if(password.length >= 1) {
      if(user.password === password) {
        auth = user;
        break;
      } else {
        console.error("Incorrect password, please try again.");
        continue; // Continue the loop if password is incorrect
      }
    }
  }

  if(user && user.role_id === 1) ownerMenu();
  else if(user && user.role_id === 2) customerMenu();
}

// Owner menu
async function ownerMenu() {
  console.clear();
  console.log("----Welcome To Online Pharmacy----");
  while (true) {
    console.log(`(1) Accounts.
(2) Search Products.
(3) Add product
(4) Edit Product
(5) Delete Product
(6) Manage Orders.
(7) Manage Sales.
(8) Check Inventory Levels.
(9) Supply order.
(10) Check Financial Records.
(11) generate receipt.
(12) Manage Refunds.
(13) LogOut.
(14) Exit System.`);

    var action = promptSync("Select an action : ");

    switch (action) {
      case "1": {
        console.clear();
        console.log("Accounts");
        await accounts();
        break;
      }
      case "2": {
        console.clear();
        console.log("Search Products");
        await searchProducts();
        break;
      }
      case "3": {
        console.clear();
        console.log("Add product");
        let product: {
          name:string,
          unit_price:number,
          quantity:number,
          category_id:number,
          user_id:number | undefined,
        } = {
          name:"",
          unit_price: 0,
          quantity: 0,
          category_id: 0,
          user_id: auth?.id
        }

        let category:string;

        while(true) {
          product.name = promptSync("Enter name of the product: ");
          if(product.name.length >= 1) break;
        }
        while(true) {
          product.unit_price = parseInt(promptSync("Enter the unit price of the product: "));
          if(product.unit_price >= 1) break;
        }
        while(true) {
          product.quantity = parseInt(promptSync("Enter the quantity fo the stock: "));
          if(product.quantity >= 1) break;
        }
        let categories:any[] = await new Promise((resolve, reject) => {
          sql.query("SELECT category FROM categories", function(error, results) {
            if(error) reject(error);
            resolve(results);
          })
        })
        console.log(categories);
        let flag:boolean = false;
        while(true) {
          category = promptSync("Enter the category: ");
          for(let i = 0; i < categories.length; i++) {
            if(category === categories[i].category) {
              flag = true;
              product.category_id = i+1;
              break;
            }
          }
          if(!flag) {
            console.log("Category does not exist, please refer to the categories inside the database and try again...");
          }
          else break;
        }
        ProductController.insert(product.name, product.unit_price, product.quantity, 'in stock', product.category_id, 5);
        console.log("Product created successfully");
        promptSync("Press enter key to continue...");
        break;
      }
      case "4": {
        console.clear();
        console.log("Edit a product");
        let id:number;
        while(true) {
          id = parseInt(promptSync("Enter id of the product: "));
          if(id >= 1) {
            try {
              const product = await ProductController.authSearch(id, auth?.id);
              if(!product) break;
              else {
                console.clear();
                console.log("Product of the inputted id not found, please input again...");
              }
            }
            catch(error) {
              console.log(error);
            }
          }
        }
        let attribute:string;
        let attributes:string[] = ["name", "unit_price", "quantity", "stock_status", "category_id"];
        let flag:boolean = false;
        while(true) {
          attribute = promptSync("What do you want to update? (Remember to put \"_\" at the place of spaces): ");
          for(let i = 0; i < attributes.length; i++) {
            if(attributes[i] === attribute) {
              flag = true;
              break;
            }
          }
          if(!flag) {
            promptSync("Attribute not found, press enter to input attribute again...");
            console.clear();
          }
          else if(flag) break;
        }
        let value:any;
        while(true) {
          value = promptSync("Enter value of the field you want to update: ");
          if(value.length >= 1) break;
        }
        if(attribute === "unit_price" || attribute === "quantity" || attribute === "category_id") value = parseInt(value);
        try {
          await ProductController.update(id, attribute, value);
          console.log(`Successfully updated ${attribute}!`);
          promptSync("Press enter to continue...");
        }
        catch(error) {
          console.error(error);
        }
        break;
      }
      case "5": {
        console.clear();
        console.log("Remove a Product");
        let id:number;
        while(true) {
          id = parseInt(promptSync("Enter id of the product: "));
          if(id >= 1) {
            try {
              const product = await ProductController.find(id);
              if(!product) break;
              else {
                console.clear();
                console.log("Product of the inputted id not found, please input again...");
              }
            }
            catch(error) {
              console.log(error);
            }
          }
        }
        try {
          await ProductController.delete(id);
          console.log("Product deleted successfully");
          promptSync("Press enter to continue...");
        }
        catch(error) {
          console.error(error);
        }
        break;
      }
      case "6": {
        console.clear();
        console.log("Manage Orders");
        await manageorders();
        break;
      }
      case "7": {
        console.clear();
        console.log("Manage Sales");
        await managesales();
        break;
      }
      case "8": {
        console.clear();
        console.log("Check Inventory Levels");
        await checkinventory();
        break;
      }
      case "9": {
        console.clear();
        console.log("Suppply order");
        await supplyorder();
        break;
      }
      case "10": {
        console.clear();
        console.log("Check Financial Records");
        await checkfinancialrecords();
        break;
      }
      case "11": {
        console.clear();
        console.log("generate receipt");
        let id:number = parseInt(promptSync("Enter the id of the sale to generate receipt: "));
        await generatereceipt(id);
        break;
      }
      case "12": {
        console.clear();
        console.log("Manage Refunds");
        try {
          let id = parseInt(promptSync("Enter Sale ID: "));
          await managerefunds(id);
        }
        catch(error) {
          console.error(error);
        }
        break;
      }

      case "13": {
        console.clear();
        auth = undefined;
        console.log("Logging out");
        role();
        break;
      }
      case "14": {
        auth = undefined;
        console.log("Exiting System...");
        process.exit();
      }
      default: {
        console.clear();
        console.log("Invalid option.");
        await ownerMenu();
        break;
      }
    }
  }
}

// Customer menu
async function customerMenu() {
  console.clear();
  if (!auth) {
    while (true) {
      console.clear();
      console.log(`----welcome to Online Pharmacy---
    1. Browse Products.
    2. Search Products.
    3. Place Order.
    4. Login.
    5. Register.
    6. exit menu.`);

      const action = promptSync("Select an action: ");
      switch (action) {
        case "1": {
          await showAllproducts();
          promptSync("Press enter key to continue...")
          break;
        }
        case "2": {
          console.clear();
          console.log("Search Products");
          let name:string;
          let item:unknown;
          let string:string;
          while(true) {
            name = promptSync("Enter the name of the item: ");
            string = `%${name}$`;
            item = await ProductController.customerSearch(string);
            if(!item) console.error("Item not found, please input again...");
            else {
              console.log(item);
              promptSync("Press enter key to continue...");
              break;
            }
          }
          break;
        }
        case "3": {
          if (!auth) {
            console.clear();
            console.log("please login/ Register first");
            await Owner();
            break;
          } else {
            console.clear();
            console.log("ORDER");
            await order();
            break;
          }
        }
        case "4": {
          console.clear();
          console.log("Login");
          await login();
          break;
        }
        case "5": {
          console.clear();
          console.log("Register");
          await register();
          break;
        }
        case "6": {
          console.clear();
          console.log("Exiting menu...");
          await role();
          break;
        }
        default:
          console.log("Invalid option.");
          await customerMenu();
      }
    }
  } else if (auth) {
    while (true) {
      console.log(`----welcome to Online Pharmacy---
      1. Browse Products.
      2. Search Products.
      3. Place Order.
      4. Logout.
      5. exit menu.`);

      const action = promptSync("Select an action");
      switch (action) {
        case "1": {
          console.log("products...");
          await showAllproducts();
          promptSync("Press enter key to continue...");
          break;
        }
        case "2": {
          console.clear();
          console.log("Search Products");
          let name:string;
          let item:unknown;
          let string:string;
          while(true) {
            name = promptSync("Enter the name of the item: ");
            string = `%${name}$`;
            item = await ProductController.customerSearch(string);
            if(!item) console.error("Item not found, please input again...");
            else {
              console.log(item);
              promptSync("Press enter key to continue...");
              break;
            }
          }
          break;
        }
        case "3": {
          console.clear();
          console.log("ORDER");
          await order();
          break;
        }
        case "4": {
          console.clear();
          console.log("Logging out");
          auth = undefined;
          await customerMenu();
          break;
        }
        case "5": {
          console.clear();
          console.log("Exiting menu...");
          await role();
          break;
        }
        default:
          console.log("Invalid option.");
          await customerMenu();
      }
    }
  }
}
async function accounts() {
  console.clear();
  console.log("Accounts functionality");

  while (true) {
    console.log(`(1) Add an Account.
(2) Remove an Account.
(3) Edit an Account.
(4) View Accounts.
(5) Find Accounts.
(6) exit.`);

    var choice = promptSync("Enter your choice: ");
    switch (choice) {
      case "1": {
        console.clear();
        await register();
        break;
      }

      case "2": {
        console.clear();
        console.log("Remove an Account");
        let username:string;
        while(true) {
          username = promptSync("Enter username: ");
          if(username.length >= 1) {
            try {
              const user = await UserController.checkUsername(username);
              if(!user) break;
              else {
                console.clear();
                console.log("User of the inputted username not found, please input again...");
              }
            }
            catch(error) {
              console.log(error);
            }
          }
        }
        try {
          await UserController.deleteByUsername(username);
          console.log("User deleted successfully");
          promptSync("Press enter to continue...");
        }
        catch(error) {
          console.error(error);
        }
        break;
      }

      case "3": {
        console.clear();
        console.log("Edit an Account");
        let username:string;
        while(true) {
          username = promptSync("Enter username: ");
          if(username.length >= 1) {
            try {
              const user = await UserController.checkUsername(username);
              if(!user) break;
              else {
                console.clear();
                console.log("User of the inputted username not found, please input again...");
              }
            }
            catch(error) {
              console.log(error);
            }
          }
        }
        let attribute:string;
        let attributes:string[] = ["first_name", "last_name", "username", "email", "contact", "address", "role_id"];
        let flag:boolean = false;
        while(true) {
          attribute = promptSync("What do you want to update? (Remember to put \"_\" at the place of spaces): ");
          for(let i = 0; i < attributes.length; i++) {
            if(attributes[i] === attribute) {
              flag = true;
              break;
            }
          }
          if(!flag) {
            promptSync("Attribute not found, press enter to input attribute again...");
            console.clear();
          }
          else if(flag) break;
        }
        let value:string;
        while(true) {
          value = promptSync("Enter value of the field you want to update: ");
          if(value.length >= 1) break;
        }
        try {
          await UserController.updateByUsername(attribute, value, username);
          console.log(`Successfully updated ${attribute}!`);
          promptSync("Press enter to continue...");
        }
        catch(error) {
          console.error(error);
        }
        break;
      }

      case "4": {
        console.clear();
        console.log("View  Accounts");
        try {
          const users = UserController.allCustomers();
          console.log(users);
        }
        catch(error) {
          console.error(error);
        }
        break;
      }

      case "5": {
        console.clear();
        console.log("Find  Accounts");
        let username:string;
        while(true) {
          username = promptSync("Enter username: ");
          if(username.length >= 1) break;
        }
        try {
          const user = UserController.findByUsername(username);
          console.log(user);
        }
        catch(error) {
          console.error(error);
        }
        break;
      }

      case "6": {
        console.clear();
        console.log("Exiting ...");
        await ownerMenu();
        break;
      }
    }
  }
}
async function manageorders() {
  console.clear();
  console.log("Manage Orders functionality");

  while (true) {
    console.log(`
(1) Remove an Order Record.
(2) View Order Records.
(3) Find an Order Record By Order ID.
(4) Find Order Records By Customer ID.
(5) exit.`);

    var choice = promptSync("Enter your choice: ");
    switch (choice) {
      case "1": {
        console.clear();
        console.log("Remove an Order");
        let id:number;
        let order:Order;
        while(true) {
          id = parseInt(promptSync("Please enter order number: "));
          if(id >= 1) {
            order = await OrderController.find(id);
            if(order) {
              await OrderController.delete(id);
              promptSync("Order deleted Successfully... Please enter key to continue...");
              break;
            }
            else {
              console.error("Order not found. Please input again...");
            }
          }
        }
        break;
      }

      case "2": {
        console.clear();
        console.log("View Orders");
        let orders:any;
        orders = await OrderController.allByAuth(auth?.id);
        if(orders.length > 0) {
          console.log(orders);
        }
        else {
          console.error("No orders found");
        }
        promptSync("Press enter key to continue...");
        break;
      }

      case "3": {
        console.clear();
        console.log("Find Order by Order ID");
        let id:number;
        let order:Order;
        while(true) {
          id = parseInt(promptSync("Please enter order number: "));
          if(id >= 1) {
            order = await OrderController.find(id);
            if(order) {
              console.log(order);
              promptSync("Please enter key to continue...");
              break;
            }
            else {
              console.error("Order not found. Please input again...");
            }
          }
        }
        break;
      }

      case "4": {
        console.clear();
        console.log("Find Orders by Customer Username");
        let username:string;
        let order:any;
        while(true) {
          username = promptSync("Please enter customer username: ");
          if(username.length >= 1) {
            order = await OrderController.findOrderByCustomerUsername(username);
            if(order) {
              console.log(order);
              promptSync("Please enter key to continue...");
              break;
            }
            else {
              console.error("Order not found. Please input again...");
            }
          }
        }
        break;
      }

      case "5": {
        console.clear();
        console.log("Exiting ...");
        await ownerMenu();
        break;
      }
    }
  }
}
async function managesales() {
  console.clear();
  console.log("Manage Sales functionality");
  while (true) {
    console.log(`(1) Add a Sale Record.
(2) Remove a Sale Record.
(3) View Sale Records.
(4) Find Sale Record.
(5) Exit.`);

    var choice = promptSync("Enter your choice: ");
    switch (choice) {
      case "1": {
        console.clear();
        console.log("Add a Sale Record");
        let id:number = Faker.randomInteger(1, 999999999);
        let insertMore:string = "y";
        let productName:string;
        let product:Product[];
        let quantity:number;
        let total_amount:number = 0;
        let inserted:boolean = false;
        while(insertMore === "y" || insertMore === "Y" || insertMore === "Yes" || insertMore === "yes") {
          while(true) {
            productName = promptSync('Please enter the name of the Product: ');
            product = await ProductController.findByName(productName, auth?.id);
            quantity = parseInt(promptSync(`Please enter the quantity [Max: ${product[0].quantity}]: `));
            if(product[0] && product[0].stock_status === 'in stock' && product[0].quantity > 0 && quantity <= product[0].quantity) break;
            else if(product[0] && product[0].stock_status !== 'in stock' || product[0].quantity === 0) console.error("Product is out of stock, please input name of another product");
            else if(product[0].quantity < quantity) console.error("Not enough quantity, please input again");
            else console.error("Product not found, please input again");
          }
          total_amount += product[0].unit_price*quantity;
          if(!inserted) {
            await SaleController.authInsert(id, auth?.id, total_amount);
            inserted = true;
          }
          await new Promise((reject, resolve) => {
            sql.query(`INSERT INTO sales_products (sales_id, product_id, quantity, unit_price, quantity_price) VALUES (?, ?, ?, ?, ?)`, [id, product[0].id, quantity, product[0].unit_price, product[0].unit_price*quantity], function(error, results) {
              if(error) reject(error);
              resolve(results);
            })
          });
          await ProductController.update(product[0].id, 'quantity', (product[0].quantity-quantity));
          if(product[0].quantity-quantity === 0) await ProductController.update(product[0].id, 'stock_status', 'out of stock');
          insertMore = promptSync("Do you want to add more products? y/n: ");
        }
        await generatereceipt(id);
        console.log("Products sold successfully");
        promptSync("Press enter key to continue...");
        break;
      }

      case "2": {
        console.clear();
        console.log("Remove a Sale Record");
        let id:number;
        let sale:Sale[];
        while(true) {
          id = parseInt(promptSync("Enter the id of the sale record you want to delete: "));
          if(id >= 1) break;
        }
        sale = await SaleController.find(id);
        if(sale.length === 0) {
          console.error("Sale does not exist");
        }
        else {
          await SaleController.delete(sale[0].id);
          console.log("Delete successful");
        }
        promptSync("Press enter key to continue...");
      }

      case "3": {
        console.log("View  Sale records");
        let sales:Sale[] = await SaleController.all();
        if(sales.length === 0) {
          console.error("There is no sale made yet");
        }
        else {
          console.log(sales);
        }
        promptSync("Press enter key to continue...");
      }

      case "4": {
        console.clear();
        console.log("Find  Sale records");
        let id:number;
        let sale:Sale[];
        while(true) {
          id = parseInt(promptSync("Enter the id of the sale record you want to find: "));
          if(id >= 1) break;
        }
        sale = await SaleController.find(id);
        if(sale.length === 0) {
          console.error("Sale does not exist");
        }
        else {
          console.log(sale);
        }
        promptSync("Press enter key to continue...");
      }
      case "5": {
        console.clear();
        console.log("Exiting ...");
        await ownerMenu();
        break;
      }
    }
  }
}

async function checkinventory() {
  console.clear();
  console.log("Check Inventory Levels functionality");
  try {
    const results = await ProductController.allByAuth(auth?.id);
    console.log(results);
  }
  catch(error) {
    console.log(error);
  }
}
async function supplyorder() {
  console.log("Supply Order functionality");

  while (true) {
    console.log(`(1) Add a Supply Order.
    (2) Remove a Supply Order.
    (3) View Supply Orders .
    (4) Find supply Order Record.
    (5) Exit.`);

    var choice = promptSync("Enter your choice: ");
    switch (choice) {
      case "1": {
        console.clear();
        console.log("Add a Supply Order");
        let id:number = Faker.randomInteger(1, 999999999);
        let insertMore:string = "y";
        let productName:string;
        let product:Product[];
        let product_id:number;
        let product_price:number;
        let quantity:number;
        let inserted:boolean = false;
        while(insertMore === "y" || insertMore === "Y" || insertMore === "Yes" || insertMore === "yes") {
          while(true) {
            productName = promptSync('Please enter the name of the item: ');
            if(productName.length>=1) break;
          }
            product = await ProductController.findByName(productName, auth?.id);
            if(product[0]) {
              product_id = product[0].id;
              product_price = product[0].unit_price;
            }
            else {
              product_id = 0;
              product_price = parseFloat(promptSync('Enter item\'s unit price: '));
            }
            quantity = parseInt(promptSync('How many units do you want to order?: '));
          if(!inserted) {
            await SupplyOrderController.authInsert(id, auth?.id);
            inserted = true;
          }
          await new Promise((reject, resolve) => {
            sql.query(`INSERT INTO items (item_name, item_price, product_id) VALUES (?, ? ,?)`, [productName, product_price, product_id], function(error, results) {
              error ? reject(error) : resolve(results);
            });
          })
          await new Promise((reject, resolve) => {
            sql.query(`INSERT INTO supplyorders_items (supplyOrder_id, item_id, item_quantity) VALUES (?, ?, ?)`, [id, product_id, quantity, product[0].unit_price*quantity], function(error, results) {
              if(error) reject(error);
              resolve(results);
            })
          });
          insertMore = promptSync("Do you want to add more products? y/n: ");
        }
        await SupplyOrderController.generateReceipt(id);
        console.log("Products ordered successfully");
        promptSync("Press enter key to continue...");
        break;
      }
      case "2": {
        console.clear();
        console.log("Remove a Supply Order");
        let id:number;
        let order:SupplyOrder[];
        while(true) {
          id = parseInt(promptSync("Enter the id of the supply order you want to delete: "));
          if(id >= 1) break;
        }
        order = await SupplyOrderController.find(id);
        if(order.length === 0) {
          console.error("Supply Order does not exist");
        }
        else {
          await SupplyOrderController.delete(order[0].id);
          console.log("Delete successful");
        }
        promptSync("Press enter key to continue...");
      }
      case "3": {
        console.clear();
        console.log("View Supply Orders");
        let orders:SupplyOrder[] = await SupplyOrderController.all();
        if(orders.length === 0) {
          console.error("There is no supply ordered yet");
        }
        else {
          console.log(orders);
        }
        promptSync("Press enter key to continue...");
      }
      case "4": {
        console.clear();
        console.log("Find supply Order Record");
        let id:number;
        let order:SupplyOrder[];
        while(true) {
          id = parseInt(promptSync("Enter the id of the supply order you want to find: "));
          if(id >= 1) break;
        }
        order = await SupplyOrderController.find(id);
        if(order.length === 0) {
          console.error("Supply Order does not exist");
        }
        else {
          console.log(order);
        }
        promptSync("Press enter key to continue...");
      }
      case "5": {
        console.clear();
        console.log("Exiting ...");
        await ownerMenu();
        break;
      }
    }
  }
}
async function checkfinancialrecords() {
  console.log("Check Financial Records functionality");
  while (true) {
    console.log(`(1) Check Daily Profit.
    (2) Check Total Daily Profit.
    (3) Check Total Monthly Profit.
    (4) Check Total Yearly Profit.
    (5) Check Profit Between Specific Date and Time.
    (6) Check Daily Expenditure.
    (7) Check Total Daily Expenditure.
    (8) Check Total Monthly Expenditure.
    (9) Check Total Yearly Expenditure.
    (10) Check Expenditure Between Specific Date and Time.
    (11) Check Daily Sales.
    (12) Check Total Daily Sales.
    (13) Check Total Monthly Sales.
    (14) Check Total Yearly Sales.
    (15) Check Products Sold Between Specific Date and Time.
    (16) Check Products Sold on Specific Day.
    (0) Exit.
    `);

    var choice = promptSync("Enter your choice: ");
    switch (choice) {
      case "1": {
        try {
          await ViewController.dailyProfit();
        }
        catch(error) {
          console.error(error);
        }
        promptSync("Press enter key to continue...");
        break;
      }
      case "2": {
        try {
          await ViewController.totalDailyProfit();
        }
        catch(error) {
          console.error(error);
        }
        promptSync("Press enter key to continue...");
        break;
      }
      case "3": {
        try {
          await ViewController.totalMonthlyProfit();
        }
        catch(error) {
          console.error(error);
        }
        promptSync("Press enter key to continue...");
        break;
      }
      case "4": {
        try {
          await ViewController.totalYearlyProfit();
        }
        catch(error) {
          console.error(error);
        }
        promptSync("Press enter key to continue...");
        break;
      }
      case "5": {
        try {
          let fromDate = promptSync('Enter from date: ');
          let toDate = promptSync('Enter to date: ');
          let from:Date = new Date(fromDate);
          let to:Date = new Date(toDate);
          await ViewController.profitBetweenDateTime(from, to);
        }
        catch(error) {
          console.error(error);
        }
        promptSync("Press enter key to continue...");
        break;
      }
      case "6": {
        try {
          await ViewController.dailyPurchase();
        }
        catch(error) {
          console.error(error);
        }
        promptSync("Press enter key to continue...");
        break;
      }
      case "7": {
        try {
          await ViewController.totalDailyPurchase();
        }
        catch(error) {
          console.error(error);
        }
        promptSync("Press enter key to continue...");
        break;
      }
      case "8": {
        try {
          await ViewController.totalMonthlyPurchase();
        }
        catch(error) {
          console.error(error);
        }
        promptSync("Press enter key to continue...");
        break;
      }
      case "9": {
        try {
          await ViewController.totalYearlyPurchase();
        }
        catch(error) {
          console.error(error);
        }
        promptSync("Press enter key to continue...");
        break;
      }
      case "10": {
        try {
          let fromDate = promptSync('Enter from date: ');
          let toDate = promptSync('Enter to date: ');
          let from:Date = new Date(fromDate);
          let to:Date = new Date(toDate);
          await ViewController.purchaseBetweenDateTime(from, to);
        }
        catch(error) {
          console.error(error);
        }
        promptSync("Press enter key to continue...");
        break;
      }
      case "11": {
        try {
          await ViewController.dailySales();
        }
        catch(error) {
          console.error(error);
        }
        promptSync("Press enter key to continue...");
        break;
      }
      case "12": {
        try {
          await ViewController.totalDailySales();
        }
        catch(error) {
          console.error(error);
        }
        promptSync("Press enter key to continue...");
        break;
      }
      case "13": {
        try {
          await ViewController.totalMonthlySales();
        }
        catch(error) {
          console.error(error);
        }
        promptSync("Press enter key to continue...");
        break;
      }
      case "14": {
        try {
          await ViewController.totalYearlyPurchase();
        }
        catch(error) {
          console.error(error);
        }
        promptSync("Press enter key to continue...");
        break;
      }
      case "15": {
        try {
          let fromDate = promptSync('Enter from date: ');
          let toDate = promptSync('Enter to date: ');
          let from:Date = new Date(fromDate);
          let to:Date = new Date(toDate);
          await ViewController.saleBetweenDateTime(from, to);
        }
        catch(error) {
          console.error(error);
        }
        promptSync("Press enter key to continue...");
        break;
      }
      case "16": {
        try {
          let day = promptSync('Enter from date: ');
          let dayDate:Date = new Date(day);
          await ViewController.saleOnSpecificDay(dayDate);
        }
        catch(error) {
          console.error(error);
        }
        promptSync("Press enter key to continue...");
        break;
      }
      case "0": {
        console.clear();
        console.log("Exiting...");
        await customerMenu();
        break;
      }

      default: {
        console.error("Invalid Option");
        promptSync("Press enter key to try again...");
      }
    }
  }
}
async function generatereceipt(id:number) {
  console.clear();
  console.log("Generate Receipt functionality");
  const result = await SaleController.generateReceipt(id);
  if(result.length > 0) console.log(result);
  else console.error("Sale not found");
}

// customer functions
async function order() {
  while (true) {
    console.log(`(1) Add Order.
    (2) Cancel Order.
    (3) View Placed Orders.
    (4) Find Order.
    (5) Exit.`);

    var action = promptSync("Enter Your Choice");
    switch (action) {
      case "1": {
        console.clear();
        console.log("Place an order");
        let sales_id:number = Faker.randomInteger(1, 999999999);
        let order_id:number = Faker.randomInteger(1, 999999999);
        let insertMore:string = "y";
        let productName:string;
        let product:Product[];
        let quantity:number;
        let total_amount:number = 0;
        let inserted:boolean = false;
        while(insertMore === "y" || insertMore === "Y" || insertMore === "Yes" || insertMore === "yes") {
          while(true) {
            productName = promptSync('Please enter the name of the Product: ');
            product = await ProductController.findByName(productName, auth?.id);
            quantity = parseInt(promptSync(`Please enter the quantity [Max: ${product[0].quantity}]: `));
            if(product[0] && product[0].stock_status === 'in stock' && product[0].quantity > 0 && quantity <= product[0].quantity) break;
            else if(product[0] && product[0].stock_status !== 'in stock' || product[0].quantity === 0) console.error("Product is out of stock, please input name of another product");
            else if(product[0].quantity < quantity) console.error("Not enough quantity, please input again");
            else console.error("Product not found, please input again");
          }
          total_amount += product[0].unit_price*quantity;
          if(!inserted) {
            await SaleController.authInsert(sales_id, product[0].user_id, total_amount);
            await OrderController.insert(order_id, sales_id, auth?.id);
            inserted = true;
          }
          await new Promise((reject, resolve) => {
            sql.query(`INSERT INTO sales_products (sales_id, product_id, quantity, unit_price, quantity_price) VALUES (?, ?, ?, ?, ?)`, [sales_id, product[0].id, quantity, product[0].unit_price, product[0].unit_price*quantity], function(error, results) {
              if(error) reject(error);
              resolve(results);
            })
          });
          await ProductController.update(product[0].id, 'quantity', (product[0].quantity-quantity));
          if(product[0].quantity-quantity === 0) await ProductController.update(product[0].id, 'stock_status', 'out of stock');
          insertMore = promptSync("Do you want to add more products? y/n: ");
        }
        await generatereceipt(sales_id);
        console.log("Order Placed Successfully... Please note down this Order Number: " + order_id + "\nAnd Receipt Number: " + sales_id);
        promptSync("Press enter key to continue...");
        break;
      }

      case "2": {
        console.clear();
        console.log("Cancelling an order");
        let id:number;
        let order:any;
        try {
          while(true) {
            id = parseInt(promptSync("Please enter Order Number: "));
            if(id >= 1) {
              order = await OrderController.find(id);
              if(!order) console.error("Order not found. Please input again");
              else break;
            }
          }
          await OrderController.cancelOrder(id);
          await managerefunds(order.sales_id);
          console.log("Order cancelled successfully");
        }
        catch(error) {
          console.error(error);
        }
        break;
      }

      case "3": {
        console.clear();
        try {
          let orders:any = await OrderController.allByCustomer(auth?.id);
          console.log(orders);
          promptSync("Press enter key to continue...");
        }
        catch(error) {
          console.error(error);
        }
        break;
      }
      case "4": {
        console.clear();
        let id:number;
        let order:any;
        while(true) {
          id = parseInt(promptSync("Enter Order Number: "));
          if(id >= 1) {
            order = OrderController.find(id);
            if(order) {
              console.log(order);
              promptSync("Press enter key to continue...");
              break;
            }
            else {
              console.error("Order not found, please input again");
            }
          }
        }
        break;
      }

      case "5": {
        console.clear();
        console.log("exiting");
        await customerMenu();
        break;
      }
      default: {
        console.log("Invalid Input. Please Input again");
        break;
      }
    }
  }
}

async function searchProducts() {
  while (true) {
    console.log(`Search products...
(1) search By ID.
(2) search by product name
(3) search by product category
(4) exit`);

    var choice = promptSync("");
    switch (choice) {
      case "1":
        await searchByID();
        break;
      case "2":
        await searchbyname();
        break;
      case "3":
        await searchbycategory();
        break;
      case "4": {
        console.clear();
        console.log("exiting");
        await ownerMenu();
        break;
      }
      default:
        console.log("Invalid option.");
        await searchProducts();
    }
  }
}

async function searchByID() {
  console.clear();
  console.log("search by product ID");
  let productID:number;
  while(true) {
    productID = parseInt(promptSync("Enter the product ID: "));
    if(productID >= 1) break;
  }
  try {
    const results = await ProductController.find(productID);
    console.log(results);
  }
  catch(error) {
    console.error(error);
  }
}

async function searchbyname() {
  console.clear();
  console.log("search by product name");
  let name:string;
  while(true) {
    name = promptSync("Please enter a product name: ");
    if(name.length >= 1) break;
  }
  try {
    const results = await ProductController.findByName(name, auth?.id);
    console.log(results);
  }
  catch(error) {
    console.error(error);
  }
}

async function searchbycategory() {
  console.log("search by category");
  let category:string;
  while(true) {
    category = promptSync("Please enter category name: ");
    if(category.length >= 1) break;
  }
  try {
    const results = await ProductController.findByCategory(category, auth?.id);
    console.log(results);
  }
  catch(error) {
    console.error(error);
  }
}

async function managerefunds(id:number) {
  let sale:any;
  let products_of_sale:any;
  try {
    sale = await SaleController.find(id);
    sale = sale[0];
    await SaleController.update(sale.id, 'is_refunded', 1);
    products_of_sale = await new Promise((resolve, reject) => {
      sql.query(`SELECT * FROM sales_products WHERE sales_id=?`, [sale.id], function(error, result) {
        error ? reject(error) : resolve(result);
      });
    })
    for(let i = 0; i < products_of_sale.length; i++) {
      await ProductController.refund(products_of_sale[i].id, products_of_sale[i].quantity);
    }
    await new Promise((resolve, reject) => {
      sql.query(`DELETE FROM sales_products WHERE sales_id=?`, [sale.id], function(error, result) {
        error ? reject(error) : resolve(result);
      })
    })
    console.log('Refund processed successfully');
    promptSync("Press enter key to continue...");
  }
  catch(error) {
    console.error(error);
  }
}
async function showAllproducts() {
  console.clear();
  console.log("Showing all products...");
  let products = await ProductController.allByCustomer();
  console.log(products);
}
checkfinancialrecords();
export default role;  