import sql from "../db_config/config";

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
    
    public constructor(first_name:string, last_name:string, username:string, email:string, password:string, contact:string, address:string, role_id:number) {
        this.id = 0;
        this.first_name = first_name;
        this.last_name = last_name;
        this.username = username;
        this.password = password;
        this.contact = contact;
        this.address = address;
        this.email = email;
        this.role_id = role_id;
    }

    public save():unknown {
        sql.query('insert into users (first_name, last_name, username, email, password, contact, address, role_id) values (?,?,?,?,?,?,?,?)', [this.first_name, this.last_name, this.username, this.email, this.password, this.contact, this.address, this.role_id], function(error) {
            if(error) return error;
        });
        return;
    }

    public static async all():Promise<User[]> {
        return new Promise<User[]>((resolve, reject) => {
          sql.query(`select *, users.id from users inner join roles on users.role_id=roles.id order by users.id`, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results as User[]);
                }
            });
        });
    }

    public static async find(id:number):Promise<User[]> {
        return new Promise((resolve, reject) => {
            sql.query(`select *, users.id from users inner join roles on users.role_id=roles.id where users.id=?`, [id], (error, results) => {
                if(error) reject(error);
                else resolve(results as User[]);
            })
        })
    }

    public static update(id: number, attribute: string, value: unknown):unknown {
        const query = `UPDATE users SET ${attribute}=? WHERE id=?`;
        sql.query(query, [value, id], (error, results) => {
            if (error) return error;
        });
        return
    }
    
    public static delete(id:number):unknown {
        sql.query('delete from users where id=?', [id], function(error) {
            if(error) return error;
        });
        return;
    }
}

export default User;