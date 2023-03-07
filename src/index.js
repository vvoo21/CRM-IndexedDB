import './style.css';
import {
  createDB, verifyClient, getCustomers, showCustomers, showNewCustomer,
} from './modules/functions.js';
import {
  form, customersLink, newCustomerLink,
} from './modules/variables.js';

form.addEventListener('submit', verifyClient);

document.addEventListener('DOMContentLoaded', () => {
  createDB();

  getCustomers();
});

// navigate to the different sections
customersLink.addEventListener('click', () => {
  showCustomers();
});

newCustomerLink.addEventListener('click', () => {
  showNewCustomer();
});
