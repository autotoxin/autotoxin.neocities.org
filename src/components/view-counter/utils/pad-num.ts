export const padNum = (num: number, size: number) => {
    let padNum = num.toString();
    while (padNum.length < size) {
        padNum = "0" + padNum;
    }
    return padNum;
};
