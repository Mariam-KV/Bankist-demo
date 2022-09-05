'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

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
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
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
    let now = new Date(currentAccount.movementsDates[i]);
    let day = `${now.getDay() + 1}`.padStart(2, 0);
    let month = `${now.getMonth() + 1}`.padStart(2, 0);
    let year = now.getFullYear();
    let d = `${day}/${month}/${year}`;
    let type = el > 0 ? 'deposit' : 'withdrawal';
    let html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date"> ${d}</div>
          
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
  labelSumIn.innerHTML = `${Math.round(incomes)}&euro;`;
  let outcomes = arr.movements
    .filter(el => el < 0)
    .reduce((acc, el) => acc + el, 0);
  labelSumOut.innerHTML = `${Math.round(Math.abs(outcomes))}&euro;`;
  let interset = arr.movements
    .filter(el => el > 0)
    .map(el => (el * arr.interestRate) / 100)
    .filter(el => el >= 1)
    .reduce((acc, el) => acc + el, 0);
  labelSumInterest.innerHTML = `${Math.round(interset)}&euro;`;
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
let notification = document.querySelector('.notification');
displayUserName(accounts);
let currentAccount;
btnLogin.addEventListener('click', function (event) {
  event.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    notification.style.display = 'none';
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
    currentAccount.movementsDates.push(new Date());
    receiveAcc.movementsDates.push(new Date());
    currentAccount.movements.push(-amount);
    receiveAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  let amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    setTimeout(() => {
      currentAccount.movementsDates.push(new Date());
      currentAccount.movements.push(amount);

      updateUI(currentAccount);
    }, 2000);
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
let days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Satuday',
];
let dateBalance = document.querySelector('.date');
let now = new Date();
let day = `${days[now.getDay()]}`.padStart(2, 0);
let month = `${now.getMonth() + 1}`.padStart(2, 0);
let year = now.getFullYear();
let hour = `${now.getHours()}`.padStart(2, 0);
let minute = `${now.getMinutes()}`.padStart(2, 0);

dateBalance.innerHTML = `${day}/${month}/${year},${hour}:${minute}`;
