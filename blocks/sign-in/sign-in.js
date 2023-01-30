import { getCustomerToken } from '../../scripts/commerceApi.js';

export default async function decorate(block) {
  const signInContainer = document.createElement('div');
  signInContainer.classList.add('sign-in');

  // Form
  const signInForm = document.createElement('form');
  signInContainer.append(signInForm);

  // Fieldset
  const signInFieldset = document.createElement('fieldset');
  signInFieldset.classList.add('sign-in-fieldset');
  signInFieldset.disabled = true;
  signInForm.append(signInFieldset);

  // Email
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  emailInput.placeholder = 'E-mail';
  emailInput.required = true;
  signInFieldset.append(emailInput);

  // Password
  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.name = 'password';
  passwordInput.placeholder = 'Password';
  emailInput.required = true;
  signInFieldset.append(passwordInput);

  // Button
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.innerText = 'Sign-In';
  signInFieldset.append(submitButton);

  // Error
  const errorContainer = document.createElement('div');
  errorContainer.classList.add('sign-in-fieldset-error');

  function resetError() {
    errorContainer.remove();
  }

  function setError(message) {
    errorContainer.innerText = message;
    signInFieldset.append(errorContainer);
  }

  // Sign-Out
  const signOutContainer = document.createElement('div');
  signOutContainer.classList.add('sign-out');

  // Form
  const signOutForm = document.createElement('form');
  signOutContainer.append(signOutForm);

  // Button
  const signOutButton = document.createElement('button');
  signOutButton.type = 'submit';
  signOutButton.innerText = 'Sign-Out';
  signOutForm.append(signOutButton);

  function toggleSignIn() {
    const token = localStorage.getItem('token');
    if (token) {
      signInContainer.remove();
      block.append(signOutContainer);
    } else {
      block.append(signInContainer);
      signOutContainer.remove();
    }
  }

  toggleSignIn();

  signInFieldset.disabled = false;

  // SignIn Method
  signInForm.onsubmit = async (event) => {
    event.preventDefault();
    resetError();

    const formData = new FormData(event.currentTarget);
    const {
      email,
      password,
    } = Object.fromEntries(formData);

    try {
      const token = await getCustomerToken(email, password);
      localStorage.setItem('token', token);
    } catch (error) {
      setError(error);
      errorContainer.innerText = error;
    }
  };

  // SignOUt Method
  signOutForm.onsubmit = (event) => {
    event.preventDefault();
    localStorage.removeItem('token');
  };
}
