

const defaultCalcDepth = 256;
const defaultNThreads = 1;


const theme = new ThemeManager();
const cache = new CacheManager();
const worker = new WorkerManager(cache, defaultNThreads);




const inputNThreads = document.getElementById("n-threads");
let nThreads;
/*oninput*/
inputNThreads.onchange = ev => {
    const value = ev.target.value;
    if (/^[0-9]+$/.test(value)) {
        setNThreads(value);
    } else {
        setNThreads(nThreads);
    }
}
function setNThreads(n, draw = true) {
    n = Number(n);
    if (n < 1) n = 1;
    else if (n > 32) n = 32;
    inputNThreads.value = n;
    nThreads = n;
    worker.setNWorkers(n);
    if (draw) drawAll();
}
function getNThreads() {
    return nThreads;
}
setNThreads(defaultNThreads, false);



const inputCalcDepth = document.getElementById("calc-depth");
let calcDepth;
/*oninput*/
inputCalcDepth.onchange = ev => {
    const value = ev.target.value;
    if (/^[0-9]+$/.test(value)) {
        setCalcDepth(value);
    } else {
        setCalcDepth(calcDepth);
    }
}
function setCalcDepth(depth, draw = true) {
    depth = Number(depth);
    if (depth < 1) depth = 1;
    else if (depth > 1000000) depth = 1000000;
    inputCalcDepth.value = depth;
    calcDepth = depth;
    if (draw) drawAll();
}
function getCalcDepth() {
    return calcDepth;
}
setCalcDepth(defaultCalcDepth, false);




const btnStopCalc = document.getElementById("stop-calc");
btnStopCalc.onclick = ev => {
    setNThreads(1, false); // здесь же будет выполнен сброс воркеров
    setCalcDepth(defaultCalcDepth, false);
    drawAll();
}



const selectTheme = document.getElementById("theme-select");
{
    let i = 0;
    for(const t of theme.themesMapping){
        selectTheme.options[i] = new Option(...t);
        if (t[1] === theme.theme) selectTheme.selectedIndex = i;
        i++;
    }
}
selectTheme.onchange = ev => {
    theme.setTheme(selectTheme.options[selectTheme.selectedIndex].value);
    drawAll();
}
/*function setTheme(theme, draw = true) {

    theme.setTheme();
    if (draw) drawAll();
}*/
/*function getTheme() {
    return theme.theme;
}*/





/*const btnCalcApply = document.getElementById("calc-apply");
btnCalcApply.onclick = ev => {
    drawAll();
};*/

// onclick - реагирует только на ЛКМ
// МОЖНО ТАК: canvas.addEventListener("click", e => { } );
/*canvas.onclick = ev => {
    let x = getMouseXInElem(ev);
    let y = getMouseYInElem(ev);
    //console.log(x+" "+y);
    x = rd6(getCoordX(x));
    y = rd6(getCoordY(y));
    console.log("graphX: "+x+" graphY: "+y);


    const hash = hash2(x,y);
    let res = cache.get(hash);
    const calcDepth = getCalcDepth();
    switch (selectPoint(res)) {
        case 2:
            console.log(res);
            break;
        case 1:
            console.log(res);
            break;
        case 0:
            worker.push([{depth: calcDepth+100, x: x, y: y, i: res.i, zx: res.zx, zy: res.zy}]);
            break;
        case -1:
            worker.push([{depth: calcDepth+100, x: x, y: y, i: 1, zx: x, zy: y}]);
            break;
    }
}*/



{
    let x, y;
    let wheelHold = false;
    canvas.onmousedown = ev => {
        if (ev.which === 2) {
            wheelHold = true;
            x = getMouseXInElem(ev);
            y = getMouseYInElem(ev);
            canvas.style.cursor = "all-scroll";

            //ev.originalEvent.dataTransfer.dropEffect = 'move';
            //console.log("cx: "+centerX+" cy: "+centerY);
            //console.log(null);
        }
    }
    canvas.onmouseup = ev => {
        if (ev.which === 2) {
            wheelHold = false;
            canvas.style.cursor = ""; // обычный курсор
        }
    }
    canvas.onmousemove = ev => {
        if (wheelHold) {
            //console.log(getMouseXInElem(ev)+" "+getMouseYInElem(ev));
            const newX = getMouseXInElem(ev);
            const newY = getMouseYInElem(ev);
            centerX += newX - x;
            centerY += newY - y;
            //console.log("cx: "+centerX+" cy: "+centerY);
            x = newX;
            y = newY;
            drawAll();
        }
    }
}

canvas.onwheel = ev => {
    // ev.deltaY - прокрутка по оси Y - вверх это -100 единиц, вниз +100 единиц для моей мыши
    if (ev.altKey){
        const add = ev.shiftKey ? 20 : 1;
        if (ev.deltaY < 0){
            setCalcDepth(getCalcDepth()+add);
        } else if (ev.deltaY > 0) {
            setCalcDepth(getCalcDepth()-add);
        }
    } else {
        const x = getMouseXInElem(ev);
        const y = getMouseYInElem(ev);
        let mult = factorX<3 ?  1.15 : 1.5;
        if (ev.shiftKey) mult*=1.25;
        if (ev.deltaY < 0){
            if (factorX >= 1000) return;
            factorX = rd6(factorX*mult);
            factorY = rd6(factorY*mult);
            centerX = x+Math.round((centerX-x)*mult);
            centerY = y+Math.round((centerY-y)*mult);
        } else if (ev.deltaY > 0) {
            if (factorX <= 0.001) return;
            factorX = rd6(factorX/mult);
            factorY = rd6(factorY/mult);
            centerX = x+Math.round((centerX-x)/mult);
            centerY = y+Math.round((centerY-y)/mult);
        }
    }

    drawAll();
}



window.onresize = () => {
    drawAll();
};

// получить координаты курсора мыши относительно левого верхнего угла элемента из event
// pageX - координата X элемента относительно левого верхнего угла страницы
// clientX - координата X элемента относительно левого верхнего угла окна
function getMouseXInElem(ev){
    return ev.pageX - ev.target.offsetLeft;
}
function getMouseYInElem(ev){
    return ev.pageY - ev.target.offsetTop;
}




drawAll();






// надо совместить воркер и промисы для примера, а ещё async await

/*let resolve = (value) => {
    console.log(`Promise ${value} resolved`);
};
const print = (val) => console.log(val);*/
/*let pr1 = new Promise((resolve, reject) => {
    /!*while(true){
        window.setTimeout(()=>print(0), 4000);
    }*!/
    window.setTimeout(() => resolve(0), 4000);
    print("aaa");
});*/

/*let pr2 = new Promise((resolve, reject) => {
    print(1);
    window.setTimeout(() => resolve(1), 4000);
});*/

/*const btnCalcDefault = document.getElementById("calc-default");
btnCalcDefault.onclick = ev => {
    pr1.then(resolve);
    //pr2.then(resolve);
};*/
