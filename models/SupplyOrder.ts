import sql from "../db_config/config";
import User from "./User";
import Category from "./Category";

class SupplyOrder {
  public id: number;
  public user_id: number;
  public created_at: Date;
  public updated_at: Date;

  public constructor(id:number, user_id?: number) {
    this.id = id;
    this.user_id = user_id ?? 0;
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  public async save(): Promise<void> {
    try {
      await new Promise((resolve, reject) => {
        sql.query(
          "INSERT INTO supplyorders (id, user_id) VALUES (?, ?)",
          [this.id, this.user_id],
          function (error, results) {
            if (error) {
              console.error("Error saving supply order: ", error.sqlMessage);
              reject(error);
              return;
            }
            console.log("Supply order saved successfully");
            resolve(results);
          }
        );
      });
    } catch (error) {
      console.error(error);
    }
  }

  public static async all(): Promise<SupplyOrder[]> {
    return new Promise((resolve, reject) => {
      sql.query("SELECT * FROM supplyorders", (error, results) => {
        if (error) {
          console.error("Error fetching supply orders: ", error.sqlMessage);
          reject(error);
          return;
        }
        resolve(results as SupplyOrder[]);
      });
    });
  }

  public static async find(id: number): Promise<SupplyOrder[]> {
    return new Promise((resolve, reject) => {
      sql.query(
        "SELECT * FROM supplyorders WHERE id = ?",
        [id],
        (error, results) => {
          if (error) {
            console.error("Error fetching supply orders: ", error.sqlMessage);
            reject(error);
            return;
          }
          resolve(results as SupplyOrder[]);
        }
      );
    });
  }

  public static async update(
    id: number,
    attribute: string,
    value: unknown
  ): Promise<void> {
    const query = `UPDATE supplyorders SET ${attribute} = ? WHERE id = ?`;
    try {
      await new Promise((resolve, reject) => {
        sql.query(query, [value, id], (error, results) => {
          if (error) {
            console.error("Error during updating: ", error.sqlMessage);
            reject(error);
            return;
          }
          console.log("Update successful");
          resolve(results);
        });
      });
    } catch (error) {
      console.error(error);
    }
  }

  public static async delete(id: number): Promise<void> {
    try {
      await new Promise((resolve, reject) => {
        sql.query(
          "DELETE FROM supplyorders WHERE id = ?",
          [id],
          function (error, results) {
            if (error) {
              console.error("Error deleting the instance: ", error.sqlMessage);
              reject(error);
              return;
            }
            console.log("Deletion successful");
            resolve(results);
          }
        );
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export default SupplyOrder;
