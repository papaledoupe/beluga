import { NextApiRequest, NextApiResponse } from 'next'
import { Manifest } from '../../../../../types/manifest'
import fetch from 'isomorphic-unfetch'
import suspend from '../../../../../util/suspend'

const registryBaseUrl = 'http://localhost:5000/v2';
const digestHeader = 'Docker-Content-Digest';

type FsLayer = {
    blobSum: string,
}
type RegistryManifest = {
    name: string,
    tag: string,
    fsLayers: FsLayer[],
    architecture: string,
}

async function getManifest(repository: string, tag: string): Promise<Manifest> {
    // if (true) {
    //     return await getManifestStub(repository, tag);
    // }

    const registryUrl = `${registryBaseUrl}/${repository}/manifests/${tag}`;

    const registryResponse: Response = await fetch(registryUrl);
    const registryResponseBody: RegistryManifest = await registryResponse.json();
    let digest = '';
    if (registryResponse.headers.has(digestHeader)) {
        digest = '' + registryResponse.headers.get(digestHeader);
    }

    return {
        name: registryResponseBody.name,
        tag: registryResponseBody.tag,
        fsLayerDigests: registryResponseBody.fsLayers.map(fsLayer => fsLayer.blobSum),
        architecture: registryResponseBody.architecture,
        digest,
    };
}

export default async function(request: NextApiRequest, response: NextApiResponse) {
    const repository = '' + request.query.repo;
    const tag = '' + request.query.tag;

    try {
        const body = await getManifest(repository, tag);
        response.status(200).json(body)
    } catch (err) {
        response.status(500).json({ error: err.message || err })
    }
}

async function getManifestStub(repository: string, tag: string): Promise<Manifest> {
    await suspend(100);
    return {
        name: repository,
        tag,
        architecture: 'noarch',
        digest: 'sha256:adsf1234',
        fsLayerDigests: ['sha256:wasd5678']
    }
}