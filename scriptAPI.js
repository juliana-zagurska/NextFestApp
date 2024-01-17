document.getElementById('calculateButton').disabled = true;

function showNextFestContent() {
    document.getElementById('main').style.display = 'none';
    document.getElementById('nextFestContent').style.display = 'block';
}
function showHomeContent() {
    document.getElementById('main').style.display = 'flex';
    document.getElementById('nextFestContent').style.display = 'none';
    document.getElementById('holidaysTable').style.opacity = '1';
}
document.getElementById('year').value = new Date().getFullYear();

let countryInput = document.getElementById('country');
let yearInput = document.getElementById('year');
let calculateButton = document.getElementById('calculateButton');

countryInput.addEventListener('change', function() {
    yearInput.removeAttribute('disabled');
    calculateButton.disabled = false;
    fillYearOptions();
});


function fillYearOptions() {
    let currentYear = new Date().getFullYear();
    let startYear = 2001;
    let endYear = 2049;

    yearInput.innerHTML = '';

    for (let year = startYear; year <= endYear; year++) {
        let option = document.createElement('option');
        option.value = year;
        option.text = year;
        yearInput.appendChild(option);
    }
    yearInput.selectedIndex = currentYear - startYear;
}

// Отримуємо посилання на елемент таби
const tabLink = document.querySelector('.header-nav a[href="#check-fest"]');

// Додаємо обробник подій для події 'click'
tabLink.addEventListener('click', function(event) {
  event.preventDefault();

  fetchCountries();
});

// Функція для виконання запиту на список країн
function fetchCountries() {
  const apiKey = '9fXqq1JMFJtMEYJ89zKZM9xeDl5N8odn';
  const countriesEndpoint = 'https://calendarific.com/api/v2/countries';

  // Виконуємо AJAX-запит на ендпоїнт країн
  fetch(`${countriesEndpoint}?api_key=${apiKey}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Отримуємо список країн з відповіді API
      const countryList = data.response.countries;
      console.log(countryList);
      // Використовуйте цей список для створення опцій для першого інпуту 'Вибір країни'
      populateCountryDropdown(countryList);
    })
    .catch(error => console.error('Error:', error));
}

// Функція для заповнення опцій першого інпуту 'Вибір країни'
function populateCountryDropdown(countries) {
    const countrySelect = document.getElementById('country');
  
    // Clear current options
    countrySelect.innerHTML = '';
  
    // Перевірка чи є країни 
    if (countries.length > 0) {
      // Add new options from the list of countries
      countries.forEach(country => {
        const option = document.createElement('option');
        //option.value = country.iso_alpha2;
        option.value = country["iso-3166"];
        option.textContent = country.country_name;
        countrySelect.appendChild(option);
      });
    } else {
      // На випадок якщо немає країн до відображення у відповідь 
      console.error('No countries found in the response.');
    }
  }
  

function showHolidays() {
    const country = document.getElementById('country').value;
    const year = document.getElementById('year').value;
    let table = document.getElementById('holidaysTable') || document.createElement('holidaysTable');
    table.style.opacity = '1';
    //const country = 'CZ'; // Replace with the desired country code
    //const year = 2023; 

    console.log('selected country index is :',country);
    // Отримання свят через API
    fetchHolidays(country, year)
        .then(data => {
            displayHolidaysTable(data);
            console.log("data",data);
        })
        .catch(error => {
            displayError(error);
        });
}

function fetchHolidays(country, year) {
    const apiKey = '9fXqq1JMFJtMEYJ89zKZM9xeDl5N8odn';
    const holidaysEndpoint = `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=${country}&year=${year}`;

    return fetch(holidaysEndpoint)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        });
}

function displayHolidaysTable(data) {
    const holidaysTable = document.getElementById('holidaysTable');
    // Очистка поточного вмісту таблиці
    holidaysTable.innerHTML = '';
    //console.log("data", data);
    // Перевірка, чи існує data.response.holidays
    if (data && data.response && data.response.holidays) {
        // Створення таблиці та заголовків
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        const dateHeader = document.createElement('th');
        const nameHeader = document.createElement('th');

        dateHeader.textContent = 'Date';
        nameHeader.textContent = 'Holiday Name';

        tr.appendChild(dateHeader);
        tr.appendChild(nameHeader);
        thead.appendChild(tr);
        table.appendChild(thead);

        // Додавання свят до таблиці
        const tbody = document.createElement('tbody');
        
        // Виклик forEach лише якщо data.response.holidays існує
        data.response.holidays.forEach(holiday => {
            const tr = document.createElement('tr');
            const dateCell = document.createElement('td');
            const nameCell = document.createElement('td');

            dateCell.textContent = holiday.date.iso;
            nameCell.textContent = holiday.name;

            tr.appendChild(dateCell);
            tr.appendChild(nameCell);
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        holidaysTable.appendChild(table);
    } else {
        // Виведення повідомлення, якщо data.response.holidays не існує
        holidaysTable.innerHTML = '<p class="error-message">No holidays data available.</p>';
    }
}


function displayError(error) {
    // Виведення повідомлення про помилку
    const holidaysTable = document.getElementById('holidaysTable');
    holidaysTable.innerHTML = `<p class="error-message">${error.message}</p>`;
}


// Додаємо обробник подій для кнопки "Calculate"
document.getElementById('calculateButton').addEventListener('click', showHolidays);

/*------------------------------SORTING --------------------------*/
let currentSortOrder = 'ascending'; // Default sorting order

document.getElementById('sortButton').addEventListener('click', function () {
    console.log('Button Clicked!');
    sortHolidaysByDate();
});

function sortHolidaysByDate() {
    const tbody = document.querySelector('#holidaysTable tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const dateA = new Date(a.cells[0].textContent);
        const dateB = new Date(b.cells[0].textContent);

        if (currentSortOrder === 'ascending') {
            return dateA - dateB;
        } else {
            return dateB - dateA;
        }
    });

    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));

    // Toggle
    currentSortOrder = currentSortOrder === 'ascending' ? 'descending' : 'ascending';
}
