# Shopping cart application in React and Strapi

This is an exercise as part of Module 19 of MIT xPro Full Stack Bootcamp

Our assignment for this exercise is to implement a restocking feature for a React shopping cart application. This feature will allow users to easily view available items in the shopping cart and restock them when needed.

Demo: https://smoltypo.github.io/React-Shopping-Cart/

## About:

React is used to create the user interface and manage the state of the shopping cart application. Strapi is used to store the back-end data, such as the list of available products. When the user clicks the “Re-Stock Products” button, a call is made to the Strapi back end, and the response is used to update the shopping cart with the new products. 

Here’s how the reset stock feature works:

- There’s an input field on the page that contains the URL to the Strapi back end
- When a user clicks the “Re-Stock Products” button, a call is made to the Strapi back end specified in the input field
- The result of this call is an updated list of products

## Future Roadmap

1. Add functionality to allow users to specify the quantity of products they would like to restock.
2. Add functionality to allow users to select specific products to restock.


## Screenshot:
<img src="https://github.com/smolTypo/React-Shopping-Cart/blob/main/ShoppingCart.png" width="500"/>


## License:

This project is licensed under the terms of the <a href="https://github.com/smolTypo/React-Shopping-Cart/blob/main/LICENSE">MIT License</a>.
