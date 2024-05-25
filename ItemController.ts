import Item from "../models/Item";
import sql from "../db_config/config";

const ItemController = {
    all: (): Promise<Item[]> => {
        return Item.all();
    },
    find: (id: number): Promise<Item[]> => {
        return Item.find(id);
    },
    insert: (item_name: string, item_price: number, product_id: number): void => {
        let newItem = new Item(item_name, item_price, product_id);
        newItem.save();
    },
    update: async (id: number, attribute: string, value: unknown): Promise<void> => {
        await Item.update(id, attribute, value);
    },
    delete: (id: number): unknown => {
        return Item.delete(id);
    },
    findByName: async (item_name: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * 
                FROM items 
                WHERE item_name LIKE ?
            `;
            const formattedName = `%${item_name}%`;
            sql.query(query, [formattedName], function (error, results) {
                if (error) reject(error);
                resolve(results[0]);
            });
        })
    },
    findByCategory: async (category: string): Promise<Item[]> => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT items.* 
                FROM items 
                INNER JOIN products ON items.product_id = products.id 
                INNER JOIN categories ON products.category_id = categories.id 
                WHERE categories.category LIKE ?
            `;
            const string = `%${category}%`;
            sql.query(query, [string], function (error, results) {
                if (error) reject(error);
                resolve(results as Item[]);
            });
        })
    },
    allByAuth: async (id: number | undefined): Promise<Item[]> => {
        return new Promise((resolve, reject) => {
            sql.query(`SELECT * FROM items INNER JOIN products ON items.product_id = products.id WHERE products.user_id = ?`, [id], function (error, results) {
                if (error) reject(error);
                resolve(results);
            });
        })
    },
    customerSearch: async (item_name: string): Promise<any> => {
        let string = `%${item_name}%`;
        return new Promise((resolve, reject) => {
            sql.query(`SELECT * FROM items WHERE item_name LIKE ?`, [string], function (error, results) {
                if (error) reject(error);
                resolve(results[0]);
            });
        })
    },
    authSearch: async (id: number, user_id: unknown): Promise<Item> => {
        return new Promise((resolve, reject) => {
            sql.query(`SELECT * FROM items INNER JOIN products ON items.product_id = products.id WHERE items.id = ? AND products.user_id = ?`, [id, user_id], function (error, results) {
                if (error) reject(error);
                resolve(results);
            })
        })
    }
}

export default ItemController;
