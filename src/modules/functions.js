import {
  form, customerSection, newCustomerSection, listCustomer, 
  nameInput, emailInput, phoneInput, companyInput, paragraphNoCustomers
} from './variables.js';

let dataBase;
let idCustomer;
let editing;

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

export const showNewCustomer = () => {
  customerSection.style.display = 'none';
  newCustomerSection.style.display = 'flex';
}

export const showCustomers = () => {
  customerSection.style.display = 'flex';
  newCustomerSection.style.display = 'none';
}

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
      showCustomers
      location.reload();
    }, 2000);
  };
};

export const verifyClient = (e) => {
  e.preventDefault();

  if (nameInput.value === '' || emailInput.value === '' || phoneInput.value === '' || companyInput.value === '') {
    printAlert('All fields are required', 'error');
    return;
  }

  if(editing) {

    const updatedCustomer = {
      name: nameInput.value,
      email: emailInput.value,
      company: companyInput.value,
      phone: phoneInput.value,
      id: idCustomer
  };

    // Edit in the indexedDB
    const transaction = dataBase.transaction(['crm'], 'readwrite');

    const objectStore = transaction.objectStore('crm');

    objectStore.put(updatedCustomer);

    transaction.oncomplete = () => {
      printAlert('Edited correctly');

      setTimeout(() => {
        customerSection.style.display = 'flex';
        newCustomerSection.style.display = 'none';
        location.reload();
      }, 2000);

      // Return the button text to its original state
      document.querySelector('.btnSubmit').value = 'Add Customer';

      // Remove edit mode
      editing = false;
    }
  } else {

    // create an object with the information
    const customer = {
      name: nameInput.value,
      email: emailInput.value,
      phone: phoneInput.value,
      company: companyInput.value,
    };

    customer.id = Date.now();

    createNewCustomer(customer);

  }
};

export const getId = () => { 

  const transaction = dataBase.transaction(['crm'], 'readwrite');
  const objectStore = transaction.objectStore('crm');
  const request = objectStore.openCursor();

  request.onsuccess = function(event) {
    const cursor = event.target.result;
    if (cursor) {

      showNewCustomer();

      idCustomer = Number(window.location.href.slice(23, 36));
  
        if(cursor.value.id  === idCustomer ) {

          nameInput.value = cursor.value.name;
          emailInput.value = cursor.value.email;
          phoneInput.value = cursor.value.phone;
          companyInput.value = cursor.value.company;
        }
      cursor.continue();          
    }
  }
}

export const getCustomers = () => {
  cleanHTML();
  
  const data = window.indexedDB.open('crm', 1);

  data.onerror = () => 'There was an error';

  data.onsuccess = () => {
    dataBase = data.result;

    const objectStore = dataBase.transaction('crm').objectStore('crm');
    
    const total = objectStore.count();

    objectStore.openCursor().onsuccess = (e) => {
      const cursor = e.target.result;

      if(total.result > 0) {
        paragraphNoCustomers.textContent = '';
      } else {
        paragraphNoCustomers.textContent = 'No Customers'
      }

      if (cursor) {
        const {
          name, email, phone, company, id,
        } = cursor.value;

        const tr = document.createElement('tr');
        listCustomer.appendChild(tr);

        const td1 = document.createElement('td');
        td1.classList.add('px-6', 'py-4', 'whitespace-no-wrap', 'border-b', 'border-gray-200');
        tr.appendChild(td1);

        const paragraphName = document.createElement('p');
        paragraphName.classList.add('text-sm', 'leading-5', 'font-medium', 'text-gray-700', 'text-lg',  'font-bold');
        paragraphName.textContent = name;
        td1.appendChild(paragraphName);

        const paragraphEmail= document.createElement('p');
        paragraphEmail.classList.add('text-sm', 'leading-10', 'text-gray-700');
        paragraphEmail.textContent = email;
        td1.appendChild(paragraphEmail);

        const td2 = document.createElement('td');
        td2.classList.add('px-6', 'py-4', 'whitespace-no-wrap', 'border-b', 'border-gray-200');
        tr.appendChild(td2);

        const paragraphPhone= document.createElement('p');
        paragraphPhone.classList.add('text-gray-700');
        paragraphPhone.textContent = phone;
        td2.appendChild(paragraphPhone);

        const td3 = document.createElement('td');
        td3.classList.add('px-6', 'py-4', 'whitespace-no-wrap', 'border-b', 'border-gray-200', 'leading-5', 'text-gray-700');
        tr.appendChild(td3);

        const paragraphCompany= document.createElement('p');
        paragraphCompany.classList.add('text-gray-600');
        paragraphCompany.textContent = company;
        td3.appendChild(paragraphCompany);

        const td4 = document.createElement('td');
        td4.classList.add('px-6', 'py-4', 'whitespace-no-wrap', 'border-b', 'border-gray-200', 'leading-5', 'text-sm');
        tr.appendChild(td4);

        const editBtn = document.createElement('a');
        editBtn.setAttribute('href', `#${id}`);
        editBtn.classList.add('text-teal-600', 'hover:text-teal-900', 'mr-5', 'editBtn');
        editBtn.textContent = 'Edit';

        editBtn.onclick = () => {
          document.querySelector('.btnSubmit').value = 'Edit Customer';
          editing = true;

          getId();
        }
        td4.appendChild(editBtn);

        const deleteBtn = document.createElement('a');
        deleteBtn.setAttribute('href', '#');
        deleteBtn.setAttribute('data-cliente', id);
        deleteBtn.classList.add('text-red-600', 'hover:text-red-900');
        deleteBtn.textContent = 'Delete';

        deleteBtn.onclick = () => deletecustomer(id);

        td4.appendChild(deleteBtn);

        cursor.continue();
      }
    };
  };
};

export const deletecustomer = (id) => {
  const transaction = dataBase.transaction(['crm'], 'readwrite');

  const objectStore = transaction.objectStore('crm');

  objectStore.delete(id);

  transaction.oncomplete = () => {
    printAlert('The customer was deleted successfully');

    getCustomers();
  };

  transaction.onerror = () => {
    return 'TThere was an error'
  };
}

export const cleanHTML = () => {
  while (listCustomer.firstChild) {
    listCustomer.removeChild(listCustomer.firstChild);
  }
}
