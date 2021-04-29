






const canvas = document.querySelector("canvas");

const pointsToDraw = new Set();

const context = canvas.getContext("2d");

// пределы графика: [-1.5; 1.5] по обоим осям
const graph1X = 150; // в единице графика по оси X будет graph1X пикселей
const graph1Y = 150; // в единице графика по оси Y будет graph1Y пикселей
let factorX = 1;
let factorY = 1;
// get Scales
function scaleX() { return graph1X*factorX; }
function scaleY() { return graph1Y*factorY; }
let centerX = getW()/2;
let centerY = getH()/2;


const pointInterval1x = 0.1; // одна точка на pointInterval1x единиц графика для единичного мастшаба
let pointRadius = 5;
let pointSize = 3*pointRadius; // учитывая необходимое свободное место вокруг точки
function pointIntervalX() {
    const log2 = Math.floor(Math.log2(factorX));
    return pointInterval1x/(Math.pow(2, log2));
}
function pointIntervalY() {
    const log2 = Math.floor(Math.log2(factorY));
    return pointInterval1x/(Math.pow(2, log2));
}


const axisInterval1x = 0.5;
function axisIntervalX() {
    const log2 = Math.floor(Math.log2(factorX));
    return axisInterval1x/(Math.pow(2, log2));
}
function axisIntervalY() {
    const log2 = Math.floor(Math.log2(factorY));
    return axisInterval1x/(Math.pow(2, log2));
}



function drawAll() {
    const w = getW();
    const h = getH();
    //const cx = context;

    /*
    Атрибуты Canvas width и height не совпадают с его атрибутами CSS width и height.
    Установка атрибутов canvas.width/height определяет общую рисоваемую площадь пикселя,
    которая может быть (но не обязательно) масштабирована с помощью CSS,
    чтобы быть больше или меньше на экране.

    Two canvas pixels per screen pixel so it looks nice
    on a high density (in this case pixel ratio: 2) display:
        canvas.width = 800;
        canvas.height = 800;
        canvas.style.width = '400px';
        canvas.style.height = '400px';
     */
    canvas.width = w;
    canvas.height = h;

    // масштабирование рисоваемой области
    //canvas.scale(x,y);

    // глобально установить непрозрачность цветов
    //context.globalAlpha = 1;

    drawBgc();

    drawAxis();
    /*
    // хз почему, но последняя линия при lineWidth = 1 рисуется немного более яркой
    // при lineWidth = 1.1 норм
    context.closePath();
    context.stroke();
    */

    drawPoints();

    //testCircle();
}

