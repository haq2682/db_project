
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
    SELECT * FROM `users` WHERE username = user_name;
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
    DELETE FROM orders WHERE user_id = user_id;
    DELETE FROM sales_products WHERE sales_id IN (SELECT id FROM sales WHERE user_id = user_id);
    DELETE FROM sales WHERE user_id = user_id;
    DELETE FROM products WHERE user_id = user_id;
     DELETE FROM supplyOrders_items WHERE supplyOrder_id IN (SELECT id FROM supplyOrders WHERE user_id = user_id);
    DELETE FROM supplyOrders WHERE user_id = user_id;
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
    DECLARE match INT;

    -- Check if the username and password match
    SELECT id INTO match
    FROM users
    WHERE username = username AND password = password;

    IF match is not null THEN
        -- Username and password match
        SET result = 1;
    ELSE
        -- Username and password do not match
        SET result = 0;
    END IF;
END //

DELIMITER ;



DELIMITER //

CREATE PROCEDURE add_order_byID(
    IN p_user_id INT,
    IN p_product_ids VARCHAR(255), 
    IN p_quantities VARCHAR(255), 
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE v_total_amount FLOAT DEFAULT 0;
    DECLARE v_sales_id INT;
    DECLARE v_product_id INT;
    DECLARE v_quantity INT;
    DECLARE v_unit_price FLOAT;
    DECLARE v_quantity_price FLOAT;
    DECLARE v_product_index INT DEFAULT 1;
    DECLARE v_num_products INT;
    DECLARE v_current_quantity INT;
    DECLARE v_stock_message VARCHAR(255);

    -- Determine the number of products in the order
    SET v_num_products = (LENGTH(p_product_ids) - LENGTH(REPLACE(p_product_ids, ',', ''))) / LENGTH(',') + 1;

    -- Insert a new sales record
    INSERT INTO sales (user_id, total_amount, is_refunded) 
    VALUES (p_user_id, 0, 0);

    -- Get the last inserted sales ID
    SET v_sales_id = LAST_INSERT_ID();

    -- Loop through each product in the order
    WHILE v_product_index <= v_num_products DO
        -- Extract product details
        SET v_product_id = CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(p_product_ids, ',', v_product_index), ',', -1) AS UNSIGNED);
        SET v_quantity = CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(p_quantities, ',', v_product_index), ',', -1) AS UNSIGNED);

        -- Retrieve unit price for the product
        SELECT unit_price INTO v_unit_price
        FROM products
        WHERE id = v_product_id;

        -- Calculate total price for the product
        SET v_quantity_price = v_quantity * v_unit_price;

        -- Update the total amount for the sales
        SET v_total_amount = v_total_amount + v_quantity_price;

        -- Insert into sales_products table
        INSERT INTO sales_products (sales_id, product_id, quantity, unit_price, quantity_price) 
        VALUES (v_sales_id, v_product_id, v_quantity, v_unit_price, v_quantity_price);

        -- Update product quantity in the products table
        SELECT quantity INTO v_current_quantity
        FROM products
        WHERE id = v_product_id;

        IF (v_current_quantity - v_quantity) <= 0 THEN
            UPDATE products
            SET quantity = 0,
                stock_status = 'Out of Stock',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = v_product_id;
            SET v_stock_message = CONCAT('Product "', (SELECT name FROM products WHERE id = v_product_id), '" is out of stock. ');
            SET p_message = CONCAT(p_message, v_stock_message);
        ELSE
            UPDATE products
            SET quantity = v_current_quantity - v_quantity,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = v_product_id;
        END IF;

        SET v_product_index = v_product_index + 1;
    END WHILE;

    -- Update the total amount in the sales table
    UPDATE sales
    SET total_amount = v_total_amount,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = v_sales_id;

    -- Insert a new order
    INSERT INTO orders (sales_id, user_id, delivery_status, is_cancelled) 
    VALUES (v_sales_id, p_user_id,'is delivered',0);

    SET p_message = CONCAT(p_message, 'Order created successfully');
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE add_order_byName(
    IN p_user_id INT,
    IN p_product_names VARCHAR(255), 
    IN p_quantities VARCHAR(255),
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE v_total_amount FLOAT DEFAULT 0;
    DECLARE v_sales_id INT;
    DECLARE v_product_id INT;
    DECLARE v_quantity INT;
    DECLARE v_unit_price FLOAT;
    DECLARE v_quantity_price FLOAT;
    DECLARE v_product_index INT DEFAULT 1;
    DECLARE v_num_products INT;
    DECLARE v_current_quantity INT;
    DECLARE v_product_name VARCHAR(255);
    DECLARE v_stock_message VARCHAR(255);
    DECLARE v_product_exists INT;

    -- Initialize the output message
    SET p_message = '';

    -- Determine the number of products in the order
    SET v_num_products = (LENGTH(p_product_names) - LENGTH(REPLACE(p_product_names, ',', ''))) / LENGTH(',') + 1;

    -- Loop through each product to check if it exists
    WHILE v_product_index <= v_num_products DO
        -- Extract product details
        SET v_product_name = SUBSTRING_INDEX(SUBSTRING_INDEX(p_product_names, ',', v_product_index), ',', -1);

        -- Check if the product exists
        SELECT count(*) INTO v_product_exists
        FROM products
        WHERE name = v_product_name;

        -- If the product does not exist, set the message and exit
        IF v_product_exists = 0 THEN
            SET p_message = CONCAT('Product "', v_product_name, '" does not exist. ');
         
        END IF;

        SET v_product_index = v_product_index + 1;
    END WHILE;

    -- Reset the product index for the actual processing
    SET v_product_index = 1;

    -- Insert a new sales record
    INSERT INTO sales (user_id, total_amount, is_refunded) 
    VALUES (p_user_id, 0, 0);

    -- Get the last inserted sales ID
    SET v_sales_id = LAST_INSERT_ID();

    -- Loop through each product in the order
    WHILE v_product_index <= v_num_products DO
        -- Extract product details
        SET v_product_name = SUBSTRING_INDEX(SUBSTRING_INDEX(p_product_names, ',', v_product_index), ',', -1);
        SET v_quantity = CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(p_quantities, ',', v_product_index), ',', -1) AS UNSIGNED);

        -- Retrieve product ID and unit price for the product
        SELECT id, unit_price INTO v_product_id, v_unit_price
        FROM products
        WHERE name = v_product_name;

        -- Calculate total price for the product
        SET v_quantity_price = v_quantity * v_unit_price;

        -- Update the total amount for the sales
        SET v_total_amount = v_total_amount + v_quantity_price;

        -- Insert into sales_products table
        INSERT INTO sales_products (sales_id, product_id, quantity, unit_price, quantity_price) 
        VALUES (v_sales_id, v_product_id, v_quantity, v_unit_price, v_quantity_price);

        -- Update product quantity in the products table
        SELECT quantity INTO v_current_quantity
        FROM products
        WHERE id = v_product_id;

        IF (v_current_quantity - v_quantity) <= 0 THEN
            UPDATE products
            SET quantity = 0,
                stock_status = 'Out of Stock',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = v_product_id;
            SET v_stock_message = CONCAT('Product "', v_product_name, '" is out of stock. ');
            SET p_message = CONCAT(p_message, v_stock_message);
        ELSE
            UPDATE products
            SET quantity = v_current_quantity - v_quantity,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = v_product_id;
        END IF;

        SET v_product_index = v_product_index + 1;
    END WHILE;

    -- Update the total amount in the sales table
    UPDATE sales
    SET total_amount = v_total_amount,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = v_sales_id;

    -- Insert a new order
    INSERT INTO orders (sales_id, user_id, delivery_status, is_cancelled) 
    VALUES (v_sales_id, p_user_id, 'is delivered', 0);

    -- Check if message is empty
    IF p_message = '' THEN
        SET p_message = 'Order created successfully';
    END IF;
