
// продолжает вычислять сходимость ряда
onmessage = ev => {

    const infoArr = ev.data;
    const res = [];
    //infoArr.forEach(info => res.push(calc(info)));

    for (let ii = 0; ii < infoArr.length; ii++) {
        let {depth, x, y, i, zx, zy} = infoArr[ii];
        //if (ii===0) someVal.push({x,y});
        while (true){
            if (zx > Math.PI || zx < -Math.PI) {
                res.push({x: x, y: y, converges: false, i: i, zx: zx, zy: zy});
                break;
            }
            if (i>=depth) {
                res.push({x: x, y: y, converges: true, i: i, zx: zx, zy: zy});
                break;
            }

            zx = zx*zx-zy*zy + x;
            zy = 2*zx*zy + y;
            i++;
        }
    }

    postMessage(res); // {x, y, converges, i, zx, zy}
}


/*function calc(info) {
    let {depth, x, y, i, zx, zy} = info;
    while (true){
        if (zx > Math.PI || zx < -Math.PI) {
            return {x: x, y: y, converges: false, i: i, zx: zx, zy: zy};
        }
        if (i>=depth) {
            return {x: x, y: y, converges: true, i: i, zx: zx, zy: zy};
        }

        zx = zx*zx-zy*zy + x;
        zy = 2*zx*zy + y;
        i++;
    }
}*/


/*function calc(info) {
    let {depth, x, y, i, zx, zy} = info;

    let series = new Series(new ComplexNumber(zx, zy), new ComplexNumber(x,y));
    while (true){
        if (Math.abs(series.z.x) > Math.PI) {
            //postMessage({converges: false, i: i, series: null});
            //postMessage({x: x, y: y, converges: false, i: i, zx: series.z.x, zy: series.z.y});
            return {x: x, y: y, converges: false, i: i, zx: series.z.x, zy: series.z.y};
        }
        if (i>=depth) {
            //postMessage({converges: true, i: i, series: series});
            //postMessage({x: x, y: y, converges: true, i: i, zx: series.z.x, zy: series.z.y});
            return {x: x, y: y, converges: true, i: i, zx: series.z.x, zy: series.z.y};
        }

        series.next();
        i++;
    }
}*/


/*function hash2(x, y) {
    return x+";"+y;
}*/


/*

// ряд
class Series {
    z; c;

    constructor(z,c) {
        this.c = c;
        this.z = z;
    }

    next(){
        this.z = this.z.sqr().add(this.c);
        return this.z;
    }
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
}*/
