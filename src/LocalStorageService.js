export const localStorageService = {
    //设置数据
    setItem(key, value) {
        localStorage.setItem(key, value);
    },
    //获取数据
    getItem(key) {
        const value = localStorage.getItem(key);
        return value ? value : null;
    },
    removeItem(key) {
        localStorage.removeItem(key);
    },
    clear() {
        localStorage.clear();
    }
}