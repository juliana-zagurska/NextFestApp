'use strict';


let buttonsEnabled = false;
function enableEndDate() {
    document.getElementById('secondDate').disabled = false;
    document.getElementById('preset').disabled = false;
    document.getElementById('display_format').disabled = false;
    enableButtons();
}
function enableButtons() {
    let buttons = document.querySelectorAll('.time__presets button');
    buttons.forEach(function (button) {
        button.removeAttribute('disabled');
    });
    buttonsEnabled = true;
}

document.querySelectorAll('.time__presets button').forEach(function (button) {
    button.addEventListener('mouseover', function () {
        if (!buttonsEnabled) {
            button.style.cursor = 'not-allowed';
        }else{
            button.style.cursor = 'auto';

        }
    });
});

function applyPreset(preset) {
    const startDateString = document.getElementById('firstDate').value;
    // Removing 'active' class from all buttons
    let buttons = document.querySelectorAll('.time__presets button');
    buttons.forEach(function (button) {
        button.classList.remove('active');
    });

    // Adding 'active' class to the clicked button
    event.target.classList.add('active');
    
    if (!startDateString) {
        alert("Please select a start date first.");
        return;
    }

    const startDate = parseDate(startDateString);
    const currentDate = new Date(startDate);

    switch (preset) {
        case 'week':
            // Setting the end date to one week from the start date
            currentDate.setDate(currentDate.getDate() + 8);
            document.getElementById('secondDate').valueAsDate = currentDate;
            break;
        case 'month':
            // Setting the end date to one month from the start date
            currentDate.setMonth(currentDate.getMonth() + 1);
            document.getElementById('secondDate').valueAsDate = currentDate;
            break;
        default:
            console.log('Invalid preset');
    }
}

function parseDate(dateString) {
    let parts = dateString.split('-');
    if (parts.length === 3) {
        let year = parseInt(parts[0], 10);
        let month = parseInt(parts[1], 10) - 1; // zero-based 
        let day = parseInt(parts[2], 10);
        return new Date(year, month, day);
    }
    return null; // Return null for invalid dates
}

let lastResults = JSON.parse(localStorage.getItem('lastResults')) || [];

