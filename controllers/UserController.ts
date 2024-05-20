import User from "../models/User";
import sql from "../db_config/config";

const UserController = {
    all: ():Promise<User[]> => {
        return User.all();
    },
    find: (id:number):Promise<User> => {
        return User.find(id);
    },
    insert: (first_name:string, last_name:string, username:string, email:string, password:string, contact:string, address:string, role_id:number):void => {
        let newUser = new User(first_name, last_name, username, email, password, contact, address, role_id);
        newUser.save();
    },
    update: (id:number, attribute:string, value:unknown):void => {
        User.update(id, attribute, value);
    },
    delete: (id:number):unknown => {
        return User.delete(id);
    },
    checkUsername: async (username:string):Promise<boolean> => {
        return new Promise((resolve) => {
            sql.query(`SELECT username FROM users WHERE username=?`, [username], function(error, results) {
                if(results.length > 0) resolve(false);
                else resolve(true);
            })
        });
    },
    findByUsername: async (username:string):Promise<User> => {
        return new Promise((resolve, reject) => {
            sql.query(`SELECT * FROM users INNER JOIN roles on users.role_id=roles.id WHERE INNER JOIN orders ON orders.user_id=users.id INNER JOIN sales ON sales.user_id=users.id username=?`, [username], function(error, results) {
                if(error) reject(error);
                else resolve(results[0] as User);
            });
        });
    },
    deleteByUsername: async (username:string):Promise<void> => {
        return new Promise((resolve, reject) => {
            sql.query(`DELETE FROM users WHERE username=?`, [username], function(error, results) {
                if(error) reject(error);
                resolve(results);
            })
        })
    },
    updateByUsername: async (attribute:string, value:string, username:string):Promise<void> => {
        return new Promise((resolve, reject) => {
            sql.query(`UPDATE users SET ${attribute}=? WHERE username=?`, [value, username], function(error, results) {
                if(error) reject(error);
                resolve(results);
            })
        });
    },
    allCustomers: async ():Promise<User[]> => {
        return new Promise((resolve, reject) => {
            sql.query(`SELECT * FROM users INNER JOIN orders ON orders.user_id=users.id INNER JOIN sales ON sales.user_id=users.id WHERE role_id = 2`, function(error, results) {
                if(results.length <= 0) reject("No customers found");
                resolve(results as User[]);
            });
        });
    },
    findOwner: async (id:number):Promise<User> => {
        return new Promise((resolve, reject) => {
            sql.query(`SELECT *, users.id FROM users INNER JOIN roles ON users.role_id=roles.id WHERE roles.role='owner' AND users.id=?`, [id], function(error, results) {
                if(error) reject(error);
                resolve(results[0] as User);
            })
        })
    },
    findCustomer: async (id:number):Promise<User> => {
        return new Promise((resolve, reject) => {
            sql.query(`SELECT *, users.id FROM users INNER JOIN roles ON users.role_id=roles.id WHERE roles.role='customer' AND users.id=?`, [id], function(error, results) {
                if(error) reject(error);
                resolve(results[0] as User);
            })
        })
    }
}

export default UserController;