-------indexes_on_users_table--------
CREATE index name_index on users(first_name,last_name);
CREATE index username_index on users(username);
CREATE index email_index on users(email);   
CREATE index contact_index on users(contact);
CREATE index address_index on users(address);
CREATE index date_index on users(created_at);   

--------indexes_on_products_table---------

CREATE index product_name_index on products(name);
CREATE index price_index on products(unit_price);
CREATE index date_index on products(created_at);

--------- indexes_on_sales_table----------

CREATE index total_amount_index on sales(total_amount);
CREATE index date_index on sales(created_at);

---------indexes_on_sales_product_table--------

CREATE index unit_price_index on sales_products(unit_price);
CREATE index quantity_price_index on sales_products(quantity_price);
CREATE index date_index on sales_products(created_at);

-------indexes on Items table-------

CREATE index item_name_index on items(item_name); 