END//

DELIMITER ;



DELIMITER //

CREATE PROCEDURE update_order(
    IN p_order_id INT,
    IN p_user_id INT,
    IN p_product_names VARCHAR(255), 
    IN p_quantities VARCHAR(255),
    IN p_delivery_status VARCHAR(255),
    IN p_is_cancelled TINYINT(1),
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE v_total_amount FLOAT DEFAULT 0;
    DECLARE v_sales_id INT;
    DECLARE v_product_id INT;
    DECLARE v_quantity INT;
    DECLARE v_unit_price FLOAT;
    DECLARE v_quantity_price FLOAT;
    DECLARE v_product_index INT DEFAULT 1;
    DECLARE v_num_products INT;
    DECLARE v_current_quantity INT;
    DECLARE v_product_name VARCHAR(255);
    DECLARE v_stock_message VARCHAR(255);
    DECLARE v_product_exists INT;
    DECLARE done INT DEFAULT 0;
    DECLARE cur CURSOR FOR 
        SELECT product_id, quantity
        FROM sales_products
        WHERE sales_id = v_sales_id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;


    -- Initialize the output message
    SET p_message = '';

    -- Determine the number of products in the order
    SET v_num_products = (LENGTH(p_product_names) - LENGTH(REPLACE(p_product_names, ',', ''))) / LENGTH(',') + 1;

    -- Check if the order ID exists
    SELECT id INTO v_sales_id
    FROM orders
    WHERE id = p_order_id;

    IF v_sales_id IS NULL THEN
        SET p_message = 'Order ID not found';
        
    END IF;

    -- Loop through each product to check if it exists
    WHILE v_product_index <= v_num_products DO
        -- Extract product details
        SET v_product_name = SUBSTRING_INDEX(SUBSTRING_INDEX(p_product_names, ',', v_product_index), ',', -1);

        -- Check if the product exists
        SELECT COUNT(*) INTO v_product_exists
        FROM products
        WHERE name = v_product_name;

        -- If the product does not exist, set the message and exit
        IF v_product_exists = 0 THEN
            SET p_message = CONCAT(p_message, 'Product "', v_product_name, '" does not exist. ');
        END IF;

        SET v_product_index = v_product_index + 1;
    END WHILE;

    -- Reset the product index for the actual processing
    SET v_product_index = 1;

    -- Roll back previous quantities for the products in the sales
   

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO v_product_id, v_quantity;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Retrieve the current quantity for the product
        SELECT quantity INTO v_current_quantity
        FROM products
        WHERE id = v_product_id;

        -- Update the product quantity
        UPDATE products
        SET quantity = v_current_quantity + v_quantity
        WHERE id = v_product_id;
    END LOOP;

    CLOSE cur;

    -- Delete existing sales products for the sales
    DELETE FROM sales_products WHERE sales_id = v_sales_id;

    -- Loop through each product in the order
    WHILE v_product_index <= v_num_products DO
        -- Extract product details
        SET v_product_name = SUBSTRING_INDEX(SUBSTRING_INDEX(p_product_names, ',', v_product_index), ',', -1);
        SET v_quantity = CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(p_quantities, ',', v_product_index), ',', -1) AS UNSIGNED);

        -- Retrieve product ID and unit price for the product
        SELECT id, unit_price INTO v_product_id, v_unit_price
        FROM products
        WHERE name = v_product_name;

        -- Calculate total price for the product
        SET v_quantity_price = v_quantity * v_unit_price;

        -- Update the total amount for the sales
        SET v_total_amount = v_total_amount + v_quantity_price;

        -- Insert into sales_products table
        INSERT INTO sales_products (sales_id, product_id, quantity, unit_price, quantity_price) 
        VALUES (v_sales_id, v_product_id, v_quantity, v_unit_price, v_quantity_price);

        -- Update product quantity in the products table
        SELECT quantity INTO v_current_quantity
        FROM products
        WHERE id = v_product_id;

        IF (v_current_quantity - v_quantity) <= 0 THEN
            UPDATE products
            SET quantity = 0,
                stock_status = 'Out of Stock',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = v_product_id;
            SET v_stock_message = CONCAT('Product "', v_product_name, '" is out of stock. ');
            SET p_message = CONCAT(p_message, v_stock_message);
        ELSE
            UPDATE products
            SET quantity = v_current_quantity - v_quantity,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = v_product_id;
        END IF;

        SET v_product_index = v_product_index + 1;
    END WHILE;

    -- Update the total amount in the sales table
    UPDATE sales
    SET total_amount = v_total_amount,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = v_sales_id;

    -- Update the user ID in the orders table
    UPDATE orders
    SET user_id = p_user_id,
        is_cancelled = p_is_cancelled,
        delivery_status = p_delivery_status,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_order_id;

    -- Check if message is empty
    IF p_message = '' THEN
        SET p_message = 'Order updated successfully';
    END IF;

    -- End of procedure
   END//

   DELIMITER ;

