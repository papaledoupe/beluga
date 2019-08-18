import { NextApiRequest, NextApiResponse } from 'next'
import { TagsResponse } from '../../../../types/tag'
import fetch from 'isomorphic-unfetch'
import suspend from '../../../../util/suspend'

const registryBaseUrl = 'http://localhost:5000/v2';

// Docker registry spec says tags are paginated, but they are not in the currently implementation.
// TODO: submit pull request. https://github.com/docker/distribution
async function getTags(repository: string): Promise<TagsResponse> {
    // if (true) {
    //     return await getTagsStub(repository, pageSize, last);
    // }

    const registryUrl = `${registryBaseUrl}/${repository}/tags/list`;

    const registryResponse = await fetch(registryUrl);
    const registryResponseBody = await registryResponse.json();

    return {
        tags: (registryResponseBody.tags || []).map(repo => ({ version: repo })),
        more: false,
    };
}

export default async function(request: NextApiRequest, response: NextApiResponse) {
    const repository = '' + request.query.repo;

    try {
        const body = await getTags(repository);
        response.status(200).json(body)
    } catch (err) {
        response.status(500).json({ error: err.message || err })
    }
}

const stubDataSetSize = 10;
async function getTagsStub(repository: string): Promise<TagsResponse> {
    const stubData = Array.from(new Array(stubDataSetSize), (_, i) => ({ version: `${repository}-tag-${i}`}));
    await suspend(100);
    return {
        tags: stubData,
        more: false,
    }
}