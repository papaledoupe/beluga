export type Repository = {
    name: string
}

export type RepositoriesResponse = {
    repositories: Repository[],
    more: boolean,
}
