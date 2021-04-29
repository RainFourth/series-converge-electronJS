



class CacheManager {
    cache; // {x, y, converges, i, zx, zy}
    maxSize;

    constructor(maxSize = 100000) {
        this.cache = new Map()
        this.maxSize = maxSize;
    }

    add(hash, data){
        if (this.cache.size >= this.maxSize) this.cache.clear();
        this.cache.set(hash, data);
    }

    get(hash){
        return this.cache.get(hash);
    }
}
