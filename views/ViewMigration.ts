import sql from "../db_config/config";

const ViewMigration = async () => {
    await new Promise(() => {
        sql.query(`
            CREATE VIEW daily_purchase AS
                SELECT
                    DATE(so.created_at) AS purchase_date,
                    so.id AS purchase_id,
                    i.item_name AS product,
                    soi.item_quantity AS quantity,
                    i.item_price AS item_price,
                    (soi.item_quantity * i.item_price) AS purchase_cost
                FROM
                    supplyOrders so
                    JOIN supplyOrders_items soi ON so.id = soi.supplyOrder_id
                    JOIN items i ON soi.item_id = i.id
                GROUP BY
                    DATE(so.created_at), so.id, i.item_name, soi.item_quantity, i.item_price;
        `);
        sql.query(`
            CREATE VIEW total_daily_purchase_cost AS
                SELECT
                    DATE(so.created_at) AS purchase_date,
                    SUM(soi.item_quantity * i.item_price) AS total_cost
                FROM
                    supplyOrders so
                    JOIN supplyOrders_items soi ON so.id = soi.supplyOrder_id
                    JOIN items i ON soi.item_id = i.id
                GROUP BY
                    DATE(so.created_at);
        `);
        sql.query(`
            CREATE VIEW total_monthly_purchase_cost AS
                SELECT
                    YEAR(so.created_at) AS purchase_year,
                    MONTH(so.created_at) AS purchase_month,
                    SUM(soi.item_quantity * i.item_price) AS total_cost
                FROM
                    supplyOrders so
                    JOIN supplyOrders_items soi ON so.id = soi.supplyOrder_id
                    JOIN items i ON soi.item_id = i.id
                GROUP BY
                    YEAR(so.created_at), MONTH(so.created_at);
        `);
        sql.query(`
            CREATE VIEW total_yearly_purchase_cost AS
                SELECT
                    YEAR(so.created_at) AS purchase_year,
                    SUM(soi.item_quantity * i.item_price) AS total_cost
                FROM
                    supplyOrders so
                    JOIN supplyOrders_items soi ON so.id = soi.supplyOrder_id
                    JOIN items i ON soi.item_id = i.id
                GROUP BY
                    YEAR(so.created_at);
        `);
        sql.query(`
            CREATE VIEW total_purchase_cost_between_dates AS
                SELECT
                    DATE(so.created_at) AS purchase_date,
                    SUM(soi.item_quantity * i.item_price) AS total_cost
                FROM
                    supplyOrders so
                    JOIN supplyOrders_items soi ON so.id = soi.supplyOrder_id
                    JOIN items i ON soi.item_id = i.id
                GROUP BY
                    DATE(so.created_at);
        `);
        sql.query(`
            CREATE VIEW total_daily_profit AS
                SELECT
                    DATE(s.created_at) AS sale_date,
                    SUM((sp.quantity_price - (sp.quantity * i.item_price))) AS total_profit
                FROM
                    sales s
                    JOIN sales_products sp ON s.id = sp.sales_id
                    JOIN items i ON sp.product_id = i.id
                GROUP BY
                    DATE(s.created_at);
        `);
        sql.query(`
            CREATE VIEW total_monthly_profit AS
                SELECT
                    YEAR(s.created_at) AS sale_year,
                    MONTH(s.created_at) AS sale_month,
                    SUM((sp.quantity_price - (sp.quantity * i.item_price))) AS total_profit
                FROM
                    sales s
                    JOIN sales_products sp ON s.id = sp.sales_id
                    JOIN items i ON sp.product_id = i.id
                GROUP BY
                    YEAR(s.created_at), MONTH(s.created_at);
        `);
        sql.query(`
            CREATE VIEW total_yearly_profit AS
                SELECT
                    YEAR(s.created_at) AS sale_year,
                    SUM((sp.quantity_price - (sp.quantity * i.item_price))) AS total_profit
                FROM
                    sales s
                    JOIN sales_products sp ON s.id = sp.sales_id
                    JOIN items i ON sp.product_id = i.id
                GROUP BY
                    YEAR(s.created_at);
        `);
        sql.query(`
            CREATE VIEW profit_between_specific_dates AS
                SELECT
                    DATE(s.created_at) AS sale_date,
                    SUM(sp.quantity_price - (sp.quantity * i.item_price)) AS total_profit
                FROM
                    sales s
                    JOIN sales_products sp ON s.id = sp.sales_id
                    JOIN items i ON sp.product_id = i.id
                GROUP BY
                    DATE(s.created_at);
        `);
        sql.query(`
            CREATE VIEW daily_profit AS
                SELECT
                    DATE(s.created_at) AS sale_date,
                    s.id AS sales_id,
                    p.name AS product,
                    sp.quantity AS quantity,
                    sp.quantity_price AS total_amount,
                    (sp.quantity_price - (sp.quantity * i.item_price)) AS total_profit
                FROM
                    sales s
                    JOIN sales_products sp ON s.id = sp.sales_id
                    JOIN products p ON sp.product_id = p.id
                    JOIN items i ON sp.product_id = i.id
                WHERE
                    s.created_at BETWEEN '2022-01-01' AND '2024-05-31'
                GROUP BY
                    DATE(s.created_at), s.id, p.name, sp.quantity, sp.quantity_price, i.item_price;
        `);
        sql.query(`
            CREATE VIEW total_daily_sales AS
                SELECT
                    DATE(s.created_at) AS sale_date,
                    SUM(s.total_amount) AS total_daily_sales
                FROM
                    sales s
                GROUP BY
                    DATE(s.created_at);
        `);
        sql.query(`
            CREATE VIEW daily_sales AS
                SELECT
                    DATE(s.created_at) AS sale_date,
                    s.id AS sale_id,
                    p.name AS product,
                    sp.unit_price AS price,
                    sp.quantity AS quantity,
                    sp.quantity_price AS total_amount
                FROM
                    sales s
                    JOIN sales_products sp ON s.id = sp.sales_id
                    JOIN products p ON sp.product_id = p.id
                GROUP BY
                    DATE(s.created_at), s.id, p.name, sp.unit_price, sp.quantity, sp.quantity_price;
        `);
        sql.query(`
            CREATE VIEW total_monthly_sales AS
                SELECT
                    YEAR(s.created_at) AS sale_year,
                    MONTH(s.created_at) AS sale_month,
                    SUM(s.total_amount) AS total_monthly_sales
                FROM
                    sales s
                GROUP BY
                    YEAR(s.created_at), MONTH(s.created_at);
        `);
        sql.query(`
            CREATE VIEW total_yearly_sales AS
                SELECT
                    YEAR(s.created_at) AS sale_year,
                    SUM(s.total_amount) AS total_yearly_sales
                FROM
                    sales s
                GROUP BY
                    YEAR(s.created_at);
        `);
        sql.query(`
            CREATE VIEW products_sold_on_specific_day AS
                SELECT
                    DATE(s.created_at) AS sale_date,
                    p.id AS product_id,
                    p.name AS product_name,
                    sp.quantity AS quantity_sold,
                    sp.unit_price AS unit_price,
                    sp.quantity_price AS total_price
                FROM
                    sales s
                    JOIN sales_products sp ON s.id = sp.sales_id
                    JOIN products p ON sp.product_id = p.id
        `);
        sql.query(`
            CREATE VIEW products_sold_between_specific_times AS
                SELECT
                    DATE(s.created_at) AS sale_date,
                    p.id AS product_id,
                    p.name AS product_name,
                    sp.quantity AS quantity_sold,
                    sp.unit_price AS unit_price,
                    sp.quantity_price AS total_price
                FROM
                    sales s
                    JOIN sales_products sp ON s.id = sp.sales_id
                    JOIN products p ON sp.product_id = p.id
        `);
        console.log("Views Added Successfully");
    });
}

ViewMigration();