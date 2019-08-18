import React from 'react'
import {shallow, ShallowWrapper} from 'enzyme'
import * as fetch from 'isomorphic-unfetch'
import TagTable, {Props, State, initialPageSize} from './TagTable'
import {TagsResponse} from '../../types/tag'
import {end, more} from '../../types/pagination'

jest.mock('isomorphic-unfetch');
const fetchMock = fetch.default as jest.Mock;

describe('TagTable', () => {

    beforeEach(() => {
        fetchMock.mockReset()
    });

    it('loads first page of tags', () => {
        const tagsResponse: TagsResponse = {
            tags: [],
            more: false,
        };

        fetchMock.mockImplementation(() => ({
            json: jest.fn(() => tagsResponse)
        }));

        shallow(<TagTable repository='repo' />);

        expect(fetchMock.mock.calls.length).toEqual(1);
        expect(fetchMock.mock.calls[0]).toEqual([`/api/repository/repo/tags?pageSize=${initialPageSize}`])
    });

    it('urlencodes repository name', () => {
        // this prevents slashes in repository name (very common) from breaking API routing.

        const tagsResponse: TagsResponse = {
            tags: [],
            more: false,
        };

        fetchMock.mockImplementation(() => ({
            json: jest.fn(() => tagsResponse)
        }));

        shallow(<TagTable repository='scope/repo' />);

        expect(fetchMock.mock.calls.length).toEqual(1);
        expect(fetchMock.mock.calls[0]).toEqual([`/api/repository/scope%2Frepo/tags?pageSize=${initialPageSize}`])
    });

    it('displays loaded tags', async () => {
        const tagsResponse: TagsResponse = {
            tags: [
                { version: "v1" },
                { version: "v2" },
            ],
            more: false,
        };
        const jsonPromise = Promise.resolve(tagsResponse);

        fetchMock.mockImplementation(() => ({
            json: () => jsonPromise
        }));

        const table = shallow(<TagTable repository='repo' />);

        await jsonPromise;
        await table.update();
        expect(table.props().items).toEqual([
            { version: "v1" },
            { version: "v2" },
        ])
    });

    describe('fetchMore', () => {

        it('paginates', async () => {
            const page1Promise = Promise.resolve({
                tags: [ { version: 'v1' }, { version: 'v2' } ],
                more: true,
            });
            const page2Promise = Promise.resolve({
                tags: [ { version: 'v3' }, { version: 'v4' } ],
                more: true,
            });
            const page3Promise = Promise.resolve({
                tags: [ { version: 'v5' } ],
                more: false,
            });

            fetchMock
                .mockImplementationOnce(() => ({
                    json: () => page1Promise
                }))
                .mockImplementationOnce(() => ({
                    json: () => page2Promise
                }))
                .mockImplementationOnce(() => ({
                    json: () => page3Promise
                }));

            const table: ShallowWrapper<Props, State, TagTable> = shallow(<TagTable repository='repo' />);
            // first page on load
            await page1Promise;
            await table.update();

            expect(fetchMock.mock.calls.length).toEqual(1);
            expect(table.state('pagination')).toEqual(more('v2'));

            // request second page
            await table.instance().fetchMore(1);
            await table.update();

            expect(fetchMock.mock.calls.length).toEqual(2);
            expect(table.state('pagination')).toEqual(more('v4'));

            // request third and final page
            await table.instance().fetchMore(1);
            await table.update();

            expect(fetchMock.mock.calls.length).toEqual(3);
            expect(table.state('pagination')).toEqual(end());

            // no more pages will be requested
            await table.instance().fetchMore(1);
            await table.update();

            expect(fetchMock.mock.calls.length).toEqual(3);
        });

    });

});
