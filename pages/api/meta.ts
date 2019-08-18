import {NextApiRequest, NextApiResponse} from 'next'
import fetch from 'isomorphic-unfetch'
import suspend from '../../util/suspend'
import {Meta} from '../../types/registry'

const registryBaseUrl = 'http://localhost:5000/v2';
const apiVersionHeader = 'Docker-Distribution-Api-Version';
const appVersion = require('../../package.json').version;

async function getMeta(): Promise<Meta> {
    // if (true) {
    //     return await getStubMeta();
    // }

    const registryUrl = `${registryBaseUrl}/`;
    const registryResponse: Response = await fetch(registryUrl);
    const registryApiVersion = registryResponse.headers.has(apiVersionHeader) ?
        registryResponse.headers.get(apiVersionHeader)
        : 'unknown';

    return {
        registryApiVersion,
        registryBaseUrl,
        appVersion,
    };
}

export default async function(request: NextApiRequest, response: NextApiResponse) {
    try {
        const body = await getMeta();
        response.status(200).json(body)
    } catch (err) {
        response.status(500).json({ error: err.message || err })
    }
}

async function getStubMeta(): Promise<Meta> {
    await suspend(100);
    return Promise.resolve({
        registryApiVersion: 'stub',
        registryBaseUrl,
        appVersion,
    })
}