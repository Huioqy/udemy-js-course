
/////////////////////////////////
// CODING CHALLENGE

/*

Suppose that you're working in a small town administration, and you're in charge of two town elements:
1. Parks
2. Streets

It's a very small town, so right now there are only 3 parks and 4 streets. All parks and streets have a name and a build year.

At an end-of-year meeting, your boss wants a final report with the following:
1. Tree density of each park in the town (forumla: number of trees/park area)
2. Average age of each town's park (forumla: sum of all ages/number of parks)
3. The name of the park that has more than 1000 trees
4. Total and average length of the town's streets
5. Size classification of all streets: tiny/small/normal/big/huge. If the size is unknown, the default is normal

All the report data should be printed to the console.

HINT: Use some of the ES6 features: classes, subclasses, template strings, default parameters, maps, arrow functions, destructuring, etc.

*/

class Element {
    constructor(name, buildYear) {
        this.name = name;
        this.buildYear = buildYear;
    }
};

class Park extends Element {
    constructor(name, buildYear, treeNum, parkArea) {
        super(name, buildYear);
        this.treeNum = treeNum
        this.parkArea = parkArea;
    }

    treeDensity() {
        const density = this.treeNum / this.parkArea;
        console.log(`${this.name} has a tree density of ${density} trees per square km.`);
        return this.treeNum / this.parkArea;
    }
}

class Street extends Element {
    constructor(name, buildYear, length, size=3) {
        super(name, buildYear);
        this.length = length
        this.size = size;
    }
    classifyStreet() {
        const classification = new Map();
        classification.set(1, 'tiny');
        classification.set(2, 'small');
        classification.set(3, 'normal');
        classification.set(4, 'big');
        classification.set(5, 'huge');
        console.log(`${this.name}, build in ${this.buildYear}, is a ${classification.get(this.size)} street.`)
    }
}

const allParks = [
    new Park('Green Park', 1987, 215, 0.2),
    new Park('National Park', 1894, 3541, 2.9),
    new Park('Oak Park', 1953, 949, 0.4)
];

const allStreets = [
    new Street('Ocean Avenue', 1999, 1.1, 4),
    new Street('Evergreen Street', 2008, 2.7, 2),
    new Street('4th Street', 2015, 0.8),
    new Street('Sunset Boulevard', 1982, 2.5, 5)
];

function calc(arr) {
    
    const sum = arr.reduce((prev, cur, index) => prev + cur, 0);
    return [sum, sum/arr.length];

}

function reportParks(p) {

    console.log('report park');

    // density
    allParks.forEach(el => el.treeDensity());

    // average age
    const ages = p.map(el => new Date().getFullYear() - el.buildYear);
    const [totalAge, avgAge] = calc(ages);
    console.log (`total age : ${totalAge}, Average age: ${avgAge}`); 

    // more than 1000 trees
    const i = p.map(el => el.treeNum).findIndex(el => el >= 1000);
    console.log(`${p[i].name} has more than 1000 trees.`);
}

function reportStrees(s) {

    console.log("report street");

    // Total and average length of the town's streets
    const lengths = s.map(el => el.length)
    const sum = s.reduce((prev, cur) => prev + cur, 0);
    console.log(`total length: ${sum}, average length: ${sum/s.length}`)

    // CLassify sizes
    s.forEach(el => el.classifyStreet());
}


reportParks(allParks);
reportStrees(allStreets);



