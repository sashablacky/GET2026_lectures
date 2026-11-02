/* let something : string | number | boolean;

something = 100; // valid

something = true; // valid

something = 200; // valid

something = 300; // valid

something = false; // valid

 */
/* var firstName:string; //annotating variable type
var middleName = "Kumar"; //type inference
var lastName:string = "Singh"; //annotating and initializing variable type

var x; //no type annotation, no infirence, so type is any/roaming

x=100;

x="Hello World!";

x=true; */

/* var firstName= "John";
var nameLength = firstName.length;

function sayMyName(firstName:string, lastName:string) {}
sayMyName("John", "Doe"); */

/* interface poet {
    born: number;
    Name: string;
} */
// OR
/* 
type poet = {
    born: number;
    Name: string;
}

const p1:poet = {
    born: 2000,
    Name: "John Doe",
};

const p2:poet = {
    born: 2010,
    Name: "Jane Doe",
}; */

//type poet = number | boolean; -- valid

//interface poet number | boolean; -- invalid

//const p1:poet = 2000;
//const p2:poet = true;

//let bestSong = Math.random() > 0.5 ? 505 : 'pretty cvnts';

/* type poet = {
    born: number;
    Name: string;
}

const namedObject = {
    born: 2000,
    Name: "John Doe",
    activity: "writing"
};

const extraProperty:poet = namedObject */

let friends:[string, string, number, boolean] = ["John", "Jane", 500, true];
let friends2:string[] = ["John", "Jane"];

let sayHello:(name:string) => string;
sayHello = function(x){
    return x;
}

sayHello('hello world');