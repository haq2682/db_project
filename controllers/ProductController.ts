import Product from "../models/Product";

const ProductController = {
    all: ():Promise<Product[]> => {
        return Product.all();
    },
    find: (id:number):Promise<Product[]> => {
        return Product.find(id);
    },
    insert: (name:string, unit_price:number, quantity:number, stock_status:string, category_id:number, user_id:number):void => {
        let newProduct = new Product(name, unit_price, quantity, stock_status, category_id, user_id);
        newProduct.save();
    },
    update: (id:number, attribute:string, value:unknown):void => {
        Product.update(id, attribute, value);
    },
    delete: (id:number):unknown => {
        return Product.delete(id);
    }
}

export default ProductController;