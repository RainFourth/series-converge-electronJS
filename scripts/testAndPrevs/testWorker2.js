onmessage = ev => {
    let obj = ev.data;
    obj.i = 10000000;
    postMessage(obj);
}