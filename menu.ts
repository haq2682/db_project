import prompt from "prompt-sync";
// Define interfaces
// Define interfaces
interface User {
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  password: string;
}

interface Customer {
  name: string;
  address: string;
  contactinfo: number;
}

// Simulated database of users
const users: User[] = [
  {
    firstname: "fahad",
    lastname: "sohail",
    email: "fahad133@g,ail.com",
    username: "owner1",
    password: "password1",
  },
  {
    firstname: "abdul",
    lastname: "haq",
    email: "fahad133@g,ail.com",
    username: "owner2",
    password: "password2",
  },
];

// Function to handle user login
async function role() {
  const promptSync = prompt();
  console.log(`----ONLINE PHARMACY----
  (1) owner
  (2) Customer
  (3) Exit`);
  var r = promptSync("Select your role: ");
  switch (r) {
    case "1":
      login();
      break;
    case "2":
      customerMenu();
      break;
    case "3":
      process.exit();
    default: {
      console.log("Invalid role selected.");
      role();
      break;
    }
  }
}
function login() {
  const promptSync = prompt();
  const username = promptSync("Enter your username: ");
  const password = promptSync("Enter your password: ", { echo: "*" });

  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    console.log("Invalid username or password.");
    return;
  } else {
    console.log(`Welcome, ${user.username}!`);
    ownerMenu();
  }
}

// Owner menu
function ownerMenu() {
  const promptSync = prompt();
  while (true) {
    console.log(`(1) Acounts.
(2) Search Products.
(3) Manage Orders.
(4) Manage Sales.
(5) Check Inventory Levels.
(6) Suppply order.
(7) Check Financial Records.
(8) generate reciept.
(9) Manage Refunds.
(10) LogOut.
(11) Exit System.`);

    var action = promptSync("Select an action : ");

    switch (action) {
      case "1": {
        console.log("Acounts");
        accounts();
        break;
        // Implement Acounts logic
      }
      case "2": {
        console.log("Search Products");
        searchProducts();
        break;
        // Implement Search Products logic
      }
      case "3": {
        console.log("Manage Orders");
        manageorders();
        break;
      }
      // Implement Manage Orders logic
      case "4": {
        console.log("Manage Sales");
        managesales();
        // Implement Manage Sales logic
        break;
      }
      case "5": {
        console.log("Check Inventory Levels");
        checkinventory();
        // Implement Check Inventory Levels logic
        break;
      }
      case "6": {
        console.log("Suppply order");
        supplyorder();
        // Implement Suppply order logic
        break;
      }
      case "7": {
        console.log("Check Financial Records");
        checkfinancialrecords();
        // Implement Check Financial Records logic
        break;
      }
      case "8": {
        console.log("generate reciept");
        generatereciept();
        // Implement generate reciept logic
        break;
      }
      case "9": {
        console.log("Manage Refunds");
        managerefunds();
        // Implement Manage Refunds logic
        break;
      }

      case "10": {
        console.log("LogOut");
        role();
        // Implement LogOut logic
        break;
      }
      case "11": {
        console.log("Exiting System...");
        process.exit();
        // Implement Exit System logic
      }
      default: {
        console.log("Invalid option.");
        // Implement default logic
        break;
      }
    }
  }
}

// Customer menu
function customerMenu() {
  const promptSync = prompt();
  while (true) {
    console.log(`----welcome to Online Pharmacy---
    1. Browse Products.
    2. Search Products.
    3. Place Order.
    4. Apply Refund.
    5. exit menu.`);

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
        console.log("ORDER");
        order();
        break;
      }
      case "4": {
        console.log("REFUNDING");
        refunds();
        break;
      }
      case "5": {
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
function accounts() {
  console.log("Accounts functionality");
  const promptSync = prompt();
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
        console.log("Add an Account");
        // Implement account management logic here
      }

      case "2": {
        console.log("Remove an Account");
        // Implement account management logic here
      }

      case "3": {
        console.log("Edit an Account");
        // Implement account management logic here
      }

      case "4": {
        console.log("View  Accounts");
        // Implement account management logic here
      }

      case "5": {
        console.log("Find  Accounts");
        // Implement account management logic here
      }

      case "6": {
        console.log("Exiting ...");
        ownerMenu();
        break;
      }
    }
  }
}
function manageorders() {
  console.log("Manage Orders functionality");
  const promptSync = prompt();
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
        console.log("Exiting ...");
        ownerMenu();
        break;
      }
    }
  }
}
function managesales() {
  const promptSync = prompt();
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
        console.log("Exiting ...");
        ownerMenu();
        break;
      }
    }
  }
}

function checkinventory() {
  console.log("Check Inventory Levels functionality");

  // Implement inventory checking logic here
}
function supplyorder() {
  console.log("Supply Order functionality");
  const promptSync = prompt();
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
        console.log("Exiting ...");
        ownerMenu();
        break;
      }
    }
  }
}
function checkfinancialrecords() {
  const promptSync = prompt();
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
        console.log("exiting");
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
  const promptSync = prompt();

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
        console.log("exiting");
        customerMenu();
        break;
      }
    }
  }
}

function searchProducts() {
  const promptSync = prompt();
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
function searchproducts() {
  const promptSync = prompt();
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

function searchByID() {
  console.log("search by product ID");
  const promptSync = prompt();
  const productID = promptSync("Enter the product ID: ");
  // Implement search products logic
}

function searchbyname() {
  console.log("search by product name");
  const promptSync = prompt();
  const productName = promptSync("Please enter a product name: ");
  // Implement search products logic
}

function searchbycategory() {
  console.log("search by category");
  const promptSync = prompt();
  const catagoryChoice = promptSync("Enter the catagory");
}

function refunds() {
  const promptSync = prompt();
  const name = promptSync("Enter your name: ");
  const address = promptSync("Enter your address: ");
  const contactinfo = promptSync("Enter your contact info: ");
}
function managerefunds() {
  const promptSync = prompt();
}
function showAllproducts() {
  console.log("Showing all products...");
  // Implement logic to display all products here
}

// Start the login process
role();
