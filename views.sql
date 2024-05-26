-- View for daily purchase cost
CREATE VIEW daily_purchase_cost
AS
    SELECT
        DATE(so.created_at) AS purchase_date,
        SUM(soi.item_quantity * i.item_price) AS daily_cost
    FROM
        supplyOrders so
        JOIN supplyOrders_items soi ON so.id = soi.supplyOrder_id
        JOIN items i ON soi.item_id = i.id
    GROUP BY
        DATE(so.created_at);

-- View for total daily purchase cost
CREATE VIEW total_daily_purchase_cost
AS
    SELECT
        DATE(so.created_at) AS purchase_date,
        SUM(soi.item_quantity * i.item_price) AS total_cost
    FROM
        supplyOrders so
        JOIN supplyOrders_items soi ON so.id = soi.supplyOrder_id
        JOIN items i ON soi.item_id = i.id
    GROUP BY
        DATE(so.created_at);

-- View for total monthly purchase cost
CREATE VIEW total_monthly_purchase_cost
AS
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

-- View for total purchase cost between specific dates
CREATE VIEW total_purchase_cost_between_dates
AS
    SELECT
        so.created_at AS purchase_date,
        SUM(soi.item_quantity * i.item_price) AS total_cost
    FROM
        supplyOrders so
        JOIN supplyOrders_items soi ON so.id = soi.supplyOrder_id
        JOIN items i ON soi.item_id = i.id
    WHERE
        so.created_at BETWEEN '2023-01-01' AND '2023-12-31'
    GROUP BY
        so.created_at;

-- View for total daily profit
CREATE VIEW total_daily_profit
AS
    SELECT
        DATE(s.created_at) AS sale_date,
        SUM((sp.quantity_price - (soi.item_quantity * i.item_price))) AS total_profit
    FROM
        sales s
        JOIN sales_products sp ON s.id = sp.sales_id
        JOIN supplyOrders_items soi ON sp.product_id = soi.item_id
        JOIN items i ON sp.product_id = i.id
    GROUP BY
        DATE(s.created_at);

-- View for total monthly profit
CREATE VIEW total_monthly_profit
AS
    SELECT
        YEAR(s.created_at) AS sale_year,
        MONTH(s.created_at) AS sale_month,
        SUM((sp.quantity_price - (soi.item_quantity * i.item_price))) AS total_profit
    FROM
        sales s
        JOIN sales_products sp ON s.id = sp.sales_id
        JOIN supplyOrders_items soi ON sp.product_id = soi.item_id
        JOIN items i ON sp.product_id = i.id
    GROUP BY
        YEAR(s.created_at), MONTH(s.created_at);

-- View for total yearly profit
CREATE VIEW total_yearly_profit
AS
    SELECT
        YEAR(s.created_at) AS sale_year,
        SUM((sp.quantity_price - (soi.item_quantity * i.item_price))) AS total_profit
    FROM
        sales s
        JOIN sales_products sp ON s.id = sp.sales_id
        JOIN supplyOrders_items soi ON sp.product_id = soi.item_id
        JOIN items i ON sp.product_id = i.id
    GROUP BY
        YEAR(s.created_at);

-- View for profit between specific dates
CREATE VIEW profit_between_specific_dates
AS
    SELECT
        DATE(s.created_at) AS sale_date,
        SUM(sp.quantity_price - (soi.item_quantity * i.item_price)) AS total_profit
    FROM
        sales s
        JOIN sales_products sp ON s.id = sp.sales_id
        JOIN supplyOrders_items soi ON sp.product_id = soi.item_id
        JOIN items i ON sp.product_id = i.id
    WHERE
        s.created_at BETWEEN '2023-01-01 00:00:00' AND '2023-12-31 23:59:59'
    GROUP BY
        DATE(s.created_at);

-- View for total daily sales
CREATE VIEW total_daily_sales
AS
    SELECT
        DATE(s.created_at) AS sale_date,
        SUM(s.total_amount) AS total_daily_sales
    FROM
        sales s
    GROUP BY
        DATE(s.created_at);

-- View for total monthly sales
CREATE VIEW total_monthly_sales
AS
    SELECT
        YEAR(s.created_at) AS sale_year,
        MONTH(s.created_at) AS sale_month,
        SUM(s.total_amount) AS total_monthly_sales
    FROM
        sales s
    GROUP BY
        YEAR(s.created_at), MONTH(s.created_at);

-- View for total yearly sales
CREATE VIEW total_yearly_sales
AS
    SELECT
        YEAR(s.created_at) AS sale_year,
        SUM(s.total_amount) AS total_yearly_sales
    FROM
        sales s
    GROUP BY
        YEAR(s.created_at);

-- View for products sold on a specific day
CREATE VIEW products_sold_on_specific_day
AS
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
    WHERE
        DATE(s.created_at) = '2023-01-01';  -- Replace with your desired date

-- View for products sold between specific times
CREATE VIEW products_sold_between_specific_times
AS
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
    WHERE
        s.created_at BETWEEN '2023-01-01 00:00:00' AND '2023-01-01 23:59:59';  -- Replace with your desired time range
