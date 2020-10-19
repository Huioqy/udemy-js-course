
// BUDGET CONTROLLER
var budgetController = (function() {

    // capital for function constructors
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round( (this.value / totalIncome) * 100 );
        } else {
            this.percentage = -1;
        }
    };
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }

    // capital for function constructors
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum = sum + cur.value;
        });
        data.totals[type] = sum;
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }

    // Public functions
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            
            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Create new item
            if ( type === 'exp' ) {
                newItem = new Expense(ID, des, val);
            } else if ( type === 'inc' ) {
                newItem = new Income(ID, des, val);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },

        deleteItem: function(type, id) {
            var ids, index;

            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudeget: function() {

            // calculate the total income and expense
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of the income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round( (data.totals.exp / data.totals.inc) * 100 );
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function() {
            data.allItems.exp.forEach(function(current) {
                current.calcPercentage(data.totals.inc);
            });
        },

        getPercentage: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            })
            return allPerc;
        },

        getBudeget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: function() {
            return data;
        }
    }

})();

// UI CONTROLLER
var UIController = (function() {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLable: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLable: '.item__percentage',
        dataLabel: '.budget__title--month'
    }

    var formatNumber = function(num, type) {
        var numSplit, int, dec, newInt="";
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        // if (int.length > 3 ) {
        //     int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        // }
        while (int.length > 3 ) {
            newInt = ',' + int.substr(int.length - 3, 3) + newInt;
            int = int.slice(0, int.length - 3);
        }
        newInt = int.toString() + newInt;
        dec = numSplit[1];

        return ( type === 'exp' ? '-' : '+' ) +  ' ' + newInt + '.' + dec;
    }

    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++ ){
            callback(list[i], i);
        }
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will get 'inc' or 'exp'
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
            }
        },

        addListItem: function(obj, type) {
            var html, element, newHtml;
            
            // Create HTML string with placeholder text
            if ( type === 'inc' ) {
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if ( type === 'exp') {
                element = DOMstrings.expensesContainer;

                 html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace the placeholder text with some acutal data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value));

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID) {

            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFields: function() {
            var fields, fieldsArr; 

            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            // list -> array
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            })
        },

        displayBudget: function(obj) {
            var type;
            obj.totalInc >= obj.totalExp ? type = 'inc' : type = 'exp'; 
            document.querySelector(DOMstrings.budgetLable).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---' ;
            }
        },

        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensesPercLable);

            nodeListForEach(fields, function(field, index) {
                if (percentages[index] > 0) {
                    field.textContent = percentages[index] + '%';
                } else {
                    field.textContent = '---';
                }
            });
        },

        displayMouth: function() {
            var now, year, months, month;
            var now = new Date();

            months = ['Januray', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.dataLabel).textContent = months[month] + ' ' + year;
        },

        changedType: function() {
            var fileds = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);

            nodeListForEach(fileds, function(cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputButton).classList.toggle('red');
        },

        getDOMStrings: function() {
            return DOMstrings;
        }
    }

})();

// GLOBAL APP CONTROL
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMStrings();

        document.querySelector(DOM.inputButton).addEventListener('click', crtAddItem);

        document.addEventListener('keypress', function(event) {
            if ( event.keyCode === 13 || event.which === 13) {
                crtAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', crtDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };


    var updateBudeget = function() {

        // 1. calculate the budget
        budgetCtrl.calculateBudeget();

        // 2.return the budget
        budget = budgetCtrl.getBudeget();

        // 3. display the budget on the UI
        UICtrl.displayBudget(budget);
    }

    var updatePercentages = function() {
        
        // 1. calculate percentage
        budgetCtrl.calculatePercentages();

        // 2. read percentage from the budeget controller
        var perc = budgetCtrl.getPercentage();

        // 3. update the ui with new percentages
        UICtrl.displayPercentages(perc);

    }

    var crtAddItem = function() {
        
        var input, newItem;

        // 1. Get input data
        input = UICtrl.getInput();

        if ( input.description !== "" && !isNaN(input.value) && input.value > 0 ) {
             
            // 2. Add the item to the buget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. clear input fields.
            UICtrl.clearFields();

            // 5. Calculate and update the budget
            updateBudeget();

            // 6. calculate and update percentafe
            updatePercentages();
        }
    }

    var crtDeleteItem = function(event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {

            // inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]); // srting -> integer

            // 1. delete the item from the data sctruture
            budgetCtrl.deleteItem(type, ID);

            // 2. delete the item from the UI
            UICtrl.deleteListItem(itemID);

            // 3. Update and show the new budget
            updateBudeget();

            // 6. calculate and update percentafe
            updatePercentages();
        } 
    }

    return {
        init: function() {
            console.log('Application has started.');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            })
            UICtrl.displayMouth();
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();