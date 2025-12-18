// Solution with 0(n) time complexity
// Find the number of good pairs of socks in the array
// // A good pair is a pair of socks with the same color

const arr = [10, 20, 20, 10, 10, 30, 50, 10, 20];

const goodPairs = {

}

for (let i =0; i < arr.length; i++){
    let sock = arr[i]
    if (sock in goodPairs){
        goodPairs[sock] += 1
    } else {
        goodPairs[sock] = 1
    }
}

let numberOfGoodPairs = 0

for(let key in goodPairs){
    console.log(key, goodPairs[key])
    numberOfGoodPairs+= Math.floor(goodPairs[key]/2)
}
console.log(numberOfGoodPairs)
return numberOfGoodPairs

// you should also look at the leetcode, which logic needs to be adjusted https://leetcode.com/problems/number-of-good-pairs/