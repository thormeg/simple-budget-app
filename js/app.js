class App {
    constructor() {
        // Error and user feedback
        this.budgetFeedback = document.querySelector(".budget-feedback");
        this.expenseFeedback = document.querySelector(".expense-feedback");

        // Forms and inputs
        this.budgetForm = document.getElementById("budget-form");
        this.budgetInput = document.getElementById("budget-input");
        this.expenseForm = document.getElementById("expense-form");
        this.expenseNameInput = document.getElementById("expense-input");
        this.expenseAmountInput = document.getElementById("amount-input");
        this.expensesList = document.getElementById("expense-list");
        this.balance = document.getElementById("balance");

        // Actual values
        this.budgetAmount = document.getElementById("budget-amount");
        this.totalExpensesAmount = document.getElementById("expense-amount");
        this.balanceAmount = document.getElementById("balance-amount");

        // State maintenance
        this.itemList = [];
        this.itemID = 0;
        this.editMode = false;
    }

    submitBudgetForm() {
        const budgetAmount = this.budgetInput.value;

        if (!budgetAmount) {
            this.budgetFeedback.classList.add('showItem');
            this.budgetFeedback.innerHTML = `<p>Value cannot be empty</p>`;
            setTimeout(() => {
                this.budgetFeedback.classList.remove('showItem')
            }, 2000);
        } else {
            this.budgetAmount.textContent = budgetAmount;
            this.budgetInput.value = '';
            this.calculateBalance();
        }
    }

    submitExpenseForm() {
        const expenseName = this.expenseNameInput.value;
        const expenseAmount = this.expenseAmountInput.value;

        if (expenseName === '' || expenseAmount === '' || expenseAmount < 0) {
            this.expenseFeedback.classList.add('showItem');
            this.expenseFeedback.innerHTML = `<p>Value must be positive</p>`;
            setTimeout(() => {
                this.expenseFeedback.classList.remove('showItem');
            }, 2000);
        } else {
            let amount = parseInt(expenseAmount);
            this.expenseNameInput.value = '';
            this.expenseAmountInput.value = '';

            let expense = {
                id: this.itemID,
                title: expenseName,
                amount: amount
            }

            this.itemID++;
            this.itemList.push(expense);
            this.addExpense(expense);
            this.calculateBalance();
        }
    }

    addExpense(expense) {
        const div = document.createElement('div');
        div.classList.add('expense');
        div.innerHTML =
            `<li class="expense-item d-flex justify-content-between align-items-baseline">
              <h6 class="expense-title mb-0 text-uppercase list-item">${expense.title}</h6>
              <h5 class="expense-amount mb-0 list-item">${expense.amount}</h5>
              <div class="expense-icons list-item">
                <button class="edit-icon mx-2" data-id="${expense.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-icon" data-id="${expense.id}">
                    <i class="fas fa-trash"></i>
                </button>
              </div>
            </li>`;

        this.expensesList.appendChild(div);
    }

    editExpense(elem) {
        let id = parseInt(elem.dataset.id);
        let parent = elem.parentElement.parentElement.parentElement;
        let expenses = this.itemList.filter((item) => {
            return item.id === id;
        });

        this.expenseNameInput.value = expenses[0].title;
        this.expenseAmountInput.value = expenses[0].amount;

        this.editItem = elem;
        this.editMode = true;
    }

    updateExpenseForm() {
        let updatedName = document.getElementById("expense-input").value;
        let updatedAmount = parseInt(document.getElementById("amount-input").value);

        let parent = this.editItem.parentElement.parentElement.parentElement;

        parent.querySelector(".expense-title").innerHTML = updatedName;
        parent.querySelector(".expense-amount").innerHTML = updatedAmount;

        this.itemList[this.editItem.dataset.id].amount = updatedAmount;
        this.itemList[this.editItem.dataset.id].title = updatedName;

        this.editMode = false;
        this.editItem = undefined;
        this.expenseNameInput.value = '';
        this.expenseAmountInput.value = '';
        this.calculateBalance();
    }

    deleteExpense(elem) {
        this.editMode = false;
        let id = parseInt(elem.dataset.id);
        let parent = elem.parentElement.parentElement.parentElement;
        this.expensesList.removeChild(parent);

        let tempList = this.itemList.filter((item) => {
            return item.id !== id;
        });

        this.itemList = tempList;
        this.calculateBalance();
    }

    calculateBalance() {
        const expenses = this.calculateExpenses();
        const total = parseInt(this.budgetAmount.textContent) - expenses;
        this.balanceAmount.textContent = total;
        if (total < 0) {
            this.balance.classList.remove('showGreen', 'showBlack');
            this.balance.classList.add('showRed');
        } else if (total > 0) {
            this.balance.classList.remove('showRed', 'showBlack');
            this.balance.classList.add('showGreen');
        } else if (total < 0) {
            this.balance.classList.remove('showRed', 'showGreen');
            this.balance.classList.add('showBlack');
        }
    }

    calculateExpenses() {
        let total = 0;

        if (this.itemList.length > 0) {
            total = this.itemList.reduce((acc, curr) => {
                acc += curr.amount;
                return acc;
            }, 0)
        }

        this.totalExpensesAmount.textContent = total;
        return total;
    }
}

function eventListeners() {
    const budgetForm = document.getElementById("budget-form");
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");

    const app = new App();

    budgetForm.addEventListener("submit", (event) => {
        event.preventDefault();
        app.submitBudgetForm();
    });

    expenseForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (app.editMode) {
            app.updateExpenseForm();
        } else {
            app.submitExpenseForm();
        }
    });

    expenseList.addEventListener("click", (event) => {
        if (event.target.parentElement.classList.contains('edit-icon')) {
            app.editExpense(event.target.parentElement);

        } else if (event.target.parentElement.classList.contains('delete-icon')) {
            app.deleteExpense(event.target.parentElement);
        }
    });
}

if (document.readyState !== 'loading') {
    eventListeners();
} else {
    document.addEventListener('DOMContentLoaded', function() {
        eventListeners();
    });
}