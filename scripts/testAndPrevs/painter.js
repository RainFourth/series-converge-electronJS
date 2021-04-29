

const calcWorker = new Worker("scripts/calcWorker.js");

const canvas = document.querySelector("canvas");

const context = canvas.getContext("2d");
// надо хранить координаты центра + масштаб, наверное до центра...

// пределы графика: [-1.5; 1.5] по обоим осям
const graph1X = 150; // в единице графика по оси X будет graph1X пикселей
const graph1Y = 150; // в единице графика по оси Y будет graph1Y пикселей
let factorX = 1;
let factorY = 1;
let centerX = getW()/2;
let centerY = getH()/2;


const pointInterval1x = 0.1; // количество точек в 0.1 единице графика
let pointRadius = 5;
let pointSize = getRealX(pointInterval1x);
//let pointInterval = pointInterval1x;
function pointIntervalX() {
    const log2 = Math.floor(Math.log2(factorX));
    return rd6(pointInterval1x/(Math.pow(2, log2)));
}
function pointIntervalY() {
    const log2 = Math.floor(Math.log2(factorY));
    return rd6(pointInterval1x/(Math.pow(2, log2)));
}

const axisInterval1x = 0.5;
function axisIntervalX() {
    const log2 = Math.floor(Math.log2(factorX));
    return rd6(axisInterval1x/(Math.pow(2, log2)));
}
function axisIntervalY() {
    const log2 = Math.floor(Math.log2(factorY));
    return rd6(axisInterval1x/(Math.pow(2, log2)));
}




// todo останавливать перерисовку когда она уже не нужна - хз как, потому что язык то синхронный
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

    // drawBackground:
    context.fillStyle = "#ecedea"; // или "#ecedeaff" в rgba, где последнее - непрозрачность
    context.fillRect(0, 0, w, h);




    drawAxis();
    /*
    context.strokeStyle = "#202020";
    context.lineWidth = 1.1;

    context.beginPath();

    // ось X
    context.moveTo(0,centerY);
    context.lineTo(w, centerY);

    // ось Y
    context.moveTo(centerX,0);
    context.lineTo(centerX, h);

    // хз почему, но последняя линия при lineWidth = 1 рисуется немного более яркой
    // при lineWidth = 1.1 норм
    context.closePath();
    context.stroke();
    */


    drawPoints();


    //testCircle();
}

function drawAxis() {
    // это чтобы не рисовать оси за границами экрана
    const minX = Math.max(-1.5, getCoordX(0));
    const minY = Math.max(-1.5, getCoordY(getH()));
    const maxX = Math.min(1.5, getCoordX(getW()));
    const maxY = Math.min(1.5, getCoordY(0));
    // это чтобы оси проходили через 0
    const pX = axisIntervalX();
    const pY = axisIntervalY();
    const sX = Math.ceil(minX/pX)*pX;
    const sY = Math.ceil(minY/pY)*pY;

    context.strokeStyle = "#202020";
    context.lineWidth = 1.1;
    context.font = "16px SansSerif";
    context.fillStyle = "#202020";
    const w = getW();
    const h = getH();

    context.beginPath();
    for (let y = sY; y <= maxY; y=rd6(y+pY)){
        const realY = getRealY(y);
        context.moveTo(0, realY);
        context.lineTo(w, realY);
        context.fillText(y, 0+5, realY-5);
    }
    for (let x = sX; x <= maxX; x=rd6(x+pX)){
        const realX = getRealX(x);
        context.moveTo(realX, 0);
        context.lineTo(realX, h);
        context.fillText(x, realX+5, h-5);
    }
    context.closePath();
    context.stroke();
}


function drawPoints() {
    // это чтобы не рисовать точки за границами экрана
    const minX = Math.max(-1.5, getCoordX(0));
    const minY = Math.max(-1.5, getCoordY(getH()));
    const maxX = Math.min(1.5, getCoordX(getW()));
    const maxY = Math.min(1.5, getCoordY(0));
    // это чтобы точки проходили через 0
    const pX = pointIntervalX();
    const pY = pointIntervalY();
    const sX = Math.ceil(minX/pX)*pX;
    const sY = Math.ceil(minY/pY)*pY;

    //context.arc(centerX, centerY, radius, sAngle, eAngle, clockwise) - задать круг
    for (let x = sX; x <= maxX; x=rd6(x+pX)) {
        //console.log(x);
        for (let y = sY; y <= maxY; y=rd6(y+pY)) {
            //calcWorker.postMessage({depth: getCalcDepth(), x: x, y: y});

            const result = converges(getCalcDepth(), x, y);
            if (result){
                context.beginPath();
                //context.fillStyle = result.converges ? "#8c7247" : "#4f1911";
                context.fillStyle = result.converges ? "#8c7247" : "#d0d0d0";
                context.arc(getRealX(x), getRealY(y), pointRadius, 0, 2*Math.PI, false)
                context.fill();
                context.closePath();
            } else {
                context.beginPath();
                context.strokeStyle = "#d0d0d0";
                context.lineWidth = 2;
                context.arc(getRealX(x), getRealY(y), pointRadius, 0, 2*Math.PI, false)
                context.stroke();
                context.closePath();
            }

        }
    }
    /*for (let x = -1.5; x <= 1.5; x=rd6(x+pointInterval)) {
        //console.log(x);
        for (let y = -1.5; y <= 1.5; y=rd6(y+pointInterval)) {
            const result = converges(Number(inputCalcDepth.value), x, y);
            context.beginPath();
            //context.fillStyle = result.converges ? "#8c7247" : "#4f1911";
            context.fillStyle = result.converges ? "#8c7247" : "#b0b0b0";
            const r = 5;
            context.arc(getRealX(x), getRealY(y), r, 0, 2*Math.PI, false)
            context.fill();
        }
    }*/
}


calcWorker.onmessage = ev => {
    const result = ev.data;
    context.fillStyle = result.converges ? "#8c7247" : "#d0d0d0";
    context.beginPath();
    context.arc(getRealX(result.x), getRealY(result.y), pointRadius, 0, 2*Math.PI, false)
    context.fill();
    context.closePath();
}

// получить реальные координаты на холсте в пикселях
function getRealX(pointX){
    return centerX+pointX*scaleX();
}
function getRealY(pointY){
    return centerY-pointY*scaleY();
}

// получить координаты в системе координат графика
function getCoordX(realX){
    return (realX-centerX)/scaleX();
}
function getCoordY(realY){
    return (centerY-realY)/scaleY();
}

// get Scales
function scaleX() {
    return graph1X*factorX;
}
function scaleY() {
    return graph1Y*factorY;
}

// округлить до 6 знаком после запятой
function rd6(n) {
    return round(n, 6)
}
function round(n, scale) {
    scale = Math.pow(10, scale);
    return Math.round(n*scale)/scale;
}

// get canvas width/height
function getW() {
    return canvas.clientWidth;
}
function getH() {
    return canvas.clientHeight;
}








function testCircle() {
    context.fillStyle = "#4f1911";
    //context.arc(centerX, centerY, radius, sAngle, eAngle, clockwise)
    context.arc(getRealX(-1), getRealY(-1), 20, 0, 2*Math.PI, false);
    context.fill();
}