DELIMITER //

CREATE PROCEDURE delete_order(
    IN p_order_id INT,
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE v_sales_id INT;
    DECLARE v_is_canceled INT;
    DECLARE v_product_id INT;
    DECLARE v_quantity INT;
    DECLARE done INT DEFAULT 0;

    -- Roll back product quantities for the order
    DECLARE cur CURSOR FOR 
        SELECT product_id, quantity
        FROM sales_products
        WHERE sales_id = v_sales_id;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    -- Initialize the output message
    SET p_message = '';

    -- Check if the order ID exists and if it's already canceled
    SELECT sales_id, is_cancelled INTO v_sales_id, v_is_canceled
    FROM orders
    WHERE id = p_order_id;

    IF v_sales_id IS NULL THEN
        SET p_message = 'Order ID not found';
    ELSEIF v_is_canceled = 1 THEN
        SET p_message = 'Order is already canceled';  
    ELSE
        OPEN cur;

        read_loop: LOOP
            FETCH cur INTO v_product_id, v_quantity;
            IF done THEN
                LEAVE read_loop;
            END IF;

            -- Increase the product quantity
            UPDATE products
            SET quantity = quantity + v_quantity
            WHERE id = v_product_id;
        END LOOP;

        CLOSE cur;

        -- Delete sales products for the order
        DELETE FROM sales_products WHERE sales_id = v_sales_id;

        -- Delete the sales record
        DELETE FROM sales WHERE id = v_sales_id;

        -- Update is_canceled field to 1 for the order in orders table
        UPDATE orders
        SET is_cancelled = 1,
            delivery_status = 'not delivered',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = p_order_id;

        SET p_message = 'Order canceled successfully';
    END IF;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE find_order(
    IN p_order_id INT,
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE v_sales_id INT;
    DECLARE v_total_amount DECIMAL(10, 2);
    DECLARE v_product_names VARCHAR(255);
    DECLARE v_order_user_id INT;
    DECLARE v_order_created_at DATETIME;
    DECLARE v_is_cancelled TINYINT(1);
    declare v_delivery_status varchar(255);


    -- Initialize the output message
    SET p_message = '';

    -- Check if the order exists
    SELECT sales_id INTO v_sales_id
    FROM orders
    WHERE id = p_order_id;

    IF v_sales_id IS NULL THEN
        SET p_message = 'Order not found';
    ELSE
        -- Get total amount for the order
        SELECT total_amount INTO v_total_amount
        FROM sales
        WHERE id = v_sales_id;

        -- Get product names for the order
        SELECT GROUP_CONCAT(p.name SEPARATOR ', ') INTO v_product_names
        FROM sales_products sp
        INNER JOIN products p ON sp.product_id = p.id
        WHERE sp.sales_id = v_sales_id;

        -- Get additional details from the orders table
        SELECT user_id,is_cancelled,delivery_status, created_at INTO v_order_user_id,v_is_cancelled,v_delivery_status, v_order_created_at
        FROM orders
        WHERE id = p_order_id;

        -- Return the order details
        SELECT 
        	p_order_id as OrderID,
            v_is_cancelled as IS_cancelled,
            v_delivery_status as DeliveryStatus,
            v_sales_id AS SalesID,
            v_total_amount AS TotalAmount,
            v_product_names AS OrderedProducts,
            v_order_user_id AS UserID,
            v_order_created_at AS OrderDate;
    END IF;
END //

DELIMITER ;


DELIMITER //

CREATE PROCEDURE add_supply_order(
    IN p_user_id INT,
    IN p_item_name VARCHAR(255),
    IN p_item_quantity INT,
    IN p_category_id INT, -- New parameter for category ID
    OUT MESSAGE VARCHAR(255)
)
BEGIN
    DECLARE v_product_id INT;
    DECLARE v_item_id INT;
    DECLARE v_item_price DECIMAL(10, 2);

    -- Check if item exists in products
    SELECT id INTO v_product_id
    FROM products
    WHERE name = p_item_name;

    -- If the product does not exist, insert it into the products table
    IF v_product_id IS NULL THEN
        INSERT INTO products (name, quantity, stock_status, category_id, user_id)
        VALUES (p_item_name, p_item_quantity, 'in stock', p_category_id, p_user_id);
        SET v_product_id = LAST_INSERT_ID();
        SET MESSAGE = 'Product created successfully';
    ELSE
        -- Retrieve the item price from the items table
        SELECT item_price INTO v_item_price
        FROM items
        WHERE item_name = p_item_name
        ORDER BY created_at DESC
        LIMIT 1;
        
        IF v_item_price IS NULL THEN
            SET MESSAGE = 'Item price not found.';
            LEAVE add_supply_order_proc;
        END IF;
    END IF;

    -- Insert a new supply order
    INSERT INTO supplyOrders (user_id) VALUES (p_user_id);
    SET @supply_order_id = LAST_INSERT_ID();

    -- Insert item into items table
    INSERT INTO items (item_name, item_price, product_id)
    VALUES (p_item_name, v_item_price, v_product_id);

    SET v_item_id = LAST_INSERT_ID();

    -- Insert into supplyOrders_items
    INSERT INTO supplyOrders_items (supplyOrder_id, item_id, item_quantity)
    VALUES (@supply_order_id, v_item_id, p_item_quantity);

    -- Update product quantity
    UPDATE products
    SET quantity = quantity + p_item_quantity,
        updated_at = CURRENT_TIMESTAMP,
        stock_status = IF(quantity > 0, 'In Stock', 'Out of Stock')
    WHERE id = v_product_id;

    SET MESSAGE = 'Supply order created successfully';

END //

DELIMITER ;


DELIMITER //

CREATE PROCEDURE update_supply_order(
    IN p_supplyorder_id INT,
    IN p_user_id INT,
    IN p_item_name VARCHAR(255),
    IN p_item_quantity INT,
    IN p_item_price DECIMAL(10, 2),
    IN p_category_id INT, -- New parameter for category ID
    OUT MESSAGE VARCHAR(255)
)
BEGIN
    DECLARE v_product_id INT;
    DECLARE v_item_id INT;

    -- Check if supply order ID exists
    IF EXISTS (SELECT 1 FROM supplyOrders WHERE id = p_supplyorder_id) THEN
        -- Update user ID in supplyOrders
        UPDATE supplyOrders
        SET user_id = p_user_id,
        updated_at = CURRENT_TIMESTAMP
        WHERE id = p_supplyorder_id;
        
        -- Check if item exists in products
        SELECT id INTO v_product_id
        FROM products
        WHERE name = p_item_name;

        -- If the product does not exist, insert it into the products table
        IF v_product_id IS NULL THEN
            INSERT INTO products (name, unit_price, quantity, stock_status, category_id, user_id)
            VALUES (p_item_name, p_item_price, p_item_quantity, 'in stock', p_category_id, p_user_id);
            SET v_product_id = LAST_INSERT_ID();
        ELSE
            -- Update product details
            UPDATE products
            SET
                unit_price = p_item_price,
                quantity = p_item_quantity,
                stock_status = 'in stock',
                category_id = p_category_id,
                user_id = p_user_id,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = v_product_id;
        END IF;

        -- Check if item exists in items
        SELECT id INTO v_item_id
        FROM items 
        WHERE item_name = p_item_name;

        -- If the item does not exist, insert it into the items table
        IF v_item_id IS NULL THEN
            INSERT INTO items (item_name, item_price, product_id)
            VALUES (p_item_name, p_item_price, v_product_id);
            SET v_item_id = LAST_INSERT_ID();
        END IF;

        -- Update supplyOrders_items
        UPDATE supplyOrders_items 
        SET 
            item_quantity = p_item_quantity,
            item_id = v_item_id,
            updated_at = CURRENT_TIMESTAMP
        WHERE supplyOrder_id = p_supplyorder_id;

        SET MESSAGE = 'Supply order updated successfully';
    ELSE
        SET MESSAGE = 'Supply order ID not found';
    END IF;
END //

DELIMITER ;


DELIMITER //

CREATE PROCEDURE delete_supply_order(
    IN p_supplyorder_id INT,
    OUT MESSAGE VARCHAR(255)
)
BEGIN
    DECLARE v_product_id INT;
    DECLARE v_item_id INT;
    DECLARE v_item_quantity INT;

    -- Check if supply order ID exists
    IF EXISTS (SELECT 1 FROM supplyOrders WHERE id = p_supplyorder_id) THEN
        -- Get product_id associated with item_id from supplyOrders_items
        -- Get item_id associated with supply order ID
    SELECT item_id, item_quantity INTO v_item_id, v_item_quantity
    FROM supplyOrders_items
    WHERE supplyOrder_id = p_supplyorder_id;

    -- Check if item_id exists and get product_id
    SELECT product_id INTO v_product_id
    FROM items
    WHERE id = v_item_id;

        -- If product_id is not null, decrement the quantity in the products table
       IF v_product_id IS NOT NULL THEN
        UPDATE products
        SET quantity = quantity - v_item_quantity
        WHERE id = v_product_id;
    END IF;

        -- Delete records from supplyOrders_items
        DELETE FROM supplyOrders_items WHERE supplyOrder_id = p_supplyorder_id;

        -- Delete records from supplyOrders
        DELETE FROM supplyOrders WHERE id = p_supplyorder_id;

        SET MESSAGE = 'Supply order deleted successfully';
    ELSE
        SET MESSAGE = 'Supply order ID not found';
    END IF;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE find_supply_order(
    IN p_supplyorder_id INT,
    OUT MESSAGE VARCHAR(255)
)
BEGIN
    DECLARE v_item_id INT;
    DECLARE v_product_id INT;
    DECLARE v_item_name VARCHAR(255);
    DECLARE v_item_price DECIMAL(10, 2);
    DECLARE v_item_quantity INT;
    DECLARE v_product_name VARCHAR(255);
    DECLARE v_product_quantity INT;
    DECLARE v_unit_price DECIMAL(10, 2);
    DECLARE v_category_id INT;
    DECLARE v_user_id INT;

    -- Check if supply order ID exists
    IF EXISTS (SELECT 1 FROM supplyOrders WHERE id = p_supplyorder_id) THEN
        -- Retrieve supply order details
        SELECT user_id INTO v_user_id
        FROM supplyOrders
        WHERE id = p_supplyorder_id;

        -- Retrieve associated item details
        SELECT si.item_id, si.item_quantity, i.item_name, i.item_price, p.id AS product_id, p.name AS product_name, p.unit_price, p.quantity AS product_quantity, p.category_id
        INTO v_item_id, v_item_quantity, v_item_name, v_item_price, v_product_id, v_product_name, v_unit_price, v_product_quantity, v_category_id
        FROM supplyOrders_items si
        JOIN items i ON si.item_id = i.id
        JOIN products p ON i.product_id = p.id
        WHERE si.supplyOrder_id = p_supplyorder_id;

        -- Display the retrieved information
        SELECT 
            p_supplyorder_id,
            v_user_id AS user_id,
            v_item_name AS item_name,
            v_item_price AS item_price,
            v_item_quantity AS item_quantity;
            

        SET MESSAGE = 'Supply order found successfully';
    ELSE
        SET MESSAGE = 'Supply order ID not found';
    END IF;
END //

DELIMITER ;

DELIMITER //
DELIMITER //

CREATE PROCEDURE add_sales_transaction(
    IN p_user_id INT,
    IN p_product_ids VARCHAR(255), 
    IN p_quantities VARCHAR(255),       
    OUT MESSAGE VARCHAR(255)
)
BEGIN
    DECLARE v_total_amount FLOAT DEFAULT 0;
    DECLARE v_sales_id INT;
    DECLARE v_product_id INT;
    DECLARE v_quantity INT;
    DECLARE v_unit_price FLOAT;
    DECLARE v_quantity_price FLOAT;
    DECLARE v_product_index INT DEFAULT 1;
    DECLARE v_num_products INT;
    DECLARE v_current_quantity INT;


    -- Determine the number of products in the sale
    SET v_num_products = (LENGTH(p_product_ids) - LENGTH(REPLACE(p_product_ids, ',', ''))) / LENGTH(',') + 1;

    -- Insert a new sales record
    INSERT INTO sales (user_id, total_amount, is_refunded) 
    VALUES (p_user_id, 0, 0);

    -- Get the last inserted sales ID
    SET v_sales_id = LAST_INSERT_ID();

    -- Loop through each product in the sale
    WHILE v_product_index <= v_num_products DO
        -- Extract product details
        SET v_product_id = CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(p_product_ids, ',', v_product_index), ',', -1) AS UNSIGNED);
        SET v_quantity = CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(p_quantities, ',', v_product_index), ',', -1) AS UNSIGNED);

        -- Retrieve unit price for the product
        SELECT unit_price INTO v_unit_price
        FROM products
        WHERE id = v_product_id;

        -- Calculate total price for the product
        SET v_quantity_price = v_quantity * v_unit_price;

        -- Update the total amount for the sales
        SET v_total_amount = v_total_amount + v_quantity_price;

        -- Insert into sales_products table
        INSERT INTO sales_products (sales_id, product_id, quantity, unit_price, quantity_price) 
        VALUES (v_sales_id, v_product_id, v_quantity, v_unit_price, v_quantity_price);

        -- Update product quantity in the products table
        -- Decrement the quantity in the products table
         SELECT quantity INTO v_current_quantity
        FROM products
        WHERE id = v_product_id;

        IF (v_current_quantity - v_quantity) <= 0 THEN
            UPDATE products
            SET quantity = 0
            WHERE id = v_product_id;
            SET MESSAGE = CONCAT('Product "', (SELECT name FROM products WHERE id = v_product_id), '" is out of stock');
        ELSE
            UPDATE products
            SET quantity = v_current_quantity - v_quantity
            WHERE id = v_product_id;
        END IF;
       
        SET v_product_index = v_product_index + 1;
    END WHILE;

    -- Update the total amount in the sales table
    UPDATE sales
    SET
    total_amount = v_total_amount,
    updated_at = CURRENT_TIMESTAMP,
    created_at = CURRENT_TIMESTAMP
    WHERE id = v_sales_id;