function drawBgc() {
    const w = getW();
    const h = getH();
    context.fillStyle = theme.bgcColor;
    context.fillRect(0, 0, w, h);
}
function drawAxis() {
    // это чтобы не рисовать оси за границами экрана
    const minX = Math.max(-1.5, getCoordX(0));
    const minY = Math.max(-1.5, getCoordY(getH()));
    const maxX = Math.min(1.5, getCoordX(getW()));
    const maxY = Math.min(1.5, getCoordY(0));
    // это чтобы оси проходили через 0
    const aIX = axisIntervalX();
    const aIY = axisIntervalY();
    const sX = Math.ceil(minX/aIX)*aIX;
    const sY = Math.ceil(minY/aIY)*aIY;

    context.strokeStyle = theme.axisColor;
    context.lineWidth = 1.1;
    context.font = "16px SansSerif";
    context.fillStyle = theme.axisColor;
    const w = getW();
    const h = getH();

    context.beginPath();
    for (let y = sY, iy = 1; y <= maxY; y=rd6(sY+aIY*iy++)){
        const realY = getRealY(y);
        context.moveTo(0, realY);
        context.lineTo(w, realY);
        context.fillText(y, 0+5, realY-5);
    }
    for (let x = sX, ix = 1; x <= maxX; x=rd6(sX+aIX*ix++)){
        const realX = getRealX(x);
        context.moveTo(realX, 0);
        context.lineTo(realX, h);
        context.fillText(x, realX+5, h-5);
    }
    context.closePath();
    context.stroke();
}
function drawPoints() {
    const ptSzCoordX = pointSize/scaleX();
    const ptSzCoordY = pointSize/scaleY();
    // это чтобы не рисовать точки за границами экрана
    const minX = Math.max(-1.5, getCoordX(0) - ptSzCoordX);
    const minY = Math.max(-1.5, getCoordY(getH()) - ptSzCoordY);
    const maxX = Math.min(1.5, getCoordX(getW()) + ptSzCoordX);
    const maxY = Math.min(1.5, getCoordY(0) + ptSzCoordY);
    // это чтобы точки проходили через 0
    const pIX = pointIntervalX();
    const pIY = pointIntervalY();
    const sX = Math.ceil(minX/pIX)*pIX;
    const sY = Math.ceil(minY/pIY)*pIY;
    // исли между 4 точками оказалось достаточно места, то заполнить его точкой
    const drawDiagonal = 2*ptSzCoordX <= Math.sqrt(2)*pIX;

    let pointsToCalculate = [];

    const drawPt = (x,y) => {
        const hash = hash2(x,y);
        let res = cache.get(hash);
        const calcDepth = getCalcDepth();
        switch (selectPoint(res)) {
            case 2:
                drawConvergePoint(x,y);
                break;
            case 1:
                const progress = (res.i-1)/(calcDepth-1);
                //console.log(progress+" "+calcDepth+" "+res.i);
                drawUnconvergePoint(x,y, progress);
                break;
            case 0:
                drawUndefinedPoint(x,y);
                pointsToDraw.add(hash); // добавляем точки, которые ещё не отрисованы со сзначением
                pointsToCalculate.push({depth: calcDepth+100, x: x, y: y, i: res.i, zx: res.zx, zy: res.zy});
                break;
            case -1:
                drawUndefinedPoint(x,y);
                pointsToDraw.add(hash); // добавляем точки, которые ещё не отрисованы со сзначением
                pointsToCalculate.push({depth: calcDepth+100, x: x, y: y, i: 1, zx: x, zy: y});
                break;
        }

        if (pointsToCalculate.length > 500) {
            worker.push(pointsToCalculate);
            pointsToCalculate = [];
        }
    }

    pointsToDraw.clear();
    //worker.resetWorkers();

    // округление тут чтобы хэширование (для кэширования) работало (могли создаваться одинаковые ключи)
    for (let x = sX, ix = 1; x <= maxX; x=rd6(sX+pIX*ix++)) {
        for (let y = sY, iy = 1; y <= maxY; y=rd6(sY+pIY*iy++)) {
            drawPt(x,y);
            if (drawDiagonal){
                const xd = rd6(x+pIX/2);
                const yd = rd6(y+pIY/2);
                if (xd <= maxX && yd <= maxY) drawPt(xd, yd);
            }
        }
    }

    worker.push(pointsToCalculate);
}

function drawConvergePoint(x, y){
    context.beginPath();
    context.fillStyle = theme.convergePointColor;
    //context.arc(centerX, centerY, radius, sAngle, eAngle, clockwise) - задать круг
    context.arc(getRealX(x), getRealY(y), pointRadius, 0, 2*Math.PI, false)
    context.fill();
    context.closePath();
}
function drawUnconvergePoint(x, y, p){
    context.beginPath();
    context.fillStyle = theme.getUnconvergePointColor(p);
    context.arc(getRealX(x), getRealY(y), pointRadius, 0, 2*Math.PI, false)
    context.fill();
    context.closePath();
}
function drawUndefinedPoint(x, y){
    context.beginPath();
    context.strokeStyle = theme.undefPointColor;
    const r = pointRadius*0.9;
    const lineW = 0.4*r;
    context.lineWidth = lineW;
    // stroke рисует границу окружности по середине линии окружности, поэтому на полтолщины она выступает наружу радиуса, на полтолщины - внутрь
    context.arc(getRealX(x), getRealY(y), r-lineW/2, 0, 2*Math.PI, false)
    context.stroke();
    context.closePath();
}

function selectPoint(res) { // result = {x, y, converges, i, zx, zy}
    if (res){
        if (res.converges && getCalcDepth()<=res.i || !res.converges && getCalcDepth()<res.i) return 2; // converge point
        else if (!res.converges && getCalcDepth()>=res.i) return 1; // unconverge point
        else return 0; //undefined point
    } else return -1; // no result
}



// получить реальные координаты на холсте в пикселях
function getRealX(pointX){
    return Math.round(centerX+pointX*scaleX());
}
function getRealY(pointY){
    return Math.round(centerY-pointY*scaleY());
}

// получить координаты в системе координат графика
function getCoordX(realX){
    return (realX-centerX)/scaleX();
}
function getCoordY(realY){
    return (centerY-realY)/scaleY();
}


// get canvas width/height
function getW() {
    return canvas.clientWidth;
}
function getH() {
    return canvas.clientHeight;
}