function getData() {
    let startDateString, endDateString;

    startDateString = document.getElementById('firstDate').value;
    endDateString = document.getElementById('secondDate').value;

    let startDate = parseDate(startDateString);
    let endDate = parseDate(endDateString);

    // Check if the input is valid
    if (!startDate) {
        alert("Invalid start date format. Please use DD.MM.YYYY");
        return;
    }

    // Check if the user has selected a start date before allowing to calculate the difference
    if (!endDate) {
        alert("Please select an end date.");
        return;
    }

    // Calculating the difference in days
    let differenceInMilliseconds = endDate - startDate;
    let differenceInDays = Math.abs(differenceInMilliseconds / (1000 * 60 * 60 * 24));

    let differenceInSeconds = Math.abs(differenceInMilliseconds / 1000);
    let hours = Math.abs(differenceInSeconds / 3600);
    let minutes = Math.abs(differenceInSeconds / 60);

    //console.log("Start Date:", startDateString);
    //console.log("End Date:", endDateString);
   

    let countWeekends = 0;
    let countWeekdays = 0;

    let currentDate = new Date(startDate);

    for (let i = 0; i < differenceInDays; i++) {
        if (isWeekend(currentDate) && document.getElementById('preset').value === 'weekends') {
            countWeekends++;
        } else if (!isWeekend(currentDate) && document.getElementById('preset').value === 'weekdays') {
            countWeekdays++;
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }
    // counts for weekends and weekdays in seconds
    let weekendsInSeconds = countWeekends * 24 * 3600;
    let weekdaysInSeconds = countWeekdays * 24 * 3600;

    // Converting the counts to hours, minutes, and remaining seconds
    let weekendsHours = Math.abs(weekendsInSeconds / 3600);
    let weekendsMinutes = Math.abs(weekendsInSeconds / 60);

    let weekdaysHours = Math.abs(weekdaysInSeconds / 3600);
    let weekdaysMinutes = Math.abs(weekdaysInSeconds/ 60);


    //displaying results

    // Creating a row for the table
    let tableRow = document.createElement("tr");
    let resultBlock = document.createElement("h1");
    resultBlock.id = 'result'; 
    // Creating cells for each column
    let startingDateCell = document.createElement("td");
    let endDateCell = document.createElement("td");
    let resultCell = document.createElement("td");

    // Set the content of each cell
    startingDateCell.textContent = startDateString;
    endDateCell.textContent = endDateString;
    // Set the result content based on the selected display format
    /*switch (document.getElementById('display_format').value) {
        default:
            // Handle invalid display format
            resultCell.textContent = 'Invalid Format';
    }
*/
    


    let presetValue = document.getElementById('preset').value;
    let displayFormatValue = document.getElementById('display_format').value;

    switch (true) {
        case presetValue === 'all' && displayFormatValue === 'days':
            resultBlock.textContent = `Difference in days is ${differenceInDays} days`;
            resultCell.textContent = `${differenceInDays} days`;
            console.log("Difference in Days:", differenceInDays);
            break;

        case presetValue === 'all' && displayFormatValue === 'hours':
             resultBlock.textContent = `Difference in hours is ${hours} hours`;
            resultCell.textContent = `${hours} hours`;
            console.log("Difference in Hours:", hours);
            break;
        case presetValue === 'all' && displayFormatValue === 'minutes':
             resultBlock.textContent = `Difference in minutes is ${minutes} minutes`;
            resultCell.textContent = `${minutes} minutes`;
                console.log("Difference in Minutes:", minutes);
                break;
        case presetValue === 'all' && displayFormatValue === 'seconds':
             resultBlock.textContent = `Difference in seconds is ${differenceInSeconds} seconds`;
            resultCell.textContent = `${differenceInSeconds} seconds`;
            console.log("Difference in Seconds:", differenceInSeconds);
            break;
       
        //weekends
        case presetValue === 'weekends' && displayFormatValue === 'days':
            resultBlock.textContent = `There are ${countWeekends} weekends between selected dates`;
            resultCell.textContent = `${countWeekends} days`;
            console.log("Count Weekends in Days:", countWeekends);
            break;

        case presetValue === 'weekends' && displayFormatValue === 'hours':
            resultBlock.textContent = `Current amount of weekends(${countWeekends}) is equel to ${weekendsHours} hours`;
            resultCell.textContent = `${weekendsHours} hours`;
            console.log("Count Weekends Hours:", weekendsHours);
            break;

        case presetValue === 'weekends' && displayFormatValue === 'minutes':
            resultBlock.textContent = `Current amount of weekends(${countWeekends}) is equel to ${weekendsMinutes} minutes`;
            resultCell.textContent = `${weekendsMinutes} minutes`;
            console.log("Count Weekends Minutes:", weekendsMinutes);
            break;

        case presetValue === 'weekends' && displayFormatValue === 'seconds':
            resultBlock.textContent = `Current amount of weekends(${countWeekends}) is equel to ${weekendsInSeconds} seconds`;
            resultCell.textContent = `${weekendsInSeconds} seconds`;
            console.log("Count Weekends Seconds:", weekendsInSeconds);
            break;
        //weekdays
        case presetValue === 'weekdays' && displayFormatValue === 'days':
            resultBlock.textContent = `There are ${countWeekdays} weekdays between selected dates`;
            resultCell.textContent = `${countWeekdays} days`;
            console.log("Count Weekdays in Days:", countWeekdays);
            break;
        case presetValue === 'weekdays' && displayFormatValue === 'hours':
            resultBlock.textContent = `Current amount of weekdays(${countWeekdays}) is equel to ${weekdaysHours} hours`;
            resultCell.textContent = `${weekdaysHours} hours`;
            console.log("Count Weekdays Hours:", weekdaysHours);
            break;
        case presetValue === 'weekdays' && displayFormatValue === 'minutes':
            resultBlock.textContent = `Current amount of weekdays(${countWeekdays}) is equel to ${weekdaysMinutes} minutes`;
            resultCell.textContent = `${weekdaysMinutes} minutes`;
            console.log("Count Weekdays Minutes:", weekdaysMinutes);
            break;
        case presetValue === 'weekdays' && displayFormatValue === 'seconds':
            resultBlock.textContent = `Current amount of weekdays(${countWeekdays}) is equel to ${weekdaysInSeconds} seconds`;
            resultCell.textContent = `${weekdaysInSeconds} seconds`;
            console.log("Count Weekdays Seconds:", weekdaysInSeconds);
            break;
        default:
            console.log("Invalid combination of preset and display format");
    }
     
    // Update the lastResults array with the new result
    lastResults.unshift({
        startDate: startDateString,
        endDate: endDateString,
        result: resultCell.textContent,
    });
    lastResults = lastResults.slice(0, 10);
    localStorage.setItem('lastResults', JSON.stringify(lastResults));
    updateTableOfContents();

    let existingResultBlock = document.getElementById('result');
        if (existingResultBlock) {
            document.getElementById('result').style.opacity = '1';
            resultBlock.style.opacity = '1';
            existingResultBlock.replaceWith(resultBlock);
            
        } else {
            document.getElementById('result').style.opacity = '1';
            resultBlock.style.opacity = '1';
            document.getElementById('result').appendChild(resultBlock);
            
        }

}
function updateTableOfContents() {
    let table = document.getElementById('results-table') || document.createElement('table');
    table.id = 'results-table';
    table.style.marginTop = '0px';
    table.style.opacity = '1';
    // Clear the existing rows
    table.innerHTML = '';

    // Add a header row
    let headerRow = table.insertRow();
    let headerCell1 = headerRow.insertCell(0);
    let headerCell2 = headerRow.insertCell(1);
    let headerCell3 = headerRow.insertCell(2);
    headerCell1.textContent = 'Start Date';
    headerCell2.textContent = 'End Date';
    headerCell3.textContent = 'Result';

    // Iterate over the lastResults and add rows to the table
    lastResults.forEach((result) => {
        let row = table.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);

        cell1.textContent = result.startDate;
        cell2.textContent = result.endDate;
        cell3.textContent = result.result;
    });

    // If the table is newly created, append it to the document body
    if (!document.getElementById('results-table')) {
        document.body.appendChild(table);
    }
}

function isWeekend(date) {
    return date.getDay() % 6 === 0;
}

const localStorageData = localStorage.getItem('lastResults');

if (!localStorageData) {
    console.log('localStorage is empty or the specific key does not exist');
} else {
    updateTableOfContents();
    console.log('localStorage is not empty');
}
