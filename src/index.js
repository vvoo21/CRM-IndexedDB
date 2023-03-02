import './style.css';
import { createDB, verifyClient, getCustomers } from './modules/functions.js';
import {
  form, customersLink, newCustomerLink, customerSection, newCustomerSection,
} from './modules/variables.js';

form.addEventListener('submit', verifyClient);

document.addEventListener('DOMContentLoaded', () => {
  createDB();

  if (window.indexedDB.open('crm', 1)) {
    getCustomers();
  }
});

// navigate to the different sections
customersLink.addEventListener('click', () => {
  customerSection.style.display = 'flex';
  newCustomerSection.style.display = 'none';
});

newCustomerLink.addEventListener('click', () => {
  customerSection.style.display = 'none';
  newCustomerSection.style.display = 'flex';
});
