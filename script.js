'use strict'

// Data
const account1 = {
    owner : 'Jonas Schmedtmann',
    movements : [200,450,-400,3000,-650,-130,70,1300],
    interestRate : 1.2,
    pin : 1111,
};

const account2 = {
    owner : 'Jessica Davis',
    movements : [5000,3400,-150,-790,-3210,-1000,8500,-30],
    interestRate : 1.5,
    pin : 2222 ,
};

const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
  };
  
  const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
  };

  const accounts = [account1, account2, account3, account4];

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

  //displayMovements function updates the movements of a account,whether money is withdrawn or deposited is shown.
  //The function works by modifying the html of 'movements-row' by using a for-each loop.
  //The values comes from an array of accounts object where all the movements are stored.

  const displayMovements = function(movements){

    containerMovements.innerHTML = '';

    movements.forEach(function(mov,i){
      const type = mov >0?'deposit':'withdrawal'

      const html = `<div class="movements_row">
          <div class="movements_type movements_type-${type}">${i+1} ${type}</div>
          <div class="movements_value">₹ ${mov}</div>
      </div>`;

      containerMovements.insertAdjacentHTML('afterbegin',html);
    });
  }
  displayMovements(account1.movements);

//calcDisplayBalance calulates and displays the total balance in an account.
//It uses reduce() method to calulate the balance of the account.
//Balance is displayed by modifying the labelBalance variable.

  const calcDisplayBalance = function(movements){
    const balance = movements.reduce((acc,mov) => acc+mov,0);
    labelBalance.textContent =`₹ ${balance}`
  };

  calcDisplayBalance(account1.movements);

  const calcDisplaySummary = function(movements){
    const incomes = movements.filter(mov => mov>0).reduce((acc,mov) => acc+mov,0)
    labelSumIn.textContent = `₹${incomes}`;

    const out = movements.filter(mov => mov<0).reduce((acc,mov) => acc+mov,0);
    labelSumOut.textContent = `₹${Math.abs(out)}`;

    const interest = movements.filter(mov => mov>0)
                              .map(deposit => deposit*1.2/100)
                              .filter(int => int >= 1)
                              .reduce((acc,deposit) => acc+deposit,0);
    labelSumInterest.textContent = `₹${interest}` 
  }
  calcDisplaySummary(account1.movements);

  const createUserNames = function(accs){
    accs.forEach(function(acc){
      acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
    });  
  };

  createUserNames(accounts);

  // const currencies = new Map([
  //   ['USD', 'United States dollar'],
  //   ['EUR', 'Euro'],
  //   ['GBP', 'Pound sterling'],
  // ]);
  
  // const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
  