import Sale from "../models/Sale";
import Faker from "../faker/faker";

const SaleController = {
    all: ():Promise<unknown> => {
        return Sale.all();
    },
    find: (id:number):Promise<unknown> => {
        return Sale.find(id);
    },
    insert: (user_id:number, total_amount:number):void => {
        let id = Faker.randomInteger(1, 999999999);
        let newSale = new Sale(id, user_id, total_amount);
        newSale.save();
    },
    update: (id:number, attribute:string, value:unknown):void => {
        Sale.update(id, attribute, value);
    },
    delete: (id:number):unknown => {
        return Sale.delete(id);
    }
}

export default SaleController;