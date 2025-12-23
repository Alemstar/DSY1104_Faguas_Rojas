const baseUrl = 'https://localhost:7270';

/**
 * Fetches the cart for a specific customer.
 * @param {number} idCart - The ID of the cart to fetch.
 * @returns {Promise<Object>} - The cart data.
 */
export const getCart = async (idCart) => {
  try {
    const response = await fetch(
      `${baseUrl}/api/Cart/getCartById/${idCart}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching cart: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in getCart:', error);
    throw error;
  }
};

/**
 * Creates a new cart for a customer.
 * @param {number} idCustomer - The ID of the customer.
 * @returns {Promise<Object>} - The created cart data.
 */
export const createCart = async (idCustomer) => {
  try {
    const response = await fetch(
      `${baseUrl}/api/Cart/insertCart/${idCustomer}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error creating cart: ${response.statusText}`);
    }

    const data = await response.text();
    return data;
  } catch (error) {
    console.error('Error in createCart:', error);
    throw error;
  }
};

/**
 * Adds a product to the cart.
 * @param {number} idProduct - The ID of the product to add.
 * @param {number} idCart - The ID of the cart.
 * @returns {Promise<Object>} - The response data.
 */
export const addProductToCart = async (idProduct, idCart) => {
  try {
    const response = await fetch(
      `${baseUrl}/api/Cart/insertProduct/${idProduct}/${idCart}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error adding product to cart: ${response.statusText}`);
    }

    const data = await response.text();
    return data;
  } catch (error) {
    console.error('Error in addProductToCart:', error);
    throw error;
  }
};

/**
 * Removes a product from the cart.
 * @param {string} productName - The name of the product to remove.
 * @param {number} idCart - The ID of the cart.
 * @returns {Promise<Object>} - The response data.
 */
export const removeProductFromCart = async (productName, idCart) => {
  try {
    const response = await fetch(
      `${baseUrl}/api/Cart/deleteProduct/${productName}/${idCart}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error removing product from cart: ${response.statusText}`);
    }

    const data = await response.text();
    return data;
  } catch (error) {
    console.error('Error in removeProductFromCart:', error);
    throw error;
  }
};
