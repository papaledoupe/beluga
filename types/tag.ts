export type Tag = {
    version: string,
}

export type TagsResponse = {
    tags: Tag[],
    more: boolean,
}