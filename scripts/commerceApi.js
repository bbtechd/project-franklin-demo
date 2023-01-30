const apiEndpoint = 'https://demo.met-instances.tdintern.de/graphql';

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
