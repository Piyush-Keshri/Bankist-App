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

  const displayMovements = function(movements,sort = false)
  {
    containerMovements.innerHTML = '';

   const movs = sort ? movements.slice().sort((a,b) => a-b) : movements;
   
    movs.forEach(function(mov,i){
      const type = mov >0?'deposit':'withdrawal'

      const html = `<div class="movements_row">
          <div class="movements_type movements_type-${type}">${i+1} ${type}</div>
          <div class="movements_value">₹ ${mov}</div>
      </div>`;

      containerMovements.insertAdjacentHTML('afterbegin',html);
    });
  }
  

//calcDisplayBalance calulates and displays the total balance in an account.
//It uses reduce() method to calulate the balance of the account.
//Balance is displayed by modifying the labelBalance variable.

  const calcDisplayBalance = function(account){
    account.balance = account.movements.reduce((acc,mov) => acc+mov,0);
    labelBalance.textContent =`₹ ${account.balance}`
  };  

  //SUMMARY  

  const calcDisplaySummary = function(account){
    const incomes = account.movements.filter(mov => mov>0).reduce((acc,mov) => acc+mov,0)
    labelSumIn.textContent = `₹${incomes}`;

    const out = account.movements.filter(mov => mov<0).reduce((acc,mov) => acc+mov,0);
    labelSumOut.textContent = `₹${Math.abs(out)}`;

    const interest = account.movements.filter(mov => mov>0)
                              .map(deposit => deposit*(account.interestRate/100))
                              .filter(int => int >= 1)
                              .reduce((acc,deposit) => acc+deposit,0);
    labelSumInterest.textContent = `₹${interest}` 
  }

//--USERNAME

  const createUserNames = function(accs){
    accs.forEach(function(acc){
      acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
    });  
  };

  createUserNames(accounts);

const updateUI = function(acc)
{
//Display Movements
displayMovements(acc.movements);

//Display Balance
calcDisplayBalance(acc);

//Display Summary 
calcDisplaySummary(acc);
}

btnLoan.addEventListener('click',function(e){
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if(amount>0 && currAccount.movements.some(mov => mov>= amount*0.1) )
  {
    //Add movement
    currAccount.movements.push(amount);
    updateUI(currAccount);
  }
  inputLoanAmount.value = '';
})

  //Event Handler

  let currAccount ;

  btnLogin.addEventListener('click',function(e)
  { e.preventDefault();
    
  currAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  
  if(currAccount?.pin === Number(inputLoginPin.value)){
    //If the username and password are correct display balance movements and summary.

    //Clear Input Fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Display UI and Message
    labelWelcome.textContent = `Welcome Back , ${currAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    //Update UI
    updateUI(currAccount);
  }

  });

  // MONEY TRANSFERS

  btnTransfer.addEventListener('click',function(e){
    e.preventDefault();

    const amount = Number(inputTransferAmount.value);
    const receiverAcc =accounts.find(acc => acc.username === inputTransferTo.value);
    inputTransferTo.value = inputTransferAmount.value = '';

    if(receiverAcc && amount >0 && currAccount.balance >= amount && receiverAcc?.username !== currAccount.username ){

      currAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);
      updateUI(currAccount);
    } 

  });

  btnClose.addEventListener('click',function(e){
  e.preventDefault();
    if(inputCloseUsername.value === currAccount.username && Number(inputClosePin.value) === currAccount.pin)
    {
    const index = accounts.findIndex(acc => acc.username === currAccount.username);
    
    //Delete Account
    accounts.splice(index,1);

    //Hide UI
    containerApp.style.opacity = 0;
    }
    inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;

//Sorting.
btnSort.addEventListener('click',function(e){
  e.preventDefault();
  displayMovements(currAccount.movements,!sorted);
  sorted = !sorted; 
});