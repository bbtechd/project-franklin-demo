const apiEndpoint = 'https://graph.adobe.io/api/a05f92bc-1f47-4272-ba64-e3cadbd593bd/graphql?api_key=8acda61db16c4d3da63c6a9f31d02913';

// eslint-disable-next-line import/prefer-default-export
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

    // fetch content from external api endpoint
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
