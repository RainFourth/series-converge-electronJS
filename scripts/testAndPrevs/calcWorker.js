


let seriesConverge;
function converges(calcDepth, x, y){
    if(!seriesConverge) seriesConverge = new SeriesConverge();
    const result = seriesConverge.converges(calcDepth, new ComplexNumber(x, y));
    const newResult = {};
    newResult.converges = result.converges ? true : (calcDepth < result.i);
    newResult.i = newResult.converges ? calcDepth : result.i;
    newResult.x = x;
    newResult.y = y;
    newResult.depth = calcDepth;
    return newResult;
}


onmessage = ev => {
    const request = ev.data;
    const result = converges(request.depth, request.x, request.y);
    postMessage(result);
}


// класс проверяет сходимость ряда и кэширует результаты
class SeriesConverge {
    cache;

    constructor() {
        this.cache = new Map();
    }

    get(c){
        const cache = this.cache;
        const cHash = c.toString();
        return cache.get(cHash);
    }

    converges(calcDepth, c){
        const cache = this.cache;
        if (cache.size > 100000) cache.clear();
        const cHash = c.toString();
        let result = cache.get(cHash);
        if (result){
            if (calcDepth > result.i && result.converges){
                result = this.convergeNext(calcDepth, result.series, result.i+1);
            }
        } else {
            result = this.convergeNext(calcDepth, new Series(c));
            cache.set(cHash, result);
        }
        return result;
    }

    convergeNext(calcDepth, series, i= 1) {
        while (true){
            if (Math.abs(series.z.x) > Math.PI) return {converges: false, i: i, series: null};
            if (i>=calcDepth) return {converges: true, i: i, series: series};

            series.next();
            i++;
        }
    }
}



// ряд
class Series {
    z; c;

    constructor(c) {
        this.c = c;
        this.z = new ComplexNumber(0, 0).add(c);
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
}








/*function converges(calcDepth, c) {
    let s;
    let i = 1;
    while (true){
        if (i===1) s = new Series(c); else s.next();
        if (Math.abs(s.z.x) > Math.PI) return {converges: false, iter: i};
        if (i>=calcDepth) return {converges: true, iter: i};
        i++;
    }
}*/
