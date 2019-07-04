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
    }
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
    expenseContainer: ".expenses__list"
  };

  // Output user input (data must be public so other modules can utilize it)
  return {
    // Returns a function outputting 1 object of user data
    getInput: function () {
      return {
        // Grab user data
        type: document.querySelector(DOMstrings.inputType).value, // inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value, //description
        value: document.querySelector(DOMstrings.inputValue).value // $ value
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

    // Make DOMstrings public so other modules can use UI classes
    getDOMstrings: function () {
      return DOMstrings;
    }
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

  // Main function to add a new item
  const ctrlAddItem = function () {
    let input, newItem;

    // 1. Grab input data by calling function calling UIController
    input = UICtrl.getInput();

    // 2. Add data to budget controller
    newItem = budgetController.addItem(input.type, input.description, input.value);
    // 3. Add data to UI
    UICtrl.addListItem(newItem, input.type);
    // 4. Calculate budget

    // 5. Display calculations back to UI
  };

  return {
    init: function () {
      console.log("Application started...");
      setupEventListeners();
    }
  };
})(budgetController, UIController);

// Initialize the app
controller.init();
