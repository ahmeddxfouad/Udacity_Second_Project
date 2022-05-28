# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## Setup

### Database Configuration
## Database Port
- Database is running on default port 5432
## .env File
- POSTGRES_HOST
- POSTGRES_DB
- POSTGRES_TESTDB
- POSTGRES_USER
- POSTGRES_PASSWORD
- NODE_ENV (dev, test)
- BCRYPT_SECRET
- SALT_ROUNDS
- TOKEN_SECRET

<<<<<<< HEAD
## Running Options
- Run your app first on the testing enviroment by changing the NODE_ENV in the .env file to be test.
- Run your app on the development phase after checking that everything is correct by changing the NODE_ENV in the .env file to be dev.
### Database Schema
#### Products
Name  | Type
------------- | -------------
id  | number (Primary Key)
name  | varchar
price  | integer
category  | varchar

#### Users
create type user_role as ENUM('admin','user');
Name  | Type
------------- | -------------
id  | integer (Primary Key)
username  | varchar
fname  | varchar
lname  | varchar
password  | varchar
role  | user_role

#### Orders
Name  | Type
------------- | -------------
id  | number (Primary Key)
user_id  | integer (references users(id))
completed  | boolean

### Order Product
primary key (order_id,product_id)
Name  | Type
------------- | -------------
id  | number (Primary Key)
order_id  | integer references orders(id) 
product_id  | integer references products(id)
quantity  | integer

=======
## Getting Started
- Base URL: The app is hosted locally at 'http://172.0.0.1:3000'

## Returned Error Codes
- 400: Bad Request
- 401: Not Authorized
- 404: Not Found
- 500: Internal Server Error

## API Endpoints
#### Products
- Index ('/products') [GET] 
- Show  ('/products/:id') [GET] 
- Create ('/products') [token required] [POST] 

#### Users
- Index ('/users') [token required] [GET] 
- Show  ('/users/:id') [token required] [GET] 
- Create ('/users') [token required] [POST] 

#### Orders
- Index ('/orders') [token required] [GET] 
- Show ('/orders/:id') [token required] [GET] 
- Create Order ('/orders') [token required] [POST] 
- Add Product ('/orders/:id') [token required] [POST] 
- Current Order by user ('/users/:userId/orders') (args: user id) [token required] [GET] 

## Setting Up
First Connect to pgsql,
Then to create the Database
```
CREATE DATABASE store;
<<<<<<< HEAD
CREATE DATABASE teststore;
=======
>>>>>>> refs/remotes/origin/main
```

To create the tables and schema
```
npm run devup
npm run testup "For testing enviroment"
```

To undo the creation of the tables and schema
```
npm run devdown
npm run testdown "For testing enviroment"
```

## Running
To run the code, run
```
npm run start
```

## Testing
Testing is done using jasmine
To run the tests, run
```
npm run test
npm run testing "For testing enviroment"
```

## Author
<sup>Ahmed Fouad 

### Acknowledgments
- sharp docs https://sharp.pixelplumbing.com/api-input#metadata
- eslint docs https://eslint.org/docs/user-guide/command-line-interface
<<<<<<< HEAD

=======
>>>>>>> refs/remotes/origin/main
