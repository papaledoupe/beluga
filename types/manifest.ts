export type Manifest = {
    name: string,
    tag: string,
    architecture: string,
    digest: string,
    fsLayerDigests: string[],
}