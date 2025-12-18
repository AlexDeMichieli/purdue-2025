class QueueImplementation{
    constructor(){
        this.items = [];
    }
    enqueue(element){
        this.items.push(element); //this adds an element to the end of the queue
    }
    dequeue(){ //this removes an element from the front of the queue
        if(this.isEmpty()){
            return "Underflow";
        }
        return this.items.shift();
    }
    isEmpty(){ //this checks if the queue is empty
        return this.items.length === 0;
    }
    peek(){ //this returns the front element of the queue
        if(this.isEmpty()){
            return "No elements in Queue";
        }
        return this.items[0];
    }
}

const queue = new QueueImplementation();
queue.enqueue(10);
queue.enqueue(20);
queue.enqueue(30);
console.log(queue.peek());