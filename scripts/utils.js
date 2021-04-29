

function hash2(x, y) {
    return x+";"+y;
}

function rd3(n) { return round(n, 3) }
// округлить до 6 знаков после запятой
function rd6(n) { return round(n, 6) }
function rd10(n) { return round(n, 10) }
function round(n, scale) {
    scale = Math.pow(10, scale);
    return Math.round(n*scale)/scale;
}