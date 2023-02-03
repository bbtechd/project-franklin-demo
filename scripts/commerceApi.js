// Adobe Commerce/Magento GraphQL Api endpoint
const apiEndpoint = 'https://graph.adobe.io/api/a05f92bc-1f47-4272-ba64-e3cadbd593bd/graphql?api_key=8acda61db16c4d3da63c6a9f31d02913';

/**
 * get customer authorization token
 * @param {string} email
 * @param {string} password
 * @returns {Promise<token>}
 */
export async function getCustomerToken(email, password) {
  try {
    const query = `
      mutation ($email: String!, $password: String!) {
        generateCustomerToken(
          email: $email
          password: $password
        ) {
          token
        }
      }
    `;
    const res = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          email,
          password,
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`request to ${apiEndpoint} failed with status code ${res.status}`);
    }

    const content = await res.json();

    const { token } = content.data.generateCustomerToken;
    if (!token) {
      const { message } = content.errors[0];
      throw new Error(message);
    } else {
      return token;
    }
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * get cart-Id and items in customer cart
 * @param {string} token
 * @returns {Promise<*>}
 */
export async function getCustomerCart(token) {
  try {
    const query = `
      {
        customerCart {
          id
          items {
            id
            product {
              name
              sku
            }
            quantity
          }
        }
      }
    `;

    // fetch content from external api endpoint
    const res = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query,
      }),
    });

    if (!res.ok) {
      throw new Error(`request to ${apiEndpoint} failed with status code ${res.status}`);
    }

    const content = await res.json();

    if (content.errors) {
      const { message } = content.errors[0];
      throw new Error(message);
    } else {
      return content.data;
    }
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * add product(s) to commerce/magento cart
 * @param {string} token
 * @param {string} cartId
 * @param {number} quantity
 * @param {string} sku
 * @returns {Promise<*>}
 */
export async function addProductToCart(token, cartId, quantity, sku) {
  try {
    const query = `
      mutation ($cartId: String!, $sku: String!, $quantity: Integer!){
        addSimpleProductsToCart(
          input: {
            cart_id: $cartId
            cart_items: [
              {
                data: {
                  quantity: $quantity
                  sku: $sku
                }
              }
            ]
          }
        ) {
          cart {
            items {
              id
              product {
                sku
                stock_status
              }
              quantity
            }
          }
        }
      }
    `;

    // fetch content from external api endpoint
    const res = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query,
        variables: {
          cartId,
          quantity,
          sku,
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`request to ${apiEndpoint} failed with status code ${res.status}`);
    }

    const content = await res.json();

    if (content.errors) {
      const { message } = content.errors[0];
      throw new Error(message);
    } else {
      return content.data;
    }
  } catch (error) {
    throw new Error(error);
  }
}
