# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## Setup

### Database Configuration
## .env File
- POSTGRES_HOST
- POSTGRES_DB
- POSTGRES_USER
- POSTGRES_PASSWORD
- NODE_ENV (dev, test)
- BCRYPT_SECRET
- SALT_ROUNDS
- TOKEN_SECRET

### Database Schema
#### Products
- id (Primary Key)
- name
- price
- category

#### Users
- id (Primary Key)
- username
- firstName
- lastName
- password
- role

#### Orders
- id (Primary Key)
- user_id (Refrenced from Users table)
- completed (status of order (true = complete or false = active)

### Order Product
- id 
- order_id (Refrenced from Orders table, part of composite key)
- product_id (Refrenced from Products table, part of composite key)
- quantity

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
```

To create the tables and schema
```
npm run devup
```

To undo the creation of the tables and schema
```
npm run devdown
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
```

## Author
<sup>Ahmed Fouad 

### Acknowledgments
- sharp docs https://sharp.pixelplumbing.com/api-input#metadata
- eslint docs https://eslint.org/docs/user-guide/command-line-interface
