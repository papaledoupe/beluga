import React from 'react'
import {shallow, ShallowWrapper} from 'enzyme'
import * as fetch from 'isomorphic-unfetch'
import RepositoryTable, {initialPageSize, State} from './RepositoryTable'
import {RepositoriesResponse} from '../../types/repository'
import {end, more} from '../../types/pagination'
import InfiniteList from '../common/InfiniteList'
import RepositoryTableRow from './RepositoryTableRow'

jest.mock('isomorphic-unfetch');
const fetchMock = fetch.default as jest.Mock;

describe('RepositoryTable', () => {

    beforeEach(() => {
        fetchMock.mockReset()
    });

    it('loads first page of repositories', () => {
        const repositoriesResponse: RepositoriesResponse = {
            repositories: [],
            more: false,
        };

        fetchMock.mockImplementation(() => ({
            json: jest.fn(() => repositoriesResponse)
        }));

        shallow(<RepositoryTable />);

        expect(fetchMock.mock.calls.length).toEqual(1);
        expect(fetchMock.mock.calls[0]).toEqual([`/api/repositories?pageSize=${initialPageSize}`])
    });

    it('urlencodes repository name', () => {
        // this prevents slashes in repository name (very common) from breaking API routing.

        const repositoriesResponse: RepositoriesResponse = {
            repositories: [],
            more: false,
        };

        fetchMock.mockImplementation(() => ({
            json: jest.fn(() => repositoriesResponse)
        }));

        shallow(<RepositoryTable />);

        expect(fetchMock.mock.calls.length).toEqual(1);
        expect(fetchMock.mock.calls[0]).toEqual([`/api/repositories?pageSize=${initialPageSize}`])
    });

    it('displays loaded repositories', async () => {
        const repositoriesResponse: RepositoriesResponse = {
            repositories: [
                { name: "r1" },
                { name: "r2" },
            ],
            more: false,
        };
        const jsonPromise = Promise.resolve(repositoriesResponse);

        fetchMock.mockImplementation(() => ({
            json: () => jsonPromise
        }));

        const table = shallow(<RepositoryTable />);

        await jsonPromise;
        await table.update();
        console.log('test')
        const list = table.find('InfiniteList') as ShallowWrapper<any, any, InfiniteList<any>>;
        expect(list.props().items).toEqual([
            { name: "r1" },
            { name: "r2" },
        ])
    });

    it('fetches specific repository on search', async () => {
        fetchMock.mockImplementation(url => {
            if (url === `/api/repositories?pageSize=${initialPageSize}`) {
                // initial page load of all repositories
                return Promise.resolve({ json: () => ({
                        repositories: [],
                        more: false
                    })})
            } else if (url === '/api/repository/repo/tags?pageSize=1') {
                // search for specific repository, with result
                return Promise.resolve({ json: () => ({
                        tags: [{ version: "v1", more: false }],
                        more: false
                    })})
            } else {
                throw `unexpected URL argument ${url}`;
            }
        });

        const table: ShallowWrapper<{}, State, RepositoryTable> = shallow(<RepositoryTable />);

        await table.instance().search('repo');

        expect(fetchMock.mock.calls.some(call => call[0] === '/api/repository/repo/tags?pageSize=1')).toBe(true)
    });

    it('displays specific repository search result', async () => {
        fetchMock.mockImplementation(url => {
            if (url === `/api/repositories?pageSize=${initialPageSize}`) {
                // initial page load of all repositories
                return Promise.resolve({ json: () => ({
                        repositories: [],
                        more: false
                    })})
            } else if (url === '/api/repository/repo/tags?pageSize=1') {
                // search for specific repository, with result
                return Promise.resolve({ json: () => ({
                        tags: [{ version: "v1", more: false }],
                        more: false
                    })})
            } else {
                throw `unexpected URL argument ${url}`;
            }
        });

        const table: ShallowWrapper<{}, State, RepositoryTable> = shallow(<RepositoryTable />);

        const expectedRepo = { name: 'repo' };
        await table.instance().search('repo');
        expect(table.state().searchResult).toEqual(expectedRepo);
        const row = table.find('RepositoryTableRow') as ShallowWrapper<any, any, any>;
        expect(row.props().repository).toEqual(expectedRepo)
    });

    it('displays no results when search has no matching repository', async () => {
        fetchMock.mockImplementation(url => {
            if (url === `/api/repositories?pageSize=${initialPageSize}`) {
                // initial page load of all repositories
                return Promise.resolve({ json: () => ({
                        repositories: [],
                        more: false
                    })})
            } else if (url === '/api/repository/repo/tags?pageSize=1') {
                // search for specific repository, with no result
                return Promise.resolve({ json: () => ({
                        tags: [],
                        more: false
                    })})
            } else {
                throw `unexpected URL argument ${url}`;
            }
        });

        const table: ShallowWrapper<{}, State, RepositoryTable> = shallow(<RepositoryTable />);

        await table.instance().search('repo');
        expect(table.state().searchResult).toEqual(null);
        const row = table.find('Result') as ShallowWrapper<any, any, any>;
        expect(row.props().title).toEqual('No results')
    });

    describe('fetchMore', () => {

        it('paginates', async () => {
            const page1Promise: Promise<RepositoriesResponse> = Promise.resolve({
                repositories: [ { name: 'r1' }, { name: 'r2' } ],
                more: true,
            });
            const page2Promise: Promise<RepositoriesResponse> = Promise.resolve({
                repositories: [ { name: 'v3' }, { name: 'v4' } ],
                more: true,
            });
            const page3Promise: Promise<RepositoriesResponse> = Promise.resolve({
                repositories: [ { name: 'v5' } ],
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

            const table: ShallowWrapper<{}, State, RepositoryTable> = shallow(<RepositoryTable />);
            // first page on load
            await page1Promise;
            await table.update();

            expect(fetchMock.mock.calls.length).toEqual(1);
            expect(table.state('pagination')).toEqual(more('r2'));

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
