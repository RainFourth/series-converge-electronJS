

/*
Один Worker - один поток.
Одному воркеру можно кидать кучу сообщений (worker.postmessage(msg)), он всё выполнит последовательно.
Из воркера можно посылать обратно сообщения хоть сколько раз (postmessage(msg)) во время выполнения единственной работы.
Вызов worker.terminate() прерывает текущую задачу и не даёт выполнится всем уже переданным задачам и не даёт передать ещё задачи - в оющем надо создавать новый Worker.
 */


// todo останавливать вычисления если результаты больше не нужны - хз как, потому что нет связи от основного потока к воркеру, пока он выполняется
class WorkerManager {
    workers;
    nWorkers;
    curr;

    cache;


    constructor(cache, nWorkers = 1) {
        this.nWorkers = nWorkers;
        this.curr = 0;
        this.workers = [];
        this.cache = cache;
        this.resetWorkers();
    }

    setNWorkers(nWorkers){
        this.nWorkers = nWorkers;
        this.curr = 0;
        this.resetWorkers();
    }

    resetWorkers() {
        for (let i = 0; i < this.workers.length; i++) {
            if (this.workers[i]) this.workers[i].terminate();
        }
        this.workers = [];
        for (let i = 0; i < this.nWorkers; i++) {
            const w = new Worker("scripts/workerCode.js");
            w.onmessage = (ev) => this.calcWorkerCallback(ev);
            this.workers.push(w);
        }
    }


    push(msg){
        this.workers[this.curr].postMessage(msg);
        this.curr = (this.curr+1)%this.nWorkers;
    }


    calcWorkerCallback(ev){
        const resArr = ev.data;
        const cache = this.cache;
        for (let i = 0; i < resArr.length; i++) {
            let res = resArr[i];
            const hash = hash2(res.x,res.y);
            //console.log("worked");
            let ch = cache.get(hash);
            if (ch){
                if (ch.i<res.i) cache.add(hash, res);
                else res = ch;
            } else cache.add(hash, res);

            if (pointsToDraw.has(hash)) {
                const calcDepth = getCalcDepth();
                switch (selectPoint(res)) {
                    case 2:
                        drawConvergePoint(res.x,res.y);
                        pointsToDraw.delete(hash);
                        break;
                    case 1:
                        const progress = (res.i-1)/(calcDepth-1);
                        drawUnconvergePoint(res.x, res.y, progress);
                        pointsToDraw.delete(hash);
                        break;
                }
            }
        }
    }

}