function* bubble(a: number[]): StepGenerator {
    let accesses = 0
    let comparisons = 0

    for (let n = a.length; n > 1; /* empty */) {
        accesses++
        let m = 0
        for (let i = 1; i < n; i++) {
            accesses++, comparisons++
            yield [accesses, comparisons, [i-1, i]]
            accesses++
            if (a[i-1] > a[i]) {
                a.swap(i-1, i)
                m = i
            }
        }
        accesses++
        n = m
    }

    return [accesses, comparisons] as [number, number]
}
/*

n ← a.length
while n > 1
    x ← a[0]
    m ← 0
    for i in 1 until n
        y ← a[i]
        if x > y
            a[i-1] ← y
            m ← i
        else
            a[i-1] ← x
            x ← y
    a[n-1] ← x
    n ← m

*/

function* bubbleBi(a: number[]): StepGenerator {
    let accesses = 0
    let comparisons = 0

    // inclusive
    let iStart = 0
    let iEnd = a.length-1

    while (iStart < iEnd /* i.e. there are >=2 unsorted elements */) {
        let iNew = iStart

        accesses++
        for (let i = iStart+1; i <= iEnd; i++) {
            accesses++, comparisons++
            yield [accesses, comparisons, [i-1, i]]
            accesses++
            if (a[i-1] > a[i]) {
                a.swap(i-1, i)
                iNew = i
            }
        }
        accesses++

        iEnd = --iNew

        accesses++
        for (let i = iEnd; i > iStart; i--) {
            accesses++, comparisons++
            yield [accesses, comparisons, [i-1, i]]
            accesses++
            if (a[i-1] > a[i]) {
                a.swap(i-1, i)
                iNew = i
            }
        }
        accesses++

        iStart = iNew
    }

    return [accesses, comparisons] as [number, number]
}
