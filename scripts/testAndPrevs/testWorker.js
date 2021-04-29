const o = {val: 1}

onmessage = ev => {
    console.log("work # "+ev.data);
    console.log(ev.data)
    postMessage(o.val);
    while (true){break}
    postMessage(o.val);
}

// комплексное число
class ComplexNumber {
    x; y;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(complexNumber){
        return new ComplexNumber(this.x + complexNumber.x, this.y + complexNumber.y);
    }

    sqr(){
        let x = this.x;
        let y = this.y;
        return new ComplexNumber(x*x-y*y, 2*x*y);
    }

    toString(){
        return (this.x+" "+this.y);
    }
}