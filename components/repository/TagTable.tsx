import React, {ReactNode} from 'react'
import InfiniteList from '../common/InfiniteList'
import {end, more, Pagination, pending} from '../../types/pagination'
import {Tag, TagsResponse} from '../../types/tag'
import TagTableRow from './TagTableRow'
import fetch from 'isomorphic-unfetch'

export type Props = {
    repository: string,
}
export type State = {
    pagination: Pagination<string>,
    items: Tag[],
    loading: boolean,
}

export const initialPageSize = 100;

class TagTable extends React.Component<Props, State> {
    state: State = {
        pagination: pending(),
        items: [],
        loading: false,
    };

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

        const url = `/api/repository/${encodeURIComponent(this.props.repository)}/tags?pageSize=${count}${last === null ? '' : `&last=${last}`}`;
        this.setState({ loading: true });
        try {
            const res = await fetch(url);
            const tagResponse = await res.json() as TagsResponse;
            const tags = tagResponse.tags;
            const last = tags.length === 0 ? null : tags[tags.length - 1].version;

            this.setState(prev => ({
                pagination: tagResponse.more ? more(last) : end(),
                items: prev.items.concat(tags),
                loading: false,
            }))
        } catch (err) {
            console.log('failed to fetch tags', err);
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
        const { repository } = this.props;
        const { pagination, loading, items } = this.state;
        return (
            <InfiniteList
                more={pagination.state !== 'end'}
                loading={loading}
                items={items}
                rowHeight={75}
                shouldLoadMore={(count) => this.fetchMore(count).catch(console.error)}
                renderRow={({index, key, style}) => {
                    return <div key={key} style={style}>
                        <TagTableRow repository={repository} tag={items[index]}/>
                    </div>
                }}
            />
        )
    }
}

export default TagTable
