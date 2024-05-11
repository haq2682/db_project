import Order from "../models/Order";

const OrderController = {
    all: ():Promise<unknown> => {
        return Order.all();
    },
    find: (id:number):Promise<unknown> => {
        return Order.find(id);
    },
    insert: (sales_id:number, user_id:number):void => {
        let newOrder = new Order(sales_id, user_id);
        newOrder.save();
    },
    update: (id:number, attribute:string, value:string):void => {
        Order.update(id, attribute, value);
    },
    delete: (id:number):unknown => {
        return Order.delete(id);
    }
}

export default OrderController;