function* quick(a: number[]): Steps { // Hoare + middle pivot

    let accesses = 0
    let comparisons = 0

    const stack: number[] = [] // all ranges are inclusive
    if (a.length > 1) stack.push(0, a.length - 1)

    while (stack.length > 0) {
        // reversed order!
        const hi = stack.pop()!
        const lo = stack.pop()!

        // partition
        let iPivot = Math.floor((lo + hi) / 2)
        const pivot = a[iPivot]

        let i = lo - 1
        let j = hi + 1

        while (true) {
            do {
                i++
                accesses++, comparisons++
                yield [accesses, comparisons, [i, Math.min(j, hi)], [iPivot], undefined]
            } while (a[i] < pivot)

            do {
                j--
                accesses++, comparisons++
                yield [accesses, comparisons, [i, j], [iPivot], undefined]
            } while (a[j] > pivot)

            if (i >= j) break

            accesses += 2
            a.swap(i, j)
            iPivot = iPivot === i ? j : (iPivot === j ? i : iPivot)
        }

        // recursion (reversed order)
        if (j + 1 < hi) stack.push(j + 1, hi)
        if (   lo <  j) stack.push(   lo,  j)
    }

    return [accesses, comparisons] as [number, number]

}