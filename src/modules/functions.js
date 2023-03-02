import {
  form, customerSection, newCustomerSection, listCustomer,
} from './variables.js';

let dataBase;

export const createDB = () => {
  const createDB = window.indexedDB.open('crm', 1);

  createDB.onerror = () => 'There was an error';

  createDB.onsuccess = () => {
    dataBase = createDB.result;
  };

  createDB.onupgradeneeded = (e) => {
    const db = e.target.result;

    const objectStore = db.createObjectStore('crm', {
      keyPath: 'id',
      autoIncrement: true,
    });

    objectStore.createIndex('name', 'name', { unique: false });
    objectStore.createIndex('email', 'email', { unique: true });
    objectStore.createIndex('phone', 'phone', { unique: false });
    objectStore.createIndex('company', 'company', { unique: false });
    objectStore.createIndex('id', 'id', { unique: true });
  };
};

export const printAlert = (message, type) => {
  const alert = document.querySelector('.alert');

  if (!alert) {
    const divMessage = document.createElement('div');
    divMessage.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alert');

    if (type === 'error') {
      divMessage.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
    } else {
      divMessage.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
    }

    divMessage.textContent = message;

    form.appendChild(divMessage);

    setTimeout(() => {
      divMessage.remove();
    }, 3000);
  }
};

export const createNewCustomer = (customer) => {
  const transaction = dataBase.transaction(['crm'], 'readwrite');

  const objectStore = transaction.objectStore('crm');

  objectStore.add(customer);

  transaction.onerror = () => {
    printAlert('There was an error', 'error');
  };

  transaction.oncomplete = () => {
    printAlert('Added successfully');

    setTimeout(() => {
      customerSection.style.display = 'flex';
      newCustomerSection.style.display = 'none';
    }, 2000);
  };
};

export const verifyClient = (e) => {
  e.preventDefault();

  const name = document.querySelector('#name').value;
  const email = document.querySelector('#email').value;
  const phone = document.querySelector('#phone').value;
  const company = document.querySelector('#company').value;

  if (name === '' || email === '' || phone === '' || company === '') {
    printAlert('All fields are required', 'error');
    return;
  }

  // create an object with the information
  const customer = {
    name,
    email,
    phone,
    company,
  };

  customer.id = Date.now();

  createNewCustomer(customer);
};

export const getCustomers = () => {
  const data = window.indexedDB.open('crm', 1);

  data.onerror = () => 'There was an error';

  data.onsuccess = () => {
    dataBase = data.result;

    const objectStore = dataBase.transaction('crm').objectStore('crm');

    objectStore.openCursor().onsuccess = (e) => {
      const cursor = e.target.result;

      if (cursor) {
        const {
          name, email, phone, company, id,
        } = cursor.value;

        listCustomer.innerHTML += `
          <tr>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${name} </p>
              <p class="text-sm leading-10 text-gray-700"> ${email} </p>
            </td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
              <p class="text-gray-700">${phone}</p>
            </td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
              <p class="text-gray-600">${company}</p>
            </td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
              <a href="#" class="text-teal-600 hover:text-teal-900 mr-5">Edit</a>
              <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900">Delete</a>
            </td>
          </tr>
        `;

        cursor.continue();
      }
    };
  };
};
