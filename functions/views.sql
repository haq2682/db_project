
CREATE VIEW daily_purchase_cost AS
SELECT
    DATE(so.created_at) AS purchase_date,
    SUM(soi.item_quantity * i.item_price) AS daily_cost
FROM
    supply_orders so
JOIN
    supply_order_items soi ON so.id = soi.supplyOrderID
JOIN
    items i ON soi.itemID = i.id
GROUP BY
    DATE(so.created_at);


CREATE VIEW avg_daily_purchase_cost AS
SELECT
    DATE(so.created_at) AS purchase_date,
    AVG(soi.item_quantity * i.item_price) AS avg_cost
FROM
    supply_orders so
JOIN
    supply_order_items soi ON so.id = soi.supplyOrderID
JOIN
    items i ON soi.itemID = i.id
GROUP BY
    DATE(so.created_at);


CREATE VIEW avg_monthly_purchase_cost AS
SELECT
    YEAR(so.created_at) AS purchase_year,
    MONTH(so.created_at) AS purchase_month,
    AVG(soi.item_quantity * i.item_price) AS avg_cost
FROM
    supply_orders so
JOIN
    supply_order_items soi ON so.id = soi.supplyOrderID
JOIN
    items i ON soi.itemID = i.id
GROUP BY
    YEAR(so.created_at), MONTH(so.created_at);


CREATE VIEW avg_purchase_cost_between_dates AS
SELECT
    so.created_at AS purchase_date,
    AVG(soi.item_quantity * i.item_price) AS avg_cost
FROM
    supply_orders so
JOIN
    supply_order_items soi ON so.id = soi.supplyOrderID
JOIN
    items i ON soi.itemID = i.id
WHERE
    so.created_at BETWEEN '2023-01-01' AND '2023-12-31'
GROUP BY
    so.created_at;




CREATE VIEW avg_daily_profit AS
SELECT
    DATE(s.created_at) AS sale_date,
    AVG((sp.quantity_price - (soi.item_quantity * i.item_price))) AS avg_profit
FROM
    sales s
JOIN
    sales_products sp ON s.id = sp.sales_id
JOIN
    supply_order_items soi ON sp.product_id = soi.itemID
JOIN
    items i ON sp.product_id = i.id
GROUP BY
    DATE(s.created_at);


CREATE VIEW avg_monthly_profit AS
SELECT
    YEAR(s.created_at) AS sale_year,
    MONTH(s.created_at) AS sale_month,
    AVG((sp.quantity_price - (soi.item_quantity * i.item_price))) AS avg_profit
FROM
    sales s
JOIN
    sales_products sp ON s.id = sp.sales_id
JOIN
    supply_order_items soi ON sp.product_id = soi.itemID
JOIN
    items i ON sp.product_id = i.id
GROUP BY
    YEAR(s.created_at), MONTH(s.created_at);


CREATE VIEW profit_between_dates AS
SELECT
    s.created_at AS sale_date,
    SUM(sp.quantity_price - (soi.item_quantity * i.item_price)) AS total_profit
FROM
    sales s
JOIN
    sales_products sp ON s.id = sp.sales_id
JOIN
    supply_order_items soi ON sp.product_id = soi.itemID
JOIN
    items i ON sp.product_id = i.id
WHERE
    s.created_at BETWEEN '2023-01-01' AND '2023-12-31'
GROUP BY
    s.created_at;
    

CREATE VIEW avg_daily_sales AS
SELECT
    DATE(s.created_at) AS sale_date,
    AVG(s.total_amount) AS avg_daily_sales
FROM
    sales s
GROUP BY
    DATE(s.created_at);

CREATE VIEW monthly_sales AS
SELECT
    YEAR(s.created_at) AS sale_year,
    MONTH(s.created_at) AS sale_month,
    SUM(s.total_amount) AS monthly_sales
FROM
    sales s
GROUP BY
    YEAR(s.created_at), MONTH(s.created_at);


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
JOIN
    sales_products sp ON s.id = sp.sales_id
JOIN
    products p ON sp.product_id = p.id
WHERE
    DATE(s.created_at) = '2023-01-01'; -- Replace with your desired date
