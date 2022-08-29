'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
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

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////

const displayMovements = function (mov) {
  containerMovements.innerHTML = '';
  mov.forEach((el, i) => {
    let type = el > 0 ? 'deposit' : 'withdrawal';
    let html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          
          <div class="movements__value">${el} &euro;</div>
        </div>
 `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

let displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((arr, el) => arr + el, 0);
  labelBalance.innerHTML = `${acc.balance}&euro;`;
};

// LECTURES
let t = account1.movements
  .filter(el => el > 0)
  .map(el => el * 1.1)
  .reduce((acc, el) => acc + el, 0);

let displaySummary = function (arr) {
  let incomes = arr.movements
    .filter(el => el > 0)
    .reduce((acc, el) => acc + el, 0);
  labelSumIn.innerHTML = `${incomes}&euro;`;
  let outcomes = arr.movements
    .filter(el => el < 0)
    .reduce((acc, el) => acc + el, 0);
  labelSumOut.innerHTML = `${Math.abs(outcomes)}&euro;`;
  let interset = arr.movements
    .filter(el => el > 0)
    .map(el => (el * arr.interestRate) / 100)
    .filter(el => el >= 1)
    .reduce((acc, el) => acc + el, 0);
  labelSumInterest.innerHTML = `${interset}&euro;`;
};
let displayUserName = function (accounts) {
  accounts.forEach(account => {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(el => el[0])
      .join('');
  });
};
function updateUI(currentAccount) {
  displayMovements(currentAccount.movements);
  displayBalance(currentAccount);
  displaySummary(currentAccount);
}

displayUserName(accounts);
let currentAccount;
btnLogin.addEventListener('click', function (event) {
  event.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;
    labelWelcome.innerHTML = `Good Afternoon, ${
      currentAccount.owner.split(' ')[0]
    }!`;
    inputLoginUsername.value = inputLoginPin.value = '';
    updateUI(currentAccount);
  } else {
    containerApp.style.opacity = 0;
  }
});
btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  let amount = Number(inputTransferAmount.value);
  let receiveAcc = accounts.find(el => el.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiveAcc &&
    currentAccount.balance >= amount &&
    receiveAcc?.username != currentAccount.username
  ) {
    //doing the transfer

    currentAccount.movements.push(-amount);
    receiveAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  let amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (event) {
  event.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    let index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let overallBalance = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, el) => acc + el, 0);

btnSort.addEventListener('click', function (event) {
  event.preventDefault();
  currentAccount.movements.sort((a, b) => {
    if (a > b) return 1;
    if (a < b) return -1;
  });
  updateUI(currentAccount);
});

let { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sum, el) => {
      sum[el > 0 ? 'deposits' : 'withdrawals'] += el;
      return sum;
    },
    { deposits: 0, withdrawals: 0 }
  );

let Dogs = [
  { owner: ['alice', 'bob'], weight: 22, eats: 250 },
  { owner: ['matilda'], weight: 8, eats: 200 },
  { owner: 'Kate', weight: 13, eats: 275 },
  { owner: 'Kate', weight: 32, eats: 340 },
];
Dogs.map(el => (el.recommendedFood = el.weight ** 0.75 * 28));
let sara = Dogs.find(el => el.owner.includes('Sara'));

let allMore = Dogs.map(el => {
  if (el.recommendedFood > el.eats) {
    console.log('eats more');
  }
});

console.log(allMore);
