//Singly linked list

class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

const a = new Node(5);
const b = new Node(10);
const c = new Node(15);
const d = new Node(20);

class SinglyLinkedList {
    constructor(){
        this.head = null;
        this.size = 0;
    }

    insetNodeTail(data){
        let current = this.head;
        while(current.next){
            current = current.next;
            
        }
        current.next = new Node(data);
    }

    insertNodeHead(data){
        const newNode = new Node(data); //this creates a new node
        newNode.next = this.head; //this points the new node to the current head
        this.head = newNode; //this updates the head to be the new node
    }

}

const linkedList = new SinglyLinkedList();

linkedList.head = a;
a.next = b;
b.next = c;
c.next = d;

linkedList.insetNodeTail(25);
console.log(JSON.stringify(linkedList));