END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE update_sales_transaction(
    IN p_sales_id INT,
    IN p_user_id INT,
    IN p_product_ids VARCHAR(255), 
    IN p_quantities VARCHAR(255)
)
BEGIN
    DECLARE v_total_amount FLOAT DEFAULT 0;
    DECLARE v_product_id INT;
    DECLARE v_quantity INT;
    DECLARE v_unit_price FLOAT;
    DECLARE v_quantity_price FLOAT;
    DECLARE v_product_index INT DEFAULT 1;
    DECLARE v_num_products INT;
    DECLARE v_current_quantity INT;

    -- Determine the number of products in the sale
    SET v_num_products = (LENGTH(p_product_ids) - LENGTH(REPLACE(p_product_ids, ',', ''))) / LENGTH(',') + 1;

    -- Delete existing sales products associated with the given sales ID
    DELETE FROM sales_products WHERE sales_id = p_sales_id;

    -- Loop through each product in the sale
    WHILE v_product_index <= v_num_products DO
        -- Extract product details
        SET v_product_id = CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(p_product_ids, ',', v_product_index), ',', -1) AS UNSIGNED);
        SET v_quantity = CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(p_quantities, ',', v_product_index), ',', -1) AS UNSIGNED);

        -- Retrieve current quantity of the product
        SELECT quantity INTO v_current_quantity
        FROM products
        WHERE id = v_product_id;

        -- Retrieve unit price for the product
        SELECT unit_price INTO v_unit_price
        FROM products
        WHERE id = v_product_id;

        -- Calculate total price for the product
        SET v_quantity_price = v_quantity * v_unit_price;

        -- Update the total amount for the sales
        SET v_total_amount = v_total_amount + v_quantity_price;

        -- Insert into sales_products table
        INSERT INTO sales_products (sales_id, product_id, quantity, unit_price, quantity_price) 
        VALUES (p_sales_id, v_product_id, v_quantity, v_unit_price, v_quantity_price);

        -- Update product quantity in the products table
        IF (v_current_quantity - v_quantity) <= 0 THEN
            UPDATE products
            SET quantity = 0
            WHERE id = v_product_id;
            SELECT CONCAT('Product "', (SELECT name FROM products WHERE id = v_product_id), '" is out of stock') AS Message;
        ELSE
            UPDATE products
            SET quantity = v_current_quantity - v_quantity
            WHERE id = v_product_id;
        END IF;

        SET v_product_index = v_product_index + 1;
    END WHILE;

    -- Update the total amount and user_id in the sales table
    UPDATE sales
    SET 
        user_id = p_user_id,
        total_amount = v_total_amount,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_sales_id;

END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE delete_sales_transaction(
    IN p_sales_id INT,
    OUT MESSAGE VARCHAR(255)
)
BEGIN
    DECLARE v_product_id INT;
    DECLARE v_quantity INT;

    -- Retrieve product IDs and quantities for the sales transaction
    DECLARE cur CURSOR FOR
        SELECT product_id, quantity
        FROM sales_products
        WHERE sales_id = p_sales_id;

    -- Declare cursor handler
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET @done = TRUE;

    -- Open cursor
    OPEN cur;

    -- Loop through each product in the sales transaction
    read_loop: LOOP
        FETCH cur INTO v_product_id, v_quantity;

        -- If no more rows to fetch, exit loop
        IF @done THEN
            LEAVE read_loop;
        END IF;

        -- Restore product quantities in the products table
        UPDATE products
        SET quantity = quantity + v_quantity
        WHERE id = v_product_id;
    END LOOP;

    -- Close cursor
    CLOSE cur;

    -- Delete sales transaction
    DELETE FROM sales WHERE id = p_sales_id;

    SET MESSAGE = 'Sales transaction deleted successfully';

END //

DELIMITER ;


DELIMITER //

CREATE PROCEDURE find_sales_transactions_by_id(
    IN p_sales_id INT
)
BEGIN
    SELECT 
        s.id AS sales_id,
        s.user_id,
        s.total_amount,
        s.created_at AS sale_date,
        GROUP_CONCAT(CONCAT(sp.quantity, 'x ', p.name) SEPARATOR ', ') AS items_purchased
    FROM 
        sales s
    INNER JOIN 
        sales_products sp ON s.id = sp.sales_id
    INNER JOIN 
        products p ON sp.product_id = p.id
    WHERE 
        s.id = p_sales_id
    GROUP BY 
        s.id, s.total_amount, s.created_at;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE add_product(
    IN p_name VARCHAR(255),
    IN p_unit_price FLOAT,
    IN p_quantity INT,
    IN p_category_id INT,
    IN p_user_id INT,
    OUT p_product_id INT,
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE v_existing_product_id INT;

    -- Check if the product already exists
    SELECT id INTO v_existing_product_id
    FROM products
    WHERE name = p_name;

    IF v_existing_product_id IS NOT NULL THEN
        -- Product already exists, update its quantity
        UPDATE products
        SET quantity = quantity + p_quantity
        WHERE id = v_existing_product_id;

        SET p_product_id = v_existing_product_id;
        SET p_message = 'Product quantity updated successfully.';
    ELSE
        -- Insert the new product
        INSERT INTO products (name, unit_price, quantity, category_id, user_id)
        VALUES (p_name, p_unit_price, p_quantity, p_category_id, p_user_id);

        SET p_product_id = LAST_INSERT_ID();
        SET p_message = 'Product added successfully.';
    END IF;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE update_product(
    IN p_product_id INT,
    IN p_name VARCHAR(255),
    IN p_unit_price FLOAT,
    IN p_quantity INT,
    IN p_category_id INT,
    IN p_user_id INT,
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE v_existing_product_id INT;
    DECLARE v_existing_item_id INT;

    -- Check if the product exists
    SELECT id INTO v_existing_product_id
    FROM products
    WHERE id = p_product_id;

    IF v_existing_product_id IS NOT NULL THEN
        -- Update the existing product
        UPDATE products
        SET 
            name = p_name,
            unit_price = p_unit_price,
            quantity = p_quantity,
            category_id = p_category_id,
            user_id = p_user_id,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = p_product_id;

        SET p_message = 'Product updated successfully.';
    ELSE
        SET p_message = 'Product ID not found.';
    END IF;

    -- Check if the item exists in the items table
    SELECT id INTO v_existing_item_id
    FROM items
    WHERE item_name = p_name;

    IF v_existing_item_id IS NULL THEN
        -- Insert the new item into the items table
        INSERT INTO items (item_name, item_price, product_id)
        VALUES (p_name, p_unit_price, p_product_id);
    ELSE
        -- Update the existing item in the items table
        UPDATE items
        SET 
            item_name = p_name,
            item_price = p_unit_price,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = v_existing_item_id;
    END IF;
END //

DELIMITER ;


DELIMITER //

CREATE PROCEDURE delete_product(
    IN p_product_id INT,
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE v_product_name VARCHAR(255);
    DECLARE v_item_id INT;

    -- Check if the product exists and get the product name
    SELECT name INTO v_product_name
    FROM products
    WHERE id = p_product_id;

    IF v_product_name IS NOT NULL THEN
        -- Delete the product from the products table
        DELETE FROM products WHERE id = p_product_id;

        -- Check if the item exists in the items table
        SELECT id INTO v_item_id
        FROM items
        WHERE item_name = v_product_name;

        IF v_item_id IS NOT NULL THEN
            UPDATE
            items
            set
            prduct_id= NULL
            WHERE id = v_item_id;
        END IF;

        SET p_message = 'Product and corresponding item deleted successfully.';
    ELSE
        SET p_message = 'Product ID not found.';
    END IF;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE find_product(
    IN p_product_id INT
)
BEGIN
    -- Declare variables to hold product and item details
    DECLARE v_product_name VARCHAR(255);
    DECLARE v_unit_price DECIMAL(10, 2);
    DECLARE v_quantity INT;
    DECLARE v_stock_status VARCHAR(50);
    DECLARE v_category_id INT;
    DECLARE v_user_id INT;
    DECLARE v_item_name VARCHAR(255);
    DECLARE v_item_price DECIMAL(10, 2);

    -- Check if the product exists
    IF EXISTS (SELECT 1 FROM products WHERE id = p_product_id) THEN
        -- Get product details
        SELECT name, unit_price, quantity, stock_status, category_id, user_id
        INTO v_product_name, v_unit_price, v_quantity, v_stock_status, v_category_id, v_user_id
        FROM products
        WHERE id = p_product_id;

        -- Return the product and item details
        SELECT 
            v_product_name AS ProductName, 
            v_unit_price AS UnitPrice, 
            v_quantity AS Quantity, 
            v_stock_status AS StockStatus, 
            v_category_id AS CategoryID, 
            v_user_id AS UserID;
    ELSE
        -- If product does not exist, return a message
        SELECT 'Product not found' AS Message;
    END IF;
END //

DELIMITER ;


DELIMITER //

CREATE PROCEDURE add_item(
    IN p_item_name VARCHAR(255),
    IN p_item_price DECIMAL(10, 2),
    IN p_user_id INT,
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE v_product_id INT;
    DECLARE v_existing_product BOOLEAN;

    -- Check if the product already exists in the products table
    SET v_existing_product = FALSE;
    SELECT id INTO v_product_id
    FROM products
    WHERE name = p_item_name;

    -- If the product exists, set v_existing_product to TRUE
    IF v_product_id IS NOT NULL THEN
        SET v_existing_product = TRUE;
    END IF;

    -- Check if the item already exists in the items table
    IF NOT EXISTS (SELECT 1 FROM items WHERE item_name = p_item_name) THEN
        -- Insert the item into the items table
        INSERT INTO items (item_name, item_price, product_id)
        VALUES (p_item_name, p_item_price, IF(v_existing_product, v_product_id, NULL));
        SET p_message = 'Item added successfully.';
    ELSE
        SET p_message = 'Item already exists, no changes made.';
    END IF;
END //

DELIMITER ;
DELIMITER //

CREATE PROCEDURE update_item(
    IN p_old_item_name VARCHAR(255),
    IN p_new_item_name VARCHAR(255),
    IN p_item_price DECIMAL(10, 2),
    IN p_user_id INT,
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE v_item_id INT;
    DECLARE v_product_id INT;

    -- Check if the item exists in the items table
    SELECT id, product_id INTO v_item_id, v_product_id
    FROM items
    WHERE item_name = p_old_item_name;

    IF v_item_id IS NOT NULL THEN
        -- Update the item name, price, and user ID
        UPDATE items
        SET 
            item_name = p_new_item_name,
            item_price = p_item_price,
            user_id = p_user_id
        WHERE id = v_item_id;

        -- Update the corresponding product in the products table if it exists
        IF v_product_id IS NOT NULL THEN
            UPDATE products
            SET 
                name = p_new_item_name,
                unit_price = p_item_price,
                user_id = p_user_id
            WHERE id = v_product_id;
        END IF;

        SET p_message = 'Item updated successfully.';
    ELSE
        SET p_message = 'Item does not exist.';
    END IF;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE delete_item(
    IN p_item_id INT,
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE v_product_id INT;

    -- Check if the item exists in the items table
    IF EXISTS (SELECT 1 FROM items WHERE id = p_item_id) THEN
        -- Get the corresponding product ID
        SELECT product_id INTO v_product_id
        FROM items
        WHERE id = p_item_id;

        -- Delete the item from the items table
        DELETE FROM items
        WHERE id = p_item_id;

        -- Delete the corresponding row from the products table
        IF v_product_id IS NOT NULL THEN
            DELETE FROM products
            WHERE id = v_product_id;
        END IF;

        SET p_message = 'Item deleted successfully.';
    ELSE
        SET p_message = 'Item does not exist.';
    END IF;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE find_item(
    IN p_item_name VARCHAR(255),
    OUT MESSAGE VARCHAR(255)
)
BEGIN
    DECLARE v_item_id INT;

    -- Check if the item exists
    SELECT id INTO v_item_id
    FROM items
    WHERE item_name = p_item_name;

    IF v_item_id IS NOT NULL THEN
        -- If the item is found, select the item details and set the message
        SELECT * 
        FROM items
        WHERE item_name = p_item_name;
        SET MESSAGE = 'item found';
    ELSE
        -- If the item is not found, set the message
        SET MESSAGE = 'item not found';
    END IF;
END //

DELIMITER ;

--alternative_supplyorder_procedure

DELIMITER //

CREATE PROCEDURE add_supplyorder(
    IN p_user_id INT,
    IN p_item_ids VARCHAR(255), 
    IN p_item_quantities VARCHAR(255), 
    IN p_item_prices VARCHAR(255), 
    IN p_category_id INT, 
    OUT MESSAGE VARCHAR (255)
)
BEGIN
    DECLARE v_item_id INT;
    DECLARE v_quantity INT;
    DECLARE v_price DECIMAL(10, 2);
    DECLARE v_product_id INT;
    DECLARE v_supply_order_id INT;
    DECLARE v_item_index INT DEFAULT 1;
    DECLARE v_num_items INT;
    DECLARE v_current_quantity INT;

    -- Determine the number of items in the supply order
    SET v_num_items = (LENGTH(p_item_ids) - LENGTH(REPLACE(p_item_ids, ',', ''))) / LENGTH(',') + 1;

    -- Insert a new supply order
    INSERT INTO supplyOrders (user_id) VALUES (p_user_id);
    SET v_supply_order_id = LAST_INSERT_ID();

    -- Loop through each item in the supply order
    WHILE v_item_index <= v_num_items DO
        -- Extract item details
        SET v_item_id = CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(p_item_ids, ',', v_item_index), ',', -1) AS UNSIGNED);
        SET v_quantity = CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(p_item_quantities, ',', v_item_index), ',', -1) AS UNSIGNED);
        SET v_price = CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(p_item_prices, ',', v_item_index), ',', -1) AS DECIMAL(10, 2));

        -- Check if item exists in products
        SELECT id INTO v_product_id
        FROM products
        WHERE id = v_item_id;

        -- If the product does not exist, insert it into the products table
        IF v_product_id IS NULL THEN
            INSERT INTO products (name, unit_price, quantity, stock_status, category_id, user_id)
            VALUES ((SELECT name FROM items WHERE id = v_item_id), v_price, v_quantity, 'in stock', p_category_id, p_user_id);
            SET v_product_id = LAST_INSERT_ID();
        END IF;

        -- Insert item into items table
        INSERT INTO items (item_name, item_price, product_id)
        VALUES ((SELECT name FROM products WHERE id = v_product_id), v_price, v_product_id);

        SET v_item_id = LAST_INSERT_ID();

        -- Insert into supplyOrders_items
        INSERT INTO supplyOrders_items (supplyOrder_id, item_id, item_quantity)
        VALUES (v_supply_order_id, v_item_id, v_quantity);

        -- Update product quantity
        SELECT quantity INTO v_current_quantity
        FROM products
        WHERE id = v_product_id;

        UPDATE products
        SET quantity = v_current_quantity + v_quantity,
            updated_at = CURRENT_TIMESTAMP,
            stock_status = IF(v_current_quantity + v_quantity > 0, 'In Stock', 'Out of Stock'),
            created_at = CURRENT_TIMESTAMP
        WHERE id = v_product_id;

        SET v_item_index = v_item_index + 1;
    END WHILE;

    SET MESSAGE = 'Supply order created successfully';
END //

DELIMITER ;
DELIMITER //

CREATE PROCEDURE update_supplyorder(
    IN p_supply_order_id INT,
    IN p_item_ids VARCHAR(255), 
    IN p_item_quantities VARCHAR(255), 
    IN p_item_prices VARCHAR(255), 
    OUT MESSAGE VARCHAR (255)
)
BEGIN
    DECLARE v_item_id INT;
    DECLARE v_quantity INT;
    DECLARE v_price DECIMAL(10, 2);
    DECLARE v_product_id INT;
    DECLARE v_item_index INT DEFAULT 1;
    DECLARE v_num_items INT;
    DECLARE v_current_quantity INT;
    DECLARE v_existing_quantity INT;
    DECLARE v_order_exists INT;

    -- Check if the supply order exists
    select id into v_order_exists
    FROM supplyOrders
    WHERE id = p_supply_order_id;

    IF v_order_exists = 0 THEN
        SET MESSAGE = 'Supply order does not exist';
       
    END IF;

    -- Determine the number of items in the supply order
    SET v_num_items = (LENGTH(p_item_ids) - LENGTH(REPLACE(p_item_ids, ',', ''))) / LENGTH(',') + 1;

    -- Loop through each item in the supply order
    WHILE v_item_index <= v_num_items DO
        -- Extract item details
        SET v_item_id = CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(p_item_ids, ',', v_item_index), ',', -1) AS UNSIGNED);
        SET v_quantity = CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(p_item_quantities, ',', v_item_index), ',', -1) AS UNSIGNED);
        SET v_price = CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(p_item_prices, ',', v_item_index), ',', -1) AS DECIMAL(10, 2));

        -- Check if item exists in products
        SELECT id, quantity INTO v_product_id, v_existing_quantity
        FROM products
        WHERE id = v_item_id;

        -- If the product does not exist, insert it into the products table
        IF v_product_id IS NULL THEN
            INSERT INTO products (name, unit_price, quantity, stock_status, category_id, user_id)
            VALUES ((SELECT name FROM items WHERE id = v_item_id), v_price, v_quantity, 'in stock', (SELECT category_id FROM items WHERE id = v_item_id), (SELECT user_id FROM supplyOrders WHERE id = p_supply_order_id));
            SET v_product_id = LAST_INSERT_ID();
        ELSE
            -- Update product quantity and price
            UPDATE products
            SET quantity = quantity - v_existing_quantity + v_quantity,
                unit_price = v_price,
                updated_at = CURRENT_TIMESTAMP,
                stock_status = IF(quantity - v_existing_quantity + v_quantity > 0, 'In Stock', 'Out of Stock'),
                created_at = CURRENT_TIMESTAMP
            WHERE id = v_product_id;
        END IF;

        -- Update the items table
        UPDATE items
        SET item_price = v_price,
            product_id = v_product_id
        WHERE id = v_item_id;

        -- Update or insert into supplyOrders_items
        IF EXISTS (SELECT 1 FROM supplyOrders_items WHERE supplyOrder_id = p_supply_order_id AND item_id = v_item_id) THEN
            UPDATE supplyOrders_items
            SET item_quantity = v_quantity
            WHERE supplyOrder_id = p_supply_order_id AND item_id = v_item_id;
        ELSE
            INSERT INTO supplyOrders_items (supplyOrder_id, item_id, item_quantity)
            VALUES (p_supply_order_id, v_item_id, v_quantity);
        END IF;

        SET v_item_index = v_item_index + 1;
    END WHILE;

    SET MESSAGE = 'Supply order updated successfully';
