import Sale from "../models/Sale";

const SaleController = {
    all: ():Promise<Sale[]> => {
        return Sale.all();
    },
    find: (id:number):Promise<Sale[]> => {
        return Sale.find(id);
    },
    insert: (user_id:number, total_amount:number):void => {
        let newSale = new Sale(user_id, total_amount);
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