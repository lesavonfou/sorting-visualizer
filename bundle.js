"use strict";
Array.prototype.shuffle = function () {
    for (let i = this.length; i > 1;)
        this.swap(Math.floor(Math.random() * i--), i);
};
Array.prototype.swap = function (i, j) {
    const t = this[i];
    this[i] = this[j];
    this[j] = t;
};
function randomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}
function* bubble(a) {
    let accesses = 0;
    let comparisons = 0;
    for (let n = a.length; n > 1;) {
        accesses++;
        let m = 0;
        for (let i = 1; i < n; i++) {
            accesses++, comparisons++;
            yield [accesses, comparisons, [i - 1, i], [n], undefined];
            accesses++;
            if (a[i - 1] > a[i]) {
                a.swap(i - 1, i);
                m = i;
            }
        }
        accesses++;
        n = m;
    }
    return [accesses, comparisons];
}
function* counting(a) {
    let accesses = 0;
    let comparisons = 0;
    accesses++;
    let iMax = 0;
    for (let i = 1; i < a.length; i++) {
        accesses++, comparisons++;
        yield [accesses, comparisons, [iMax, i], [], 'finding max'];
        if (a[i] > a[iMax])
            iMax = i;
    }
    const count = new Array(a[iMax] + 1).fill(0);
    accesses += count.length;
    for (let i = 0; i < a.length; i++) {
        accesses += 2;
        count[a[i]]++;
        yield [accesses, comparisons, [], [i], 'counting'];
    }
    accesses += 2 * (count.length - 1);
    for (let i = 1; i < count.length; i++)
        count[i] += count[i - 1];
    const aCopy = Array.from(a);
    for (let i = a.length - 1; i >= 0; i--) {
        accesses += 4;
        const x = aCopy[i];
        const j = (count[x]--) - 1;
        a[j] = x;
        yield [accesses, comparisons, [], [j], 'ordering'];
    }
    return [accesses, comparisons];
}
function* insertion(a) {
    let accesses = 0;
    let comparisons = 0;
    for (let i = 1; i < a.length; i++) {
        accesses++;
        let j = i;
        while (j > 0) {
            accesses++, comparisons++;
            yield [accesses, comparisons, [j - 1, j], [], undefined];
            if (a[j - 1] <= a[j])
                break;
            accesses++;
            a.swap(j - 1, j);
            j--;
        }
        accesses++;
    }
    return [accesses, comparisons];
}
function* merge(a) {
    let accesses = 0;
    let comparisons = 0;
    let b = new Array(a.length);
    for (let width = 1; width < a.length; width *= 2)
        for (let i = 0; i < a.length; i += 2 * width) {
            const pMax = i + width;
            if (pMax >= a.length)
                continue;
            const qMax = Math.min(a.length, i + width * 2);
            let p = i;
            let q = pMax;
            for (let j = i; j < qMax; j++)
                if (p < pMax) {
                    if (q >= qMax) {
                        yield [accesses, comparisons, [p], [], 'merging'];
                        accesses += 2;
                        b[j] = a[p];
                        p++;
                    }
                    else {
                        accesses += 2, comparisons++;
                        yield [accesses, comparisons, [p, q], [], 'merging'];
                        accesses++;
                        if (a[p] <= a[q])
                            b[j] = a[p], p++;
                        else
                            b[j] = a[q], q++;
                    }
                }
                else {
                    yield [accesses, comparisons, [q], [], 'merging'];
                    accesses += 2;
                    b[j] = a[q];
                    q++;
                }
            for (let j = i; j < qMax; j++) {
                accesses += 2;
                a[j] = b[j];
                yield [accesses, comparisons, [], [j], 'copying'];
            }
        }
    return [accesses, comparisons];
}
function* quickHoare(a) {
    let accesses = 0;
    let comparisons = 0;
    const stack = [];
    if (a.length > 1)
        stack.push(0, a.length - 1);
    while (stack.length > 0) {
        const hi = stack.pop();
        const lo = stack.pop();
        let iPivot;
        if (hi - lo < 25) {
            accesses++;
            iPivot = Math.floor((lo + hi) / 2);
        }
        else {
            const indices = [randomInt(lo, hi), randomInt(lo, hi), randomInt(lo, hi)];
            accesses += 2, comparisons++;
            yield [accesses, comparisons, [indices[0], indices[1]], [], 'picking pivot'];
            if (a[indices[0]] > a[indices[1]])
                indices.swap(0, 1);
            accesses++, comparisons++;
            yield [accesses, comparisons, [indices[0], indices[2]], [], 'picking pivot'];
            if (a[indices[0]] > a[indices[2]])
                indices.swap(0, 2);
            comparisons++;
            yield [accesses, comparisons, [indices[1], indices[2]], [], 'picking pivot'];
            if (a[indices[1]] > a[indices[2]])
                indices.swap(1, 2);
            iPivot = indices[1];
        }
        const pivot = a[iPivot];
        let i = lo - 1;
        let j = hi + 1;
        while (true) {
            do {
                i++;
                accesses++, comparisons++;
                if (i < j)
                    yield [accesses, comparisons, j <= hi ? [i, j] : [i], [iPivot], 'partitioning'];
            } while (a[i] < pivot);
            do {
                j--;
                accesses++, comparisons++;
                if (i < j)
                    yield [accesses, comparisons, [i, j], [iPivot], 'partitioning'];
            } while (a[j] > pivot);
            if (i >= j)
                break;
            accesses += 2;
            a.swap(i, j);
            iPivot = iPivot === i ? j : (iPivot === j ? i : iPivot);
        }
        if (j + 1 < hi)
            stack.push(j + 1, hi);
        if (lo < j)
            stack.push(lo, j);
    }
    return [accesses, comparisons];
}
function* selection(a) {
    let accesses = 0;
    let comparisons = 0;
    for (let i = 0; i < a.length - 1; i++) {
        accesses++;
        let jMin = i;
        for (let j = i + 1; j < a.length; j++) {
            accesses++, comparisons++;
            yield [accesses, comparisons, [jMin, j], [i - 1], undefined];
            if (a[j] < a[jMin]) {
                accesses++;
                jMin = j;
            }
        }
        if (i !== jMin) {
            accesses++;
            a.swap(i, jMin);
        }
    }
    return [accesses, comparisons];
}
function* shaker(a) {
    let accesses = 0;
    let comparisons = 0;
    let iStart = 0;
    let iEnd = a.length - 1;
    while (iStart < iEnd) {
        let iNew = iStart;
        accesses++;
        for (let i = iStart + 1; i <= iEnd; i++) {
            accesses++, comparisons++;
            yield [accesses, comparisons, [i - 1, i], [iStart - 1, iEnd + 1], undefined];
            accesses++;
            if (a[i - 1] > a[i]) {
                a.swap(i - 1, i);
                iNew = i;
            }
        }
        accesses++;
        iEnd = --iNew;
        accesses++;
        for (let i = iEnd; i > iStart; i--) {
            accesses++, comparisons++;
            yield [accesses, comparisons, [i - 1, i], [iStart - 1, iEnd + 1], undefined];
            accesses++;
            if (a[i - 1] > a[i]) {
                a.swap(i - 1, i);
                iNew = i;
            }
        }
        accesses++;
        iStart = iNew;
    }
    return [accesses, comparisons];
}
function* shell(a) {
    let accesses = 0;
    let comparisons = 0;
    const gaps = [1750, 701, 301, 132, 57, 23, 10, 4, 1];
    for (const g of gaps)
        for (let i = g; i < a.length; i++) {
            accesses++;
            let j = i;
            for (; j >= g; j -= g) {
                accesses++, comparisons++;
                yield [accesses, comparisons, [j - g, j], [], undefined];
                if (a[j - g] <= a[j])
                    break;
                accesses++;
                a.swap(j - g, j);
            }
            accesses++;
        }
    return [accesses, comparisons];
}
function update(time) {
    var _a, _b;
    if (lastTime === undefined)
        lastTime = time;
    let steps = Math.round((time - lastTime) / msPerStep);
    lastTime += steps * msPerStep;
    let state;
    while (steps-- > 0) {
        state = algorithm.next();
        if (state.done)
            break;
    }
    if (state === undefined || !state.done)
        window.requestAnimationFrame(update);
    if (state === undefined)
        return;
    document.querySelector('#accesses').textContent = state.value[0].toString();
    document.querySelector('#comparisons').textContent = state.value[1].toString();
    document.querySelector('#status').textContent = state.value[4] ? `(${state.value[4]})` : null;
    ctx.clearRect(0, 0, can.width, can.height);
    for (let i = 0; i < barCount; i++) {
        ctx.fillStyle = 'black';
        if ((_a = state.value[3]) === null || _a === void 0 ? void 0 : _a.includes(i))
            ctx.fillStyle = 'limegreen';
        if ((_b = state.value[2]) === null || _b === void 0 ? void 0 : _b.includes(i))
            ctx.fillStyle = 'red';
        ctx.fillRect(padding + i * barWidthOuter, can.height, barWidth, -can.height * (0.1 + 0.9 * array[i] / (barCount - 1)));
    }
}
const can = document.querySelector('canvas');
const ctx = can.getContext('2d');
can.width = Math.min(800, screen.width);
const barCount = Math.pow(2, (screen.width < 500 ? 6 : 7));
const barWidthOuter = Math.floor((can.width + 1) / barCount);
const barWidth = barWidthOuter <= 3 ? barWidthOuter : barWidthOuter - 1;
const padding = Math.floor(0.5 * (can.width + 1 - barCount * barWidthOuter));
const msPerStep = 20;
const array = [];
for (let i = 0; i < barCount; i++)
    array[i] = i;
array.shuffle();
let algorithm = quickHoare(array);
let lastTime;
window.requestAnimationFrame(update);