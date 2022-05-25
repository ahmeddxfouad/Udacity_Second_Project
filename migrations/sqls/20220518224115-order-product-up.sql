create table order_product (
    id serial unique not null,
    order_id integer references orders(id) not null,
    product_id integer references products(id) not null,
    quantity integer not null,
    primary key (order_id,product_id)
);