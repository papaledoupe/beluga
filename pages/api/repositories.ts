import { NextApiRequest, NextApiResponse } from 'next'
import { RepositoriesResponse } from '../../types/repository'
import fetch from 'isomorphic-unfetch'
import suspend from '../../util/suspend';

const registryBaseUrl = 'http://localhost:5000/v2';
const defaultPageSize = 1;

async function getRepositories(pageSize: number, last: string | null): Promise<RepositoriesResponse> {
    // if (true) {
    //     return await getRepositoriesStub(pageSize, last);
    // }

    const registryUrl = `${registryBaseUrl}/_catalog?n=${pageSize}${last === null ? '' : `&last=${last}`}`;

    const registryResponse: Response = await fetch(registryUrl);
    const registryResponseBody = await registryResponse.json();

    return {
        repositories: (registryResponseBody.repositories || []).map(repo => ({ name: repo })),
        more: registryResponse.headers.has('last'),
    };
}

export default async function(request: NextApiRequest, response: NextApiResponse) {
    const last = typeof request.query.last === 'string' ? request.query.last : null;
    let pageSize = defaultPageSize;
    if (typeof request.query.pageSize === 'string') {
        const parsedPageSize = parseInt(request.query.pageSize);
        if (!isNaN(parsedPageSize)) {
            pageSize = parsedPageSize;
        }
    }

    try {
        const body = await getRepositories(pageSize, last);
        response.status(200).json(body)
    } catch (err) {
        response.status(500).json({ error: err.message || err })
    }
}

const stubDataSetSize = 1000;
const stubData = Array.from(new Array(stubDataSetSize), (_, i) => ({ name: `repository-${i}`}));
async function getRepositoriesStub(pageSize: number, last: string | null): Promise<RepositoriesResponse> {
    await suspend(100);
    const start = last === null ? 0 : stubData.findIndex(({name}) => name === last) + 1;
    const end = start + pageSize;
    return {
        repositories: stubData.slice(start, end),
        more: end < stubDataSetSize,
    }
}