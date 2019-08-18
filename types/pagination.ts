interface Pending {
    state: "pending"
}
interface More<T> {
    state: "more"
    last: T | null
}
interface End {
    state: "end"
}

export function pending(): Pending {
    return { state: "pending" }
}

export function more<T>(last: T = null): More<T> {
    return {
        state: "more",
        last,
    }
}

export function end(): End {
    return { state: "end" }
}


export type Pagination<T> = Pending | More<T> | End
