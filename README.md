# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## Getting Started
- Base URL: The app is hosted locally at 'http://172.0.0.1:3000'

## Returned Error Codes
- 400: Bad Request
- 401: Not Authorized
- 404: Not Found
- 500: Internal Server Error

## API Endpoints
#### Products
- Index ('/products')
- Show  ('/products/:id')
- Create ('/products') [token required] 

#### Users
- Index ('/users') [token required] 
- Show  ('/users/:id') [token required] 
- Create ('/users') [token required]

#### Orders
- Index ('/orders') [token required]
- Show ('/orders/:id') [token required]
- Create Order ('/orders') [token required]
- Add Product ('/orders/:id') [token required]
- Current Order by user ('/users/:userId/orders') (args: user id) [token required]

## Data Shapes
#### Product
-  id
- name
- price
- [OPTIONAL] category

#### User
- id
- username
- firstName
- lastName
- password
- role

#### Orders
- id
- user_id
- status of order (active or complete)

#### order product
- id
- order_id
- product_id
- quantity

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
