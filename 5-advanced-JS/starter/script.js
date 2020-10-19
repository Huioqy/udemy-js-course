// Funtion construcotr

// var Person = function(name, yearOfBirth, job) {
//     this.name = name;
//     this.yearOfBirth = yearOfBirth;
//     this.job = job;
// }

// Person.prototype.calculateAge = function() {
//     console.log(2016 - this.yearOfBirth);
// };

// Person.prototype.lastName = 'Smith';


// var john = new Person('John', 1990, 'teacher');
// var jane = new Person('Jane', 1969, 'designer');
// var mark = new Person('Mark', 1948, 'retired');

// john.calculateAge();
// jane.calculateAge();
// mark.calculateAge();

// console.log(john.lastName);
// console.log(jane.lastName);
// console.log(mark.lastName);


// object.create

// var personProto = {
//     calculateAge: function() {
//         console.log(2016 - this.yearofBirth);
//     }
// }

// var john = Object.create(personProto);
// john.name = 'John';
// john.yearofBirth = 1990;
// john.job = 'teacher';

// var jane = Object.create(personProto,
//     {
//         name: { value: 'Jane'},
//         yearofBirth: { value: 1969 },
//         job: { value: 'designer' }
//     });

// Primitives vs objects

// var a = 23;
// var b = a;
// a = 46;
// console.log(a);
// console.log(b);

// // Objects
// var obj1 = {
//     name: 'John',
//     age: 26
// }
// var obj2 = obj1;
// obj1.age = 30;
// console.log(obj1.age);
// console.log(obj2.age);


// // Functions
// var age = 27;
// var obj = {
//     name: 'Johnas',
//     city: 'Lisbon'
// }

// function change(a, b) {
//     a = 30;
//     b.city = 'Sanfrancisco';
// }

// change(age, obj);

// console.log(age);
// console.log(obj.city);


//////////////////////////////////////
// Passing functions as arguments

// var years = [1990, 1965, 1937, 2005, 1998];

// function arrayCalc(arr, fn) {
//     var arrRes = [];
//     for (var i = 0; i < arr.length; i++){
//         arrRes.push(fn(arr[i]));
//     }
//     return arrRes;
// }

// function isFillAge(el) {
//     return el >= 18;
// }

// function calculateAge(el) {
//     return 2016 - el;
// }

// var ages = arrayCalc(years, calculateAge);
// var fullAges = arrayCalc(ages, isFillAge);

// console.log(ages);
// console.log(fullAges);

////////////////////////////////////////
// Function returning functions

// function interviewQuestion(job) {
//     if (job == 'designer') {
//         return function(name) {
//             console.log(name + ', can you please explain what UX desin is?')
//         }
//     } else if (job == ' teancher') {
//         return function(name) {
//             console.log('What subject do you teach, ' + name + '?');
//         }
//     } else {
//         return function(name) {
//             console.log('Hello ' + name + ', waht do you do?');
//         }
//     }
// }

// var teacherQuestion = interviewQuestion('teacher');
// var designerQuestion = interviewQuestion('designer');

// teacherQuestion('John');
// designerQuestion('John');

// interviewQuestion('teacher')('Mark');

/////////////////////////////////////////////
// Life

// function game() {
//     var score = Math.random() * 10;
//     console.log(score >= 5);
// }
// game();

// (function(){
//     var score = Math.random() * 10;
//     console.log(score >= 5);
// })();

// (function(goodLuck){
//     var score = Math.random() * 10;
//     console.log(score >= 5 - goodLuck);
// })(5);

//////////////////////////////////////////////////////
// Leture: Closures

// function retirement(retirementAge) {
//     var a = ' year left until retirement.';
//     return function(yearofBirth) {
//         var age = 2016 - yearofBirth;
//         console.log((retirementAge - age) + a);
//     }
// }

// var retirementUS = retirement(66);
// retirementUS(1990);
// var retirementGermany = retirement(65);
// var retirementIceland = retirement(67);

// retirement(66)(1990);
// retirementGermany(1990);
// retirementIceland(1990);


/////////////////////////////////////
// Bind, call, apply

// var john = {
//     name: 'John',
//     age: 26,
//     job: 'teacher',
//     presentation: function(style, timeOfDay) {
//         if (style === 'formal') {
//             console.log('Good ' + timeOfDay + ', Ladies and gentlemen! I\'m ' +  this.name + ', I\'m a ' + this.job + ' and I\'m ' + this.age + ' years old.');
//         } else if (style === 'friendly') {
//             console.log('Hey! What\'s up? I\'m ' +  this.name + ', I\'m a ' + this.job + ' and I\'m ' + this.age + ' years old. Have a nice ' + timeOfDay + '.');
//         }
//     }
// };



/////////////////////////////
// CODING CHALLENGE


/*
--- Let's build a fun quiz game in the console! ---

1. Build a function constructor called Question to describe a question. A question should include:
a) question itself
b) the answers from which the player can choose the correct one (choose an adequate data structure here, array, object, etc.)
c) correct answer (I would use a number for this)

2. Create a couple of questions using the constructor

3. Store them all inside an array

4. Select one random question and log it on the console, together with the possible answers (each question should have a number) (Hint: write a method for the Question objects for this task).

5. Use the 'prompt' function to ask the user for the correct answer. The user should input the number of the correct answer such as you displayed it on Task 4.

6. Check if the answer is correct and print to the console whether the answer is correct ot nor (Hint: write another method for this).

7. Suppose this code would be a plugin for other programmers to use in their code. So make sure that all your code is private and doesn't interfere with the other programmers code (Hint: we learned a special technique to do exactly that).
*/
(function(){
    function Question(question, answer, correct_answer) {
        this.question = question;
        this.answer = answer;
        this.correct_answer = correct_answer;
    };

    Question.prototype.displayQuestion = function() {
        console.log(this.question);
        for (var i=0; i<this.answer.length; i++) {
            console.log( i, this.answer[i]);
        }
    }
    
    Question.prototype.checkAnswer = function(index, callback) {
        var sc;
        if(this.correct_answer === index) {
            console.log("Correct!");
            sc = callback(true);
        } else {
            console.log("Wrong!");
            sc = callback(false);
        }
        this.displayScore(sc);
    }

    Question.prototype.displayScore = function(score) {
        console.log('Your current score is: ' + score);
        console.log('--------------------------------');
    }


    var questionSet = [];
    questionSet[0] = new Question('Who are you?', ['human', 'alient'], 0);
    questionSet[1] = new Question('Where are you?', ['earth', 'sapce'], 0);
    questionSet[2] = new Question('how old are you?', ['>18 ', '<=18'], 0);

    function score() {
        var sc = 0;
        return function(correct) {
            if ( correct ) {
                sc++;
            } 
            return sc;
        }
    }
    var keepScore = score();

   function nextQuestion() {
        var index = Math.floor(Math.random() * questionSet.length);

        console.log(questionSet[index].getQuestion);
        console.log(questionSet[index]);

        questionSet[index].displayQuestion();

        var answer = prompt('Please select the correct answer.');

        if ( answer !== 'exit' ) {
            questionSet[index].checkAnswer(parseInt(answer), keepScore);

            nextQuestion();
        }
    }
    nextQuestion();
})();

/*
--- Expert level ---

8. After you display the result, display the next random question, so that the game never ends (Hint: write a function for this and call it right after displaying the result)

9. Be careful: after Task 8, the game literally never ends. So include the option to quit the game if the user writes 'exit' instead of the answer. In this case, DON'T call the function from task 8.

10. Track the user's score to make the game more fun! So each time an answer is correct, add 1 point to the score (Hint: I'm going to use the power of closures for this, but you don't have to, just do this with the tools you feel more comfortable at this point).

11. Display the score in the console. Use yet another method for this.
*/

