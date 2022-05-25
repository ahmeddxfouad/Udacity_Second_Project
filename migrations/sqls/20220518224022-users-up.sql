create type user_role as ENUM('admin','user');

create table users (
    id serial primary key,
    fname varchar not null,
    lname varchar not null,
    username varchar unique not null,
    password varchar not null,
    role user_role not null default 'user'
);