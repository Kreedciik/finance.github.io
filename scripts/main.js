"use strict";

const generateId = () => `ID${Math.round(Math.random()*1e8).toString(8)}`
const overallBalance = document.querySelector('#overallBalance'),
        incomeBalance = document.querySelector('#incomeBalance'),
        outcomeBalance = document.querySelector('#outcomeBalance'),
        operationNameInput = document.querySelector('#operationNameInput'),
        operationAmountInput = document.querySelector('#operationAmountInput'),
        operationAddBtn = document.querySelector('#operationAddBtn'),
        historyList = document.querySelector('#historyList'),
        form = document.querySelector('#form');

//Creating DataBase
let financeDB = {
    balance: 0,
    incomeBalance: 0,
    outcomeBalance: 0,
    operations: JSON.parse(localStorage.getItem('Data')) || []
}



const calcBalance = array => {
    let s = 0;
    if( array.length > 0){
        array.forEach( item => {
            s += item.cost;
        })
    }
    return s;
}

const showInfo = () => {

    let incomeBalanceArray = financeDB.operations.filter( item => item.cost > 0 ),
        outcomeBalanceArray = financeDB.operations.filter( item => item.cost < 0 );
    financeDB.incomeBalance = calcBalance( incomeBalanceArray );
    financeDB.outcomeBalance = calcBalance( outcomeBalanceArray );

    incomeBalance.textContent = financeDB.incomeBalance;
    outcomeBalance.textContent = financeDB.outcomeBalance;
    financeDB.balance = financeDB.incomeBalance + financeDB.outcomeBalance;
    overallBalance.textContent = financeDB.balance;
}

const renderOperation = operation => {
    const listItem = document.createElement('li');
    const amount = operation.cost > 0 ? '+' + operation.cost : operation.cost;
    listItem.classList.add('history__item', 'animate__animated', 'animate__fadeInUp');
    if( amount < 0 ){
        listItem.classList.add('history__item-minus');
    } else {
        listItem.classList.add('history__item-plus');
    }
    listItem.innerHTML = `
    <div class="info">
    <span>${operation.title}</span>
    <span class="history__money">${amount} ₽</span>
    <button class="history_delete" data-id="${operation.id}">x</button>
    </div>
    <div class="date-block">
    <span class="date">${operation.day}.${operation.month}.${operation.year}</span>
    <span class="time">${operation.hour}:${operation.minute}</span>
</div>`;
    historyList.append(listItem);
}
const initHistory = () => {
    localStorage.setItem('Data', JSON.stringify(financeDB.operations));
    historyList.textContent = '';
    financeDB.operations.forEach(renderOperation);
    showInfo();

}

const isValid = () => {
    if( operationNameInput.value && operationAmountInput.value ){
        return true
    } else return false
}
const errorInputs = () => {
    if(!operationNameInput.value){
        operationNameInput.classList.add('error');
    }
    if(!operationAmountInput.value){
        operationAmountInput.classList.add('error');
    }

}
const clearErrorInputs = () => {
    operationNameInput.classList.remove('error');
    operationAmountInput.classList.remove('error');
}

const addZero = item => {
    if( item < 10){
        return ('0' + item)
    } else {
        return item
    }
}

form.addEventListener('submit', e => {
    const date = new Date();
    e.preventDefault();
    const title = operationNameInput.value.length > 20 ? operationNameInput.value.slice(0, 20) + '...': operationNameInput.value;
    const cost = operationAmountInput.value;
    const id = operationNameInput.value;
    if( isValid() ){
        clearErrorInputs();
        const operation = {
            id: generateId(),
            title,
            cost: +cost,
            day: addZero(date.getDate()),
            month: addZero(date.getMonth()),
            year: addZero(date.getFullYear()),
            hour: addZero(date.getHours()),
            minute: addZero(date.getMinutes())
        }
        financeDB.operations.push(operation);
        initHistory();
        form.reset();
    } else {
        errorInputs();
    }

});
operationNameInput.addEventListener('input', e => {
    clearErrorInputs();
});
operationAmountInput.addEventListener('input', e => {
    clearErrorInputs();
});

const deleteOperation = event => {
    const target = event.target;
    if( target.classList.contains(("history_delete"))){
        const deletedElementId = target.dataset.id;
        const updatedOperation = financeDB.operations.filter( item => item.id !== deletedElementId);
        financeDB.operations = updatedOperation;
        initHistory();
    }
}


historyList.addEventListener('click', deleteOperation);

initHistory();
showInfo();