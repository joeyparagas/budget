// Module to create an object from the user input data
const budgetController = (function () {
  // Constructor for user expense data
  const Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // Constructor for user income data
  const Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // Calculate totals of income and expense in allItems array
  const calculateTotal = function (type) {
    let sum = 0;
    // Grab totals for exp or inc and add user input
    data.allItems[type].forEach(function (cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  // Object of all user data
  const data = {
    // create array of objects created by constructors
    allItems: {
      exp: [],
      inc: []
    },
    // zero out totals
    totals: {
      exp: 0,
      inc: 0
    },
    // total budget
    budget: 0,
    // expense %
    percentage: -1

  };

  return {
    // Returns new user data object and adds to array
    addItem: function (type, des, val) {
      let newItem, ID;

      // ID is a unique identifier = length of exp or inc array + 1
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Checks to see if its an expense or income
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      } else {
      }
      // Push new item into correct array
      data.allItems[type].push(newItem);
      // Return newItem as public
      return newItem;


    },

    // Total Income and Total Expenses with %
    calculateBudget: function () {

      // 1. Calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      // 2. Calculate the: budget = income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // 3. Calculate the % of income spent: % =  expense/income
      // Check for divided by 0 situation
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }

    },

    // Returns Budget totals and %
    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      }
    },

    // test function to be deleted (TRASH)
    testing: function () {
      console.log(data);
    }

  };
})();

// Module to control UI(DOM)
const UIController = (function () {
  // For simplicity's sake, create an object of all UI classes
  const DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expenseContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage"

  };

  // Output user input (data must be public so other modules can utilize it)
  return {
    // Returns a function outputting 1 object of user data
    getInput: function () {
      return {
        // Grab user data
        type: document.querySelector(DOMstrings.inputType).value, // inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value, //description
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value) // $ value
      };
    },

    // Returns a function to output data into DOM
    addListItem: function (obj, type) {
      let html, newHtml, element;
      // Create HTML string with placeholder text
      if (type === 'inc') {

        // target income class to insert into html
        element = DOMstrings.incomeContainer;

        // html string to insert to index.html
        html = `<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
      } else if (type === 'exp') {

        // target expense class to insert into html
        // element = DOMstrings.expenseContainer;
        element = DOMstrings.expenseContainer;

        // html string to insert to index.html
        html = `<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
      }

      // Replace placeholder text with actual data using .replace string method
      newHtml = html.replace(`%id%`, obj.id);
      newHtml = newHtml.replace(`%description%`, obj.description);
      newHtml = newHtml.replace(`%value%`, obj.value);

      // Insert the HTML into DOM using .insertAdjacentHTML
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)
    },

    // Clear input fields and move focus back to description
    clearFields: function () {
      // Grab user input fields using querySelectorAll -> nodelist
      const fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
      // Convert fields nodelist into an array
      const fieldsArr = Array.prototype.slice.call(fields);
      // Loop through and set current value to an empty stirng
      fieldsArr.forEach(function (current, index, array) {
        current.value = "";
      });
      // Move the focus back to description input field after clear
      fieldsArr[0].focus();
    },

    // Display budget inc, exp, and % totals 
    displayBudget: function (obj) {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
      document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;

      // Account for -1 %
      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
    },

    // Make DOMstrings public so other modules can use UI classes
    getDOMstrings: function () {
      return DOMstrings;
    },

  };
})();

// Module to read user data and connects other modules
const controller = (function (budgetCtrl, UICtrl) {
  // For organization, place event listeners in one function
  const setupEventListeners = function () {
    // Envoke DOMstrings object to utilize UI classes for event listeners
    const DOM = UICtrl.getDOMstrings();
    // Grab check mark button click
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
    // Check to see if return was also pressed
    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  // Create a function to update the budget
  const updateBudget = function () {

    // 1. Calculate budget 
    budgetController.calculateBudget();

    // 2. Return the budget
    const budget = budgetController.getBudget();

    // 3. Display the budget back to UI
    UICtrl.displayBudget(budget);
  };

  // Main function to add a new item
  const ctrlAddItem = function () {

    // 1. Grab input data by calling function calling UIController
    const input = UICtrl.getInput();

    // Run the following if there's user data inputed 
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

      // 2. Add data to budget controller
      const newItem = budgetController.addItem(input.type, input.description, input.value);

      // 3. Add data to UI fields at the bottom
      UICtrl.addListItem(newItem, input.type);

      // 4. Clear the fields
      UICtrl.clearFields();

      // Calculate and update budget
      updateBudget();
    }
  };

  return {
    init: function () {
      console.log("Application started...");
      // Set everything to 0
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1

      });

      // Clear out input and focus on description
      UICtrl.clearFields();

      // Sets up eventlisteners
      setupEventListeners();
    }
  };
})(budgetController, UIController);

// Initialize the app
controller.init();
