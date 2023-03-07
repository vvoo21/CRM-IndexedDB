import './style.css';
import {
  createDB, verifyClient, getCustomers, showCustomers, showNewCustomer, deletecustomer,
} from './modules/functions.js';
import {
  form, customersLink, newCustomerLink, listCustomer,
} from './modules/variables.js';

form.addEventListener('submit', verifyClient);

listCustomer.addEventListener('click', deletecustomer);

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
