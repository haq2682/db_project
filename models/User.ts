import sql from "../db_config/config";
import Role from "./Role";

class User {
    public id:number;
    public first_name:string;
    public last_name:string;
    public username:string;
    public email:string;
    public password:string;
    public contact:string;
    public address:string;
    public role_id:number;
    public role:Role;
    public created_at:Date;
    public updated_at:Date;
    
    public constructor(first_name?: string, last_name?: string, username?: string, email?: string, password?: string, contact?: string, address?: string, role_id?: number) {
        this.id = 0;
        this.first_name = first_name ?? '';
        this.last_name = last_name ?? '';
        this.username = username ?? '';
        this.password = password ?? '';
        this.contact = contact ?? '';
        this.address = address ?? '';
        this.email = email ?? '';
        this.role_id = role_id ?? 0;
        this.role = new Role();
        this.created_at = new Date();
        this.updated_at = new Date();
    }

    public async save():Promise<void> {
        try {
            await new Promise(() => {
                sql.query('insert into users (first_name, last_name, username, email, password, contact, address, role_id) values (?,?,?,?,?,?,?,?)', [this.first_name, this.last_name, this.username, this.email, this.password, this.contact, this.address, this.role_id], function(error) {
                    if(error) {
                        console.error("Error saving user: ", error.sqlMessage);
                        return;
                    }
                    console.log("User saved successfully");
                });
            })
        }
        catch(error) {
            console.error(error);
        }
    }

    public static async all():Promise<User[]> {
        return new Promise((resolve) => {
            sql.query(`select *, users.id from users inner join roles on users.role_id=roles.id`, (error, results) => {
                if(error) {
                    console.error("Error fetching users: ", error.sqlMessage);
                    return;
                }
                else resolve(results as User[]);
            })
        })
    }

    public static async find(id:number):Promise<User[]> {
        return new Promise((resolve) => {
            sql.query(`select *, users.id from users where id=? inner join roles on users.role_id=roles.id`, [id], (error, results) => {
                if(error) {
                    console.error("Error fetching users: ", error.sqlMessage);
                    return;
                }
                else resolve(results as User[]);
            })
        })
    }

    public static async update(id: number, attribute: string, value: unknown):Promise<void> {
        const query = `UPDATE users SET ${attribute}=? WHERE id=?`;
        try {
            await new Promise((resolve) => {
                sql.query(query, [value, id], (error, results) => {
                    if (error) {
                        console.error("Error during updating: ", error.sqlMessage);
                        return;
                    }
                    console.log("Updation successful");
                    return resolve(results);
                });
            })
        }
        catch(error) {
            console.error(error);
        }
    }
    
    public static async delete(id:number):Promise<void> {
        try {
            await new Promise((resolve) => {
                sql.query('delete from users where id=?', [id], function(error, results) {
                    if(error) {
                        console.error("Error deleting the instance: ", error.sqlMessage);
                        return;
                    }
                    console.log("Deletion successful");
                    return resolve(results);
                });
            })
        }
        catch(error) {
            console.log(error);
        }
    }
}

export default User;