create table orders (
    id serial primary key,
    user_id integer references users(id) not null,
    completed boolean not null default false
);