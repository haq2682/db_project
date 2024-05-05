import User from "../models/User";

const UserController = {
    all: ():Promise<User[]> => {
        return User.all();
    },
    find: (id:number):Promise<User[]> => {
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
    }
}

export default UserController;