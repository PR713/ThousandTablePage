const table = document.getElementById('table');
const btnAddRows = document.getElementById('add-rows');
const inputEl = document.getElementById('input-num-of-players');
const sumDisplay = document.getElementById('sum-display');
const sumsText = document.getElementById('sums-text');
const clearBtn = document.getElementById('clear-btn');
let lastClickTime = 0;
let lastClickTime1 = 0;
const doubleClickThreshold = 1500;

window.addEventListener('load', () => {
    loadTableFromLocalStorage();
});


btnAddRows.addEventListener('click', () => {
    const numOfPlayers = inputEl.value;
    if (numOfPlayers === '' || numOfPlayers <= 0) {
        alert('Please enter a valid number of players');
        return; //if no input or <= 0, do nothing
    }

    addRow(numOfPlayers);
    saveTableToLocalStorage();
})

clearBtn.addEventListener('click', () => { //dblclick
    //on mobiles is not possible... so
    const currentTime = new Date().getTime(); //from 1970

    if (currentTime - lastClickTime < doubleClickThreshold) {
        //if it is first click for sure it won't be called
        localStorage.clear();
        table.innerHTML = '';
        inputEl.value = '';
        sumDisplay.innerHTML = '';
        sumsText.style.display = 'none';
        sumDisplay.style.display = 'none';
    }

    lastClickTime = currentTime;
})


function addRow(numOfPlayers) {
    let row = document.createElement('tr')

    for (let i = 0; i < numOfPlayers; i++) {
        let cell = document.createElement('td');
        let input = document.createElement('input');
        input.type = 'text';

        if (table.rows.length === 0) {
            input.placeholder = `Player ${i + 1}`;
            input.addEventListener('input', () => {
                saveTableToLocalStorage();
            });
        } else {
            input.addEventListener('input', () => {
                updateSums();
                saveTableToLocalStorage();
            });
        }

        cell.appendChild(input);
        row.appendChild(cell);
    }

    if (table.rows.length > 0) { //below if is appendChild(row)
        let deleteCell = document.createElement('td');
        let deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'X';
        deleteButton.style.fontSize = 14 + 'px';
        deleteButton.style.backgroundColor = '#ff4444';

        deleteButton.addEventListener('click', () => {
            const currentTime = new Date().getTime(); //from 1970
            if (currentTime - lastClickTime1 < doubleClickThreshold) {
                row.remove();
                updateSums();
                saveTableToLocalStorage();
            }

            lastClickTime1 = currentTime
        });

        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);
    }

    table.appendChild(row);
}


function updateSums() {
    const rows = table.getElementsByTagName('tr');
    sums = new Array(Number(inputEl.value)).fill(0);
    sumsText.style.display = 'block';
    sumDisplay.style.display = 'table';


    for (let i = 1; i < rows.length; i++){
        const cells = rows[i].getElementsByTagName('td');
        for (let j = 0; j < cells.length - 1; j++){
            const input = cells[j].getElementsByTagName('input')[0];
            let inputVal = input.value.trim();

            if (inputVal === '') continue;

            const parsedValue = Number(inputVal);

            if (!isNaN(parsedValue)) {
                sums[j] += parsedValue;
            } else {
                sums[j] += 0;
            }
        }
    }

    displaySums(sums);
}

function displaySums(sums) {
    const numOfPlayers = Number(inputEl.value);
    let html = '<tr>';

    for (let i = 0; i < numOfPlayers; i++) {
        html += `<td>${sums[i]}</td>`;
    }

    html += '</tr>';

    sumDisplay.innerHTML = html;
}


function saveTableToLocalStorage() {
    const rows = table.getElementsByTagName('tr');
    const data = [];

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        const rowData = [];

        for (let j = 0; j < cells.length - 1; j++) {
            const input = cells[j].getElementsByTagName('input')[0];
            rowData.push(input.value);
        }

        data.push(rowData);
    }

    localStorage.setItem('tableData', JSON.stringify(data));
    localStorage.setItem('numOfPlayers', inputEl.value);
}


function loadTableFromLocalStorage() {
    const tableData = JSON.parse(localStorage.getItem('tableData'));
    const numOfPlayers = localStorage.getItem('numOfPlayers');

    if (tableData && numOfPlayers && numOfPlayers > 0) { //available and num > 0
        //earlier checked where that function and save function are called,
        //so this is for care
        inputEl.value = numOfPlayers;

        for (let rowIndex = 0; rowIndex < tableData.length; rowIndex++) {
            addRow(numOfPlayers);

            const cells = table.rows[rowIndex].getElementsByTagName('td');

            for (let colIndex = 0; colIndex < cells.length - 1; colIndex++) {
                const input = cells[colIndex].getElementsByTagName('input')[0];
                input.value = tableData[rowIndex][colIndex];
            }
        }
        updateSums();
    }
}
