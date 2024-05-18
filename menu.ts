import prompt from "prompt-sync";
import sql from "./db_config/config";
import User from "./models/User";
import bcrypt from "bcrypt";
import UserController from "./controllers/UserController";
import ProductController from "./controllers/ProductController";
import PromptSync from "prompt-sync";
// Define interfaces
// Define interfaces
var promptSync = prompt();
let auth:User | undefined;

// Define a function to handle user login
/*const handleLogin = (userInfo: User) => {
  const queryString = `SELECT * FROM users WHERE username = '${userInfo.username}' AND password = '${userInfo.password}'`;
  sql.query(queryString, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      if (results.length > 0) {
        auth = true;
        console.log("login successful");
      } else {
        console.log("login failed");
      }
    }
  });
};*/
// Simulated database of users

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
      Owner();
      break;
    }
    case "2": {
      console.clear();
      customerMenu();
      break;
    }
    case "0":
      process.exit();
    default: {
      console.clear();
      console.log("Invalid role selected.");
      role();
      break;
    }
  }
}
function Owner() {
  console.log("----Welcome To Online Pharmacy----");
  console.log(`1. Login.
2. Register.
3. Exit.`);

  const action = promptSync("Select an action : ");
  switch (action) {
    case "1": {
      console.clear();
      login();
      break;
    }
    case "2": {
      console.clear();
      register();
      break;
    }
    case "3": {
      console.clear();
      console.log("exiting");
      role();
    }
    default: {
      console.clear();
      console.log("Invalid option selected.");
      Owner();
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
  Owner();
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
(4) Manage Orders.
(5) Manage Sales.
(6) Check Inventory Levels.
(7) Supply order.
(8) Check Financial Records.
(9) generate receipt.
(10) Manage Refunds.
(11) LogOut.
(12) Exit System.`);

    var action = promptSync("Select an action : ");

    switch (action) {
      case "1": {
        console.clear();
        console.log("Accounts");
        accounts();
        break;
        // Implement Acounts logic
      }
      case "2": {
        console.clear();
        console.log("Search Products");
        searchProducts();
        break;
        // Implement Search Products logic
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
        console.log("Manage Orders");
        manageorders();
        break;
      }
      // Implement Manage Orders logic
      case "5": {
        console.clear();
        console.log("Manage Sales");
        managesales();
        // Implement Manage Sales logic
        break;
      }
      case "6": {
        console.clear();
        console.log("Check Inventory Levels");
        checkinventory();
        // Implement Check Inventory Levels logic
        break;
      }
      case "7": {
        console.clear();
        console.log("Suppply order");
        supplyorder();
        // Implement Suppply order logic
        break;
      }
      case "8": {
        console.clear();
        console.log("Check Financial Records");
        checkfinancialrecords();
        // Implement Check Financial Records logic
        break;
      }
      case "9": {
        console.clear();
        console.log("generate reciept");
        generatereciept();
        // Implement generate reciept logic
        break;
      }
      case "10": {
        console.clear();
        console.log("Manage Refunds");
        managerefunds();
        // Implement Manage Refunds logic
        break;
      }

      case "11": {
        console.clear();
        auth = undefined;
        console.log("Logging out");
        role();
        // Implement LogOut logic
        break;
      }
      case "12": {
        auth = undefined;
        console.log("Exiting System...");
        process.exit();
        // Implement Exit System logic
      }
      default: {
        console.clear();
        console.log("Invalid option.");
        ownerMenu();
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
    4. Apply Refund.
    5. Login.
    6. Register.
    7. exit menu.`);

      const action = promptSync("Select an action: ");
      switch (action) {
        case "1": {
          console.log("products...");
          showAllproducts();
          break;
        }
        case "2": {
          console.clear();
          console.log("Search Products");
          let name:string;
          let item:unknown;
          let string;
          while(true) {
            name = promptSync("Enter the name of the item: ");
            string = `%${name}$`;
            item = await new Promise((resolve, reject) => {
              sql.query(`SELECT *, products.id FROM products INNER JOIN categories ON products.category_id=categories.id WHERE products.name LIKE ?`, [name], function(error, results) {
                if(error) reject(error);
                resolve(results);
              })
            })
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
            Owner();
            break;
          } else {
            console.clear();
            console.log("ORDER");
            order();
            break;
          }
        }
        case "4": {
          console.clear();
          console.log("REFUNDING");
          refunds();
          break;
        }
        case "5": {
          console.clear();
          console.log("Login");
          login();
          break;
        }
        case "6": {
          console.clear();
          console.log("Register");
          register();
          break;
        }
        case "7": {
          console.clear();
          console.log("Exiting menu...");
          role();
          break;
        }
        default:
          console.log("Invalid option.");
          customerMenu();
      }
    }
  } else if (auth) {
    while (true) {
      console.log(`----welcome to Online Pharmacy---
      1. Browse Products.
      2. Search Products.
      3. Place Order.
      4. Apply Refund.
      5. Logout.
      6. exit menu.`);

      const action = promptSync("Select an action");
      switch (action) {
        case "1": {
          console.log("products...");
          showAllproducts();
          break;
        }
        case "2": {
          console.log("");
          // Implement search products logic
          searchproducts();
          break;
        }
        case "3": {
          console.clear();
          console.log("ORDER");
          order();
          break;
        }
        case "4": {
          console.clear();
          console.log("REFUNDING");
          refunds();
          break;
        }
        case "5": {
          console.clear();
          console.log("Logging out");
          auth = undefined;
          customerMenu();
          break;
        }
        case "6": {
          console.clear();
          console.log("Exiting menu...");
          role();
          break;
        }
        default:
          console.log("Invalid option.");
          customerMenu();
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
        register();
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
        ownerMenu();
        break;
      }
    }
  }
}
function manageorders() {
  console.clear();
  console.log("Manage Orders functionality");

  while (true) {
    console.log(`(1) Add an Order Record.
(2) Remove an Order Record.
(3) Edit an Order Record.
(4) View Order Records.
(5) Find an Order Record.
(6) exit.`);

    var choice = promptSync("Enter your choice: ");
    switch (choice) {
      case "1": {
        console.log("Add an Order");
        // Implement order management logic here
      }

      case "2": {
        console.log("Remove an Order");
        // Implement order management logic here
      }

      case "3": {
        console.log("Edit an Order");
        // Implement order management logic here
      }

      case "4": {
        console.log("View  Orders");
        // Implement order management logic here
      }

      case "5": {
        console.log("Find  Orders");
        // Implement order management logic here
      }

      case "6": {
        console.clear();
        console.log("Exiting ...");
        ownerMenu();
        break;
      }
    }
  }
}
function managesales() {
  console.log("Manage Sales functionality");
  while (true) {
    console.log(`(1) Add a Sale Record.
(2) Remove a Sale Record.
(3) Edit a Sale Record.
(4) View Sale Records.
(5) Find Sale Record.
(6) Exit.`);

    var choice = promptSync("Enter your choice: ");
    switch (choice) {
      case "1": {
        console.log("Add a Sale Record");
        // Implement sales management logic here
      }

      case "2": {
        console.log("Remove a Sale Record");
        // Implement sales management logic here
      }

      case "3": {
        console.log("Edit a Sale Record");
        // Implement sales management logic here
      }

      case "4": {
        console.log("View  Sale records");
        // Implement sales management logic here
      }

      case "5": {
        console.log("Find  Sale records");
        // Implement sales management logic here
      }
      case "6": {
        console.clear();
        console.log("Exiting ...");
        ownerMenu();
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
function supplyorder() {
  console.log("Supply Order functionality");

  while (true) {
    console.log(`(1) Add a Supply Order.
    (2) Remove a Supply Order.
    (3) Edit a Supply Order.
    (4) View Supply Orders .
    (6) Find supply Order Record.
    (5) Exit.`);

    var choice = promptSync("Enter your choice: ");
    switch (choice) {
      case "1": {
        console.log("Add a Supply Order");
        // Implement supply order logic here
      }
      case "2": {
        console.log("Remove a Supply Order");
        // Implement supply order logic here
      }
      case "3": {
        console.log("Edit a Supply Order");
        // Implement supply order logic here
      }
      case "4": {
        console.log("View Supply Orders");
        // Implement supply order logic here
      }
      case "5": {
        console.log("Find supply Order Record");
        // Implement supply order logic here
      }
      case "6": {
        console.clear();
        console.log("Exiting ...");
        ownerMenu();
        break;
      }
    }
  }
}
function checkfinancialrecords() {
  console.log("Check Financial Records functionality");
  while (true) {
    console.log(`(1) Check Monthly Profit.
(2) Check Yearly Profit.
(3) Check Monthly Expenditure.
(4) Check Yearly Expenditure.
(5) Check Total Sales Per Day.
(6) Check Total Sales Per Month.
(7) Exit.`);

    var choice = promptSync("");
    switch (choice) {
      case "1": {
        console.log("Check Monthly Profit");
        // Implement monthly profit checking logic here
        break;
      }
      case "2": {
        console.log("Check Yearly Profit");
        // Implement yearly profit checking logic here
        break;
      }
      case "3": {
        console.log("Check Monthly Expendature");
        // Implement monthly expendature checking logic here
        break;
      }
      case "4": {
        console.log("Check Yearly Expendature");
        // Implement yearly expendature checking logic here
        break;
      }
      case "5": {
        console.log("Check Total Sales Per Day");
        // Implement total sales per day checking logic here
        break;
      }
      case "6": {
        console.log("Check Total Sales Per Month");
        // Implement total sales per month checking logic here
        break;
      }
      case "7": {
        console.clear();
        console.log("Exiting..");
        customerMenu();
        break;
      }

      // Implement financial records checking logic here
    }
  }
}
function generatereciept() {
  var receipt = require("./receipt.js");
  console.log("Generate Receipt functionality");
  // Implement receipt generation logic here
}

// customer functions
function order() {
  let productlist = [];
  let quantitylist = [];
  while (true) {
    console.log(`(1) Add Order.
    (2) Remove Order.
    (3) Edit Order.
    (4) View Placed orders.
    (5) Find Order.
    (6) Exit.`);

    var action = promptSync("Enter Your Choice");
    switch (action) {
      case "1": {
        const name = promptSync("Enter your name: ");
        const address = promptSync("Enter your address: ");
        const contactinfo = promptSync("Enter your contact info: ");
        const productlist = promptSync("Enter the product names: ");
        const quantitylist = promptSync("Enter the quantities: ");

        // Implement order management logic here

        console.log("Order placed successfully!");
      }

      case "2": {
        if (productlist.length === 0) {
          console.log("No products to remove");
          break;
        }
        const product = promptSync("Enter the product name: ");
      }

      case "3": {
        if (productlist.length === 0) {
          console.log("No products to edit");
          break;
        }
        const product = promptSync("Enter the product name: ");
      }

      case "4": {
        if (productlist.length === 0) {
          console.log("No products to view");
          break;
        }
        //implementation
        break;
      }
      case "5": {
        //implementation
        break;
      }

      case "6": {
        console.clear();
        console.log("exiting");
        customerMenu();
        break;
      }
    }
  }
}

function searchProducts() {
  while (true) {
    console.log(`Search products...
(1) search By ID.
(2) search by product name
(3) search by product category
(4) exit`);

    var choice = promptSync("");
    switch (choice) {
      case "1":
        searchByID();
        break;
      case "2":
        searchbyname();
        break;
      case "3":
        searchbycategory();
        break;
      case "4": {
        console.clear();
        console.log("exiting");
        ownerMenu();
        break;
      }
      default:
        console.log("Invalid option.");
        searchproducts();
    }
    // Implement search products logic
  }
}
function searchproducts() {
  while (true) {
    console.log(`Search products...
  (1) search by product name
  (2) search by product category
  (3) exit`);

    var choice = promptSync("");
    switch (choice) {
      case "1":
        searchbyname();
        break;
      case "2":
        searchbycategory();
        break;
      case "3": {
        console.clear();
        console.log("exiting");
        customerMenu();
        break;
      }
      default:
        console.log("Invalid option.");
        searchproducts();
    }
    // Implement search products logic
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

function refunds() {
  const name = promptSync("Enter your name: ");
  const address = promptSync("Enter your address: ");
  const contactinfo = promptSync("Enter your contact info: ");
}
function managerefunds() {
  const name = promptSync("Enter your name: ");
  const address = promptSync("Enter your address: ");
  const contactinfo = promptSync("Enter your contact info: ");
}
function showAllproducts() {
  console.log("Showing all products...");
  // Implement logic to display all products here
}

// Start the login process
customerMenu();
export default role;  