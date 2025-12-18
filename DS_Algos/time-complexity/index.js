// Common time complexities

// Big O
// O(log n), O(1), O(n), O(n log n), O(n^2)

// Accessing an array

const arr = [1, 2, 3, 4, 5];

console.log(arr[1]) // O(1)

function addNumbers (a,b){
    let sum =a+b; // O(1)
    let product = a*b; // O(1)
    return sum + product // O(1)
}

// O(1) + O(1) + O(1) = O(1)



const arrTwo = [1, 2, 3, 4, 5];

function whatBigOAmI(){

    const a = 2;
    const b = 3;

    const c = a+b; //O(1)

    for (let i= 0; i < arrTwo.length; i++){
        console.log(i)
    } //O(n)

    for (let i= 0; i < arrTwo.length; i++){
        console.log(i)
    } //O(n)

    //O(1) + O(n) + O(n) = O(n)
}
