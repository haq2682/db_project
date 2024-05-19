
-----USER PROCEDURES------
DELIMITER //

CREATE PROCEDURE view_users()
BEGIN
    SELECT * FROM users;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE FIND_USER_BYNAME(
    IN user_name VARCHAR(50)
)
BEGIN
    SELECT * FROM `user` WHERE username = user_name;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE update_user(
    IN user_id INT,
    IN first_name_param VARCHAR(15),
    IN last_name_param VARCHAR(15),
    IN username_param VARCHAR(20),
    IN email_param VARCHAR(30),
    IN password_param VARCHAR(255),
    IN contact_param VARCHAR(15),
    IN address_param VARCHAR(255),
    IN role_id_param INT
)
BEGIN
    UPDATE users
    SET 
        first_name = first_name_param,
        last_name = last_name_param,
        username = username_param,
        email = email_param,
        password = password_param,
        contact = contact_param,
        address = address_param,
        role_id = role_id_param,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = user_id;
END//

DELIMITER ;


DELIMITER //

CREATE PROCEDURE delete_user(
     IN user_id INT
)
BEGIN
    DELETE FROM users WHERE id = user_id;
END //
DELIMITER ;


DELIMITER //

CREATE PROCEDURE insert_user(
    IN first_name_param VARCHAR(15),
    IN last_name_param VARCHAR(15),
    IN username_param VARCHAR(20),
    IN email_param VARCHAR(30),
    IN password_param VARCHAR(255),
    IN contact_param VARCHAR(15),
    IN address_param VARCHAR(255),
    IN role_id_param INT
)
BEGIN
    INSERT INTO users (first_name, last_name, username, email, password, contact, address, role_id)
    VALUES (first_name_param, last_name_param, username_param, email_param, password_param, contact_param, address_param, role_id_param);
END //

DELIMITER ;

-----login procedure-----

DELIMITER //

CREATE PROCEDURE LoginUser(IN username VARCHAR(255), IN password VARCHAR(255), OUT result INT)
BEGIN
    DECLARE user_count INT;

    -- Check if the username and password match
    SELECT COUNT(*) INTO user_count
    FROM users
    WHERE username = username AND password = password;

    IF user_count = 1 THEN
        -- Username and password match
        SET result = 1;
    ELSE
        -- Username and password do not match
        SET result = 0;
    END IF;
END //

DELIMITER ;


------------------------------------------------------------

------product procedures-------

-- Create Procedure: Create a new product
DELIMITER //

CREATE PROCEDURE add_product(
    IN name_param VARCHAR(50),
    IN unit_price_param FLOAT,
    IN quantity_param INT,
    IN category_id_param INT,
    IN user_id_param INT
)
BEGIN
    INSERT INTO products (name, unit_price, quantity, category_id, user_id)
    VALUES (name_param, unit_price_param, quantity_param, category_id_param, user_id_param);
END //

DELIMITER ;

-- Read Procedure: Get product by id
DELIMITER //

CREATE PROCEDURE get_product(
    IN product_id_param INT
)
BEGIN
    SELECT * FROM products WHERE id = product_id_param;
END //

DELIMITER ;

-- Update Procedure: Update product information
DELIMITER //

CREATE PROCEDURE update_product(
    IN product_id_param INT,
    IN name_param VARCHAR(50),
    IN unit_price_param FLOAT,
    IN quantity_param INT,
    IN category_id_param INT,
    IN user_id_param INT
)
BEGIN
    UPDATE products
    SET name = name_param,
        unit_price = unit_price_param,
        quantity = quantity_param,
        category_id = category_id_param,
        user_id = user_id_param,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = product_id_param;
END //

DELIMITER ;

-- Delete Procedure: Delete product by id
DELIMITER //

CREATE PROCEDURE delete_product(
    IN product_id_param INT
)
BEGIN
    DELETE FROM products WHERE id = product_id_param;
END //

DELIMITER ;


----------------------------------------------
---------------sales procedures---------------


-- Create Procedure: Create a new sale
DELIMITER //

CREATE PROCEDURE add_sale(
    IN user_id_param INT,
    IN total_amount_param FLOAT
)
BEGIN
    INSERT INTO sales (user_id, total_amount)
    VALUES (user_id_param, total_amount_param);
END //

DELIMITER ;

-- Read Procedure: Get sale by id
DELIMITER //

CREATE PROCEDURE get_sale(
    IN sale_id_param INT
)
BEGIN
    SELECT * FROM sales WHERE id = sale_id_param;
END //

DELIMITER ;

-- Update Procedure: Update sale information
DELIMITER //

CREATE PROCEDURE update_sale(
    IN sale_id_param INT,
    IN user_id_param INT,
    IN total_amount_param FLOAT
)
BEGIN
    UPDATE sales
    SET user_id = user_id_param,
        total_amount = total_amount_param,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = sale_id_param;
END //

DELIMITER ;

-- Delete Procedure: Delete sale by id
DELIMITER //

CREATE PROCEDURE delete_sale(
    IN sale_id_param INT
)
BEGIN
    DELETE FROM sales WHERE id = sale_id_param;
END //

DELIMITER ;


------------------------------------
------------sale_product procedures--------------
-- Create Procedure: Create a new sales product
DELIMITER //

CREATE PROCEDURE create_sales_product(
    IN sales_id_param INT,
    IN product_id_param INT,
    IN quantity_param INT,
    IN unit_price_param INT,
    IN quantity_price_param INT
)
BEGIN
    INSERT INTO sales_products (sales_id, product_id, quantity, unit_price, quantity_price)
    VALUES (sales_id_param, product_id_param, quantity_param, unit_price_param, quantity_price_param);
END //

DELIMITER ;

-- Read Procedure: Get sales product by id
DELIMITER //

CREATE PROCEDURE get_sales_product(
    IN sales_product_id_param INT
)
BEGIN
    SELECT * FROM sales_products WHERE id = sales_product_id_param;
END //

DELIMITER ;

-- Update Procedure: Update sales product information
DELIMITER //

CREATE PROCEDURE update_sales_product(
    IN sales_product_id_param INT,
    IN sales_id_param INT,
    IN product_id_param INT,
    IN quantity_param INT,
    IN unit_price_param INT,
    IN quantity_price_param INT
)
BEGIN
    UPDATE sales_products
    SET sales_id = sales_id_param,
        product_id = product_id_param,
        quantity = quantity_param,
        unit_price = unit_price_param,
        quantity_price = quantity_price_param,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = sales_product_id_param;
END //

DELIMITER ;

-- Delete Procedure: Delete sales product by id
DELIMITER //

CREATE PROCEDURE delete_sales_product(
    IN sales_product_id_param INT
)
BEGIN
    DELETE FROM sales_products WHERE id = sales_product_id_param;
END //

DELIMITER ;


------------------------------------------------
---------------------orders proceudres----------

-- Create Procedure: Create a new order
DELIMITER //

CREATE PROCEDURE create_order(
    IN order_id_param INT,
    IN sales_id_param INT,
    IN user_id_param INT,
    IN delivery_status_param VARCHAR(30),
    IN is_cancelled_param TINYINT
)
BEGIN
    INSERT INTO orders (id, sales_id, user_id, delivery_status, is_cancelled)
    VALUES (order_id_param, sales_id_param, user_id_param, delivery_status_param, is_cancelled_param);
END //

DELIMITER ;

-- Read Procedure: Get order by id
DELIMITER //

CREATE PROCEDURE get_order(
    IN order_id_param INT
)
BEGIN
    SELECT * FROM orders WHERE id = order_id_param;
END //

DELIMITER ;

-- Update Procedure: Update order information
DELIMITER //

CREATE PROCEDURE update_order(
    IN order_id_param INT,
    IN sales_id_param INT,
    IN user_id_param INT,
    IN delivery_status_param VARCHAR(30),
    IN is_cancelled_param TINYINT
)
BEGIN
    UPDATE orders
    SET 
        sales_id = sales_id_param,
        user_id = user_id_param,
        delivery_status = delivery_status_param,
        is_cancelled = is_cancelled_param,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = order_id_param;
END //

DELIMITER ;

-- Delete Procedure: Delete order by id
DELIMITER //

CREATE PROCEDURE delete_order(
    IN order_id_param INT
)
BEGIN
    DELETE FROM orders WHERE id = order_id_param;
END //

DELIMITER ;


------------------------------------------------------
-----------------supply orders procedures---------------

-- Create Procedure: Create a new supply order
DELIMITER //

CREATE PROCEDURE create_supply_order(
    IN user_id_param INT,
    IN product_id_param INT,
    IN product_quantity_param INT
)
BEGIN
    INSERT INTO supply_orders (user_id, product_id, product_quantity)
    VALUES (user_id_param, product_id_param, product_quantity_param);
END //

DELIMITER ;

-- Read Procedure: Get supply order by id
DELIMITER //

CREATE PROCEDURE get_supply_order(
    IN supply_order_id_param INT
)
BEGIN
    SELECT * FROM supply_orders WHERE id = supply_order_id_param;
END //

DELIMITER ;

-- Update Procedure: Update supply order information
DELIMITER //

CREATE PROCEDURE update_supply_order(
    IN supply_order_id_param INT,
    IN user_id_param INT,
    IN product_id_param INT,
    IN product_quantity_param INT
)
BEGIN
    UPDATE supply_orders
    SET user_id = user_id_param,
        product_id = product_id_param,
        product_quantity = product_quantity_param,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = supply_order_id_param;
END //

DELIMITER ;

-- Delete Procedure: Delete supply order by id
DELIMITER //

CREATE PROCEDURE delete_supply_order(
    IN supply_order_id_param INT
)
BEGIN
    DELETE FROM supply_orders WHERE id = supply_order_id_param;
END //

DELIMITER ;


-------------------------------------------
-------------product supply procedures-----------------

-- Create Procedure: Create a new product supply
DELIMITER //

CREATE PROCEDURE create_product_supply(
    IN supply_order_id_param INT,
    IN product_id_param INT,
    IN product_quantity_param INT
)
BEGIN
    INSERT INTO product_supply (supplyOrderID, productID, product_quantity)
    VALUES (supply_order_id_param, product_id_param, product_quantity_param);
END //

DELIMITER ;

-- Read Procedure: Get product supply by id
DELIMITER //

CREATE PROCEDURE get_product_supply(
    IN product_supply_id_param INT
)
BEGIN
    SELECT * FROM product_supply WHERE id = product_supply_id_param;
END //

DELIMITER ;

-- Update Procedure: Update product supply information
DELIMITER //

CREATE PROCEDURE update_product_supply(
    IN product_supply_id_param INT,
    IN supply_order_id_param INT,
    IN product_id_param INT,
    IN product_quantity_param INT
)
BEGIN
    UPDATE product_supply
    SET 
        supplyOrderID = supply_order_id_param,
        productID = product_id_param,
        product_quantity = product_quantity_param,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = product_supply_id_param;
END //

DELIMITER ;

-- Delete Procedure: Delete product supply by id
DELIMITER //

CREATE PROCEDURE delete_product_supply(
    IN product_supply_id_param INT
)
BEGIN
    DELETE FROM product_supply WHERE id = product_supply_id_param;
END //

DELIMITER ;













