import React, {ReactNode} from 'react'
import 'react-virtualized/styles.css'
import {WindowScroller, InfiniteLoader, AutoSizer, List, IndexRange} from 'react-virtualized'

type RowRenderProps = {
    index: number,
    key: string,
    style: object
}

type Props<T> = {
    more: boolean,
    loading: boolean,
    items: T[],
    shouldLoadMore: (count: number) => Promise<void>,
    rowHeight: number,
    renderRow: (props: RowRenderProps) => ReactNode
}

class InfiniteList<T> extends React.Component<Props<T>> {

    render(): ReactNode {
        const { more, loading, items, rowHeight, shouldLoadMore, renderRow } = this.props;

        const isRowLoaded: (args: { index: number }) => boolean = ({index}) => !more || index < items.length;
        const loadMoreRows: (args: IndexRange) => Promise<any> = ({stopIndex}) => {
            if (loading) {
                return;
            }
            const loadCount = stopIndex - items.length - 1;
            if (loadCount > 0) {
                return shouldLoadMore(loadCount);
            }
        };

        return (
            <WindowScroller>
                {({ height, isScrolling, scrollTop, onChildScroll}) => (
                    <InfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMoreRows} rowCount={Number.MAX_SAFE_INTEGER}>
                        {({onRowsRendered, registerChild}) => (
                            <AutoSizer disableHeight>
                                {({width}) => (
                                    <div className='list'>
                                        <List
                                            autoHeight
                                            height={height}
                                            isScrolling={isScrolling}
                                            onScroll={onChildScroll}
                                            scrollTop={scrollTop}
                                            width={width}
                                            ref={registerChild}
                                            onRowsRendered={onRowsRendered}
                                            rowRenderer={renderRow}
                                            rowHeight={rowHeight}
                                            rowCount={items.length}
                                        />
                                        <style jsx>{`
                                        .list :global(.ReactVirtualized__Grid) {
                                            outline: none;
                                        }
                                        `}</style>
                                    </div>
                                )}
                            </AutoSizer>
                        )}
                    </InfiniteLoader>
                )}
            </WindowScroller>
        )
    }
}

export default InfiniteList;
