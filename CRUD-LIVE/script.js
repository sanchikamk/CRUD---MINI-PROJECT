const entryForm = document.getElementById('entry-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const entriesList = document.getElementById('entries-list');
const totalIncome = document.getElementById('total-income');
const totalExpense = document.getElementById('total-expenses');
const netBalance = document.getElementById('net-balance');
const resetBtn = document.getElementById('reset-btn');
const filters = document.querySelectorAll('input[name="filter"]');

// Local storage

let entries = JSON.parse(localStorage.getItem('entries')) || [];

function renderEntries (filter='all') {
    entriesList.innerHTML=''; // CLEAR LIST
    let filteredEntries = entries;
    if (filter !== 'all') {
        filteredEntries = entries.filter (entry => entry.type === filter);
    }
    filteredEntries.forEach((entry, index )=> {
        const li = document.createElement('li');
        li.innerHTML = `
        <span>${entry.description}: $${entry.amount} (${entry.type})</span>
        <div>
        <button onclick="editEntry(${index})">Edit</button>
        <button class="delete" onclick="deleteEntry(${index})">Delete</button>
        </div>
        `;
        entriesList.appendChild(li);  
    });
    updateSummary();
}

//Update Summary

function updateSummary() {
    const totalIncomeAmount = entries
    .filter(entry =>entry.type === 'income')
    .reduce((sum,entry) => sum + entry.amount, 0);

    const totalExpenseAmount = entries
    .filter(entry => entry.type === 'expense')
    .reduce ((sum,entry) => sum + entry.amount, 0);

    const netBalanceAmount = totalIncomeAmount - totalExpenseAmount;

    totalIncome.textContent = `$ ${totalIncomeAmount}`;
    totalExpense.textContent = `$ ${totalExpenseAmount}`;
    netBalance.textContent = `$ ${netBalanceAmount}`;

    if (netBalanceAmount < 0) {
        console.warn("Warning: Expenses exceed income!");
        netBalance.innerHTML = `<span style="color: red; font-weight: bold;">⚠ Warning: Expenses exceed income!</span>`;
    }
}

//Add Entry

entryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);
    const type = typeInput.value;

    if (description && amount) {
        entries.push({description, amount, type });
        localStorage.setItem('entries', JSON.stringify(entries));
        renderEntries();
        entryForm.reset();
    }  
});

//Edit Entry

function editEntry(index) {
    const entry = entries[index];
    descriptionInput.value = entry.description;
    amountInput.value = entry.amount;
    typeInput.value = entry.type;
    entries.splice(index, 1);
    localStorage.setItem('entries', JSON.stringify(entries));
    renderEntries();
}

//Delete Entry

function deleteEntry(index) {
    entries.splice(index, 1);
    localStorage.setItem('entries',JSON.stringify(entries));
    renderEntries();
}

//Reset Form

resetBtn.addEventListener('click', () =>{
    console.log("Reset button clicked");
    entryForm.reset();
});

//Filter Entries

filters.forEach(filter => {
    filter.addEventListener('change', () => {
        renderEntries(filter.value);
    });
});

renderEntries();


