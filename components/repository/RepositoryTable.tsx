import React, {ReactNode} from 'react'
import InfiniteList from '../common/InfiniteList'
import {end, more, Pagination, pending} from '../../types/pagination'
import {Repository, RepositoriesResponse} from '../../types/repository'
import fetch from 'isomorphic-unfetch'
import RepositoryTableRow from './RepositoryTableRow'
import Input from 'antd/lib/input'
import Result from 'antd/lib/result'
import Button from 'antd/lib/button'
import {TagsResponse} from '../../types/tag';

export type State = {
    pagination: Pagination<string>,
    items: Repository[],
    loading: boolean,
    searchResult: Repository | null | undefined,
}

export const initialPageSize = 100;

class RepositoryTable extends React.Component<{}, State> {
    state: State = {
        pagination: pending(),
        items: [],
        loading: false,
        searchResult: undefined,
    };

    search(repository: string): Promise<void> {
        if (repository === '') {
            this.setState({
                searchResult: undefined,
            });
            return
        }
        return fetch(`/api/repository/${repository}/tags?pageSize=1`)
            .then((res: Response) => res.json())
            .then((tags: TagsResponse) => {
                const exists = tags.tags.length > 0;
                if (exists) {
                    this.setState({
                        searchResult: {
                            name: repository,
                        }
                    })
                } else {
                    this.setState({
                        searchResult: null,
                    })
                }
            })
    }

    async fetchMore(count: number) {
        const { pagination } = this.state;
        let last;
        switch (pagination.state) {
            case 'pending':
                last = null;
                break;
            case 'more':
                last = pagination.last;
                break;
            default:
                return;
        }

        const url = `/api/repositories?pageSize=${count}${last === null ? '' : `&last=${last}`}`;
        this.setState({ loading: true });
        try {
            const res = await fetch(url);
            const repositoryResponse = await res.json() as RepositoriesResponse;
            const repositories = repositoryResponse.repositories;
            const last = repositories.length === 0 ? null : repositories[repositories.length - 1].name;

            this.setState(prev => ({
                pagination: repositoryResponse.more ? more(last) : end(),
                items: prev.items.concat(repositories),
                loading: false,
            }))
        } catch (err) {
            console.log('failed to fetch repos', err);
            this.setState({
                pagination: end(),
                loading: false,
            })
        }
    }

    componentDidMount() {
        this.fetchMore(initialPageSize).catch(console.error)
    }

    render(): ReactNode {
        const { pagination, loading, items, searchResult } = this.state;
        console.log('render', this.state);
        const list = searchResult === undefined ? (
            <InfiniteList
                more={pagination.state !== 'end'}
                loading={loading}
                items={items}
                rowHeight={75}
                shouldLoadMore={(count) => this.fetchMore(count).catch(console.error)}
                renderRow={({index, key, style}) => {
                    return <div key={key} style={style}>
                        <RepositoryTableRow repository={items[index]}/>
                    </div>
                }}
            />
        ) : (
            <div>
                {searchResult === null ? (
                    <Result
                        status='404'
                        title='No results'
                        subTitle='Could not find that repository.'
                        extra={<Button onClick={() => this.search('')}>All repositories</Button>}
                    />
                ) : (
                    <RepositoryTableRow repository={searchResult}/>
                )}
            </div>
        );

        return (
            <div className='repositoryTable'>
                <div className='search'>
                    <Input.Search
                        placeholder='Search by exact name'
                        size='large'
                        enterButton
                        onSearch={term => this.search(term)}
                    />
                </div>
                {list}
                <style jsx>{`
                .repositoryTable .search {
                    margin-bottom: 1em;
                }
                `}</style>
            </div>
        )
    }
}

export default RepositoryTable