END //

DELIMITER ;
DELIMITER //

CREATE PROCEDURE delete_supplyorder(
    IN p_supply_order_id INT,
    OUT MESSAGE VARCHAR(255)
)
BEGIN
    DECLARE v_item_id INT;
    DECLARE v_quantity INT;
    DECLARE v_product_id INT;
    DECLARE v_item_index INT DEFAULT 1;
    DECLARE v_num_items INT;
    DECLARE v_order_exists INT;

    -- Check if the supply order exists
    SELECT id INTO v_order_exists
    FROM supplyOrders
    WHERE id = p_supply_order_id;

    IF v_order_exists = 0 THEN
        SET MESSAGE = 'Supply order does not exist';
        LEAVE;
    END IF;

    -- Cursor for iterating through items in the supply order
    DECLARE cur CURSOR FOR 
    SELECT si.item_id, si.item_quantity
    FROM supplyOrders_items si
    WHERE si.supplyOrder_id = p_supply_order_id;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_item_index = -1;

    -- Open the cursor
    OPEN cur;

    -- Loop through each item in the supply order
    item_loop: LOOP
        FETCH cur INTO v_item_id, v_quantity;
        IF v_item_index = -1 THEN
            LEAVE item_loop;
        END IF;

        -- Update product quantity
        UPDATE products p
        JOIN items i ON p.id = i.product_id
        SET p.quantity = p.quantity - v_quantity,
            p.updated_at = CURRENT_TIMESTAMP,
            p.stock_status = IF(p.quantity - v_quantity > 0, 'In Stock', 'Out of Stock')
        WHERE i.id = v_item_id;

        -- Delete the item from the items table
        DELETE FROM items
        WHERE id = v_item_id;

        -- Delete the item from the supplyOrders_items table
        DELETE FROM supplyOrders_items
        WHERE supplyOrder_id = p_supply_order_id AND item_id = v_item_id;

    END LOOP;

    -- Close the cursor
    CLOSE cur;

    -- Delete the supply order
    DELETE FROM supplyOrders
    WHERE id = p_supply_order_id;

    SET MESSAGE = 'Supply order deleted successfully';
END //

DELIMITER ;
