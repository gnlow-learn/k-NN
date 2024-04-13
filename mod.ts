const d =
(ax: number, ay: number) =>
(bx: number, by: number) =>
    Math.sqrt(
        (ax - bx) ** 2
        + (ay - by) ** 2
    )

const kNN =
(data: {x: number, y: number, clas: string}[]) =>
([cx, cy]: [number, number]) =>
    data
    .map(({x, y, clas}, i, l) => ({
        x, y, clas,
        distance: d(x, y)(cx, cy)**2,
        weight: 1/d(x, y)(cx, cy)**2,
    }))
    .map((row, _, l) => {
        const { clas } = row
        const rank = l.toSorted((a, b) => a.distance - b.distance).indexOf(row) + 1
        return {
            ...row,
            rank,
            ...(rank <= 3 ? {"k = 3": clas} : {}),
            ...(rank <= 5 ? {"k = 5": clas} : {}),
        }
    })


const format =
(n: number) =>
    Math.round(n * 100) / 100

const objMap =
    <V, O>
    (f: (entry: [string, V]) => [string, O]) => 
    (obj: Record<string, V>) =>
        Object.fromEntries(
            Object.entries(obj).map(f)
        )

const data = `
    1 5 blue
    1 7 blue
    2 6 blue
    4 6 blue
    5 7 blue
    6 4 red
    7 5 red
    4 8 red
    7 8 red
    9 7 red
`
    .trim()
    .split("\n")
    .map(x => x.trim().split(" "))
    .map(([x, y, clas]) => ({
        x: Number(x),
        y: Number(y),
        clas,
    }))
console.table(
    kNN(data)([5, 4.5]).map(
        objMap(([k, v]) => [
            k,
            typeof v == "number"
                ? format(v)
                : v
        ])
    )
)