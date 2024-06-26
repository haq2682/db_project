import Product from "../models/Product";
import sql from "../db_config/config";

const ProductController = {
    all: ():Promise<Product[]> => {
        return Product.all();
    },
    find: (id:number):Promise<Product[]> => {
        return Product.find(id);
    },
    insert: (name:string, unit_price:number, quantity:number, stock_status:string, category_id:number, user_id:number | undefined):void => {
        let newProduct = new Product(name, unit_price, quantity, stock_status, category_id, user_id);
        newProduct.save();
    },
    update: async (id:number, attribute:string, value:unknown):Promise<void> => {
        await Product.update(id, attribute, value);
    },
    delete: (id:number):unknown => {
        return Product.delete(id);
    },
    findByName: async (name:string, authID:unknown):Promise<any> => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT *, products.id 
                FROM products 
                INNER JOIN users ON products.user_id = users.id 
                INNER JOIN categories ON products.category_id = categories.id 
                WHERE users.id = ? AND products.name LIKE ?
            `;
            const formattedName = `%${name}%`;
            sql.query(query, [authID, formattedName], function (error, results) {
                if (error) reject(error);
                resolve(results[0]);
            });
        })
    },
    findByCategory: async (category:string, authID:unknown):Promise<Product[]> => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT *, products.id 
                FROM products 
                INNER JOIN users ON products.user_id = users.id 
                INNER JOIN categories ON products.category_id = categories.id 
                WHERE users.id = ? AND categories.category LIKE ?
            `;
            const string = `%${category}%`;
            sql.query(query, [authID, string], function(error, results) {
                if (error) reject(error);
                resolve(results as Product[]);
            });
        })
    },
    allByAuth: async (id:number | undefined):Promise<Product[]> => {
        return new Promise((resolve, reject) => {
            sql.query(`SELECT *, products.id FROM products INNER JOIN categories ON products.category_id=categories.id WHERE products.user_id=?`, [id], function(error, results) {
                if(error) reject(error);
                resolve(results);
            });
        })
    },
    allByCustomer: async ():Promise<Product[]> => {
        return new Promise((resolve, reject) => {
            sql.query(`SELECT name, unit_price, stock_status, categories.category FROM products INNER JOIN categories ON products.category_id=categories.id`, function(error, results) {
                if(error) reject(error);
                resolve(results);
            })
        })
    },
    customerSearch: async (name:string):Promise<any> => {
        let string = `%${name}%`;
        return new Promise((resolve, reject) => {
            sql.query(`SELECT *, products.id FROM products INNER JOIN categories ON products.category_id=categories.id WHERE products.name LIKE ?`, [string], function(error, results) {
                if(error) reject(error);
                resolve(results[0]);
            });
        })
    },
    authSearch: async (id:number, user_id:unknown):Promise<Product> => {
        return new Promise((resolve, reject) => {
            sql.query(`SELECT *, products.id FROM products INNER JOIN categories ON products.category_id=cateogires.id WHERE products.id=? AND products.user_id=?`, [id, user_id], function(error, results) {
                if(error) reject(error);
                resolve(results);
            })
        })
    },
    refund: async (id:number, quantity:number):Promise<void> => {
        await new Promise((resolve, reject) => {
            sql.query(`UPDATE products SET quantity=quantity+? WHERE products.id=?`, [quantity, id], function(error, results) {
                error ? reject(error) : resolve(results);
            })
        })
    }
}

export default ProductController;