const apiEndpoint = 'https://graph.adobe.io/api/292bbb8c-7a12-4674-b2fe-870c846d8155/graphql?api_key=c15e2652e6b94af787aa1eae608041a7';

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
