'use strict'

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-01-07T17:01:17.194Z',
    '2022-01-09T23:36:17.929Z',
    '2022-01-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

//Elements

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance_value');
const labelSumIn = document.querySelector('.summary_value-in');
const labelSumOut = document.querySelector('.summary_value-out');
const labelSumInterest = document.querySelector('.summary_value-interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login_btn');
const btnTransfer = document.querySelector('.form_btn-transfer');
const btnLoan = document.querySelector('.form_btn-loan');
const btnClose = document.querySelector('.form_btn-close');
const btnSort = document.querySelector('.btn-sort');

const inputLoginUsername = document.querySelector('.login_input-user');
const inputLoginPin = document.querySelector('.login_input-pin');
const inputTransferTo = document.querySelector('.form_input-to');
const inputTransferAmount = document.querySelector('.form_input-amount');
const inputLoanAmount = document.querySelector('.form_input-loan-amount');
const inputCloseUsername = document.querySelector('.form_input-user');
const inputClosePin = document.querySelector('.form_input-pin');

//FUNCTIONS

const formatMovementDate = function (date, locale) {

  const calcDaysPassed = (date1, date2) => Math.abs(date2 - date1) / (1000 * 24 * 60 * 60);

  const daysPassed = Math.floor(calcDaysPassed(new Date(), date));
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();

  // return `${day}/${month}/${year}`;

  //Internationalisation API is Used.

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};


//displayMovements function updates the movements of a account,whether money is withdrawn or deposited is shown.
//The function works by modifying the html of 'movements-row' by using a for-each loop.
//The values comes from an array of accounts object where all the movements are stored.


const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? account.movements.slice().sort((a, b) => a - b) : account.movements;


  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal'

    const date = new Date(account.movementsDates[i]);

    const displayDate = formatMovementDate(date, account.locale);

    const formattedMovement = formatCurrency(mov, account.locale, account.currency);

    const html = `<div class="movements_row">
          <div class="movements_type movements_type-${type}">${i + 1} ${type}</div>
          <div class="movements_date">${displayDate}</div>
          <div class="movements_value">${formattedMovement}</div>
      </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}


//calcDisplayBalance calulates and displays the total balance in an account.
//It uses reduce() method to calulate the balance of the account.
//Balance is displayed by modifying the labelBalance variable.


const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCurrency(account.balance, account.locale, account.currency);
};


//calcDisplaySummary method calculates the in , out and interest then displays it in the UI.
//It uses mainly three methods map(),reduce() and filter() which are chained together to obtain the results.
// toFixed() method is also used to restrict the decimal places. 


const calcDisplaySummary = function (account) {
  const incomes = account.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0)
  labelSumIn.textContent = formatCurrency(incomes, account.locale, account.currency);

  const out = account.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurrency(Math.abs(out), account.locale, account.currency);

  const interest = account.movements.filter(mov => mov > 0)
    .map(deposit => deposit * (account.interestRate / 100))
    .filter(int => int >= 1)
    .reduce((acc, deposit) => acc + deposit, 0);
  labelSumInterest.textContent = formatCurrency(interest, account.locale, account.currency);
}


//createUserNames method creates usernames for each account holder by taking the first letters of their name and joining them together.
// this method uses the split() join() and map() methods.

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  });
};

createUserNames(accounts);


//updateUI method resets the UI . 

const updateUI = function (acc) {
 
  //Display Movements
  displayMovements(acc);

  //Display Balance
  calcDisplayBalance(acc);

  //Display Summary 
  calcDisplaySummary(acc);
}

//Timeout Feature

const startLogOutTimer = function () {

  const tick = function () {

    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    //In each call,print the remaining time to UI
    labelTimer.textContent = `${min} : ${sec}`;

    //When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get Started';
      containerApp.style.opacity = 0;
    }

    //Decrease 1 sec
    time--;

  }
  //Set time to 5 minutes
  let time = 300;

  //Call the timer every Second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;

}


////////////////////////////////////////////////////////////////////////////////////
let currAccount ,timer;

// Fake always logged in
currAccount = account1;
updateUI(currAccount);
containerApp.style.opacity = 100;


// Events Handling -- All the features are handled after here...


//LOAN BUTTON

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currAccount.movements.some(mov => mov >= amount * 0.1)) {

    //Loan will be approved after 5 seconds.

    setTimeout(function () {
      //Add movement
      currAccount.movements.push(amount);

      //Add Loan Date
      currAccount.movementsDates.push(new Date().toISOString());

      updateUI(currAccount);
  
    //Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();

    }, 5000);
  }
  inputLoanAmount.value = '';

});


// LOGIN BUTTON

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

  if (currAccount?.pin === +(inputLoginPin.value)) {
    //If the username and password are correct display balance movements and summary.

    //Display UI and Message
    labelWelcome.textContent = `Welcome Back , ${currAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    //Current Date 

    //Formatting the Dates
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };

    //Date should be displayed to whatever language user have set their browser.
    // const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(currAccount.locale, options).format(now);

    //Clear Input Fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Timer 
    if(timer){
      clearInterval(timer); 
    }
    timer = startLogOutTimer();

    //Update UI
    updateUI(currAccount);
  }
});


// MONEY TRANSFERS TO OTHER USERS ....


btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  inputTransferTo.value = inputTransferAmount.value = '';

  if (receiverAcc && amount > 0 && currAccount.balance >= amount && receiverAcc?.username !== currAccount.username) {

    currAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Add Transfer Date
    currAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    updateUI(currAccount);

    //Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();

  }

});


//CLOSING THE ACCOUNT ....

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (inputCloseUsername.value === currAccount.username && +(inputClosePin.value) === currAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === currAccount.username);

    //Delete Account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});


//Sorting ....

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currAccount.movements, !sorted);
  sorted = !sorted;
});
