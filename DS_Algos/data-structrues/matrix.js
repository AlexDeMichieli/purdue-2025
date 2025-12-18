//define a 2d array

const twoDArray = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

//access an element in the 2d array
console.log(twoDArray[1][2]); //outputs 6 

//time complexity to iterate through a 2d array is O(n*m) where n is the number of rows and m is the number of columns
//iterate through the 2d array
for (let i = 0; i < twoDArray.length; i++){
    for (let j = 0; j < twoDArray[i].length; j++){
        console.log(twoDArray[i][j]);
    }
}

//add a new row to the 2d array
twoDArray.push([10, 11, 12]);