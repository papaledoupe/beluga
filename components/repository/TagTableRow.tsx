import React, {FunctionComponent} from 'react'
import Identicon from '../common/Identicon'
import List from 'antd/lib/list'
import Link from 'next/link'
import {Tag} from '../../types/tag'

type Props = {
    repository: string,
    tag: Tag,
}
const TagTableRow: FunctionComponent<Props> = ({repository, tag}) => {
    return (
        <Link href='/repository/[repo]/tag/[tag]'
              as={`/repository/${encodeURIComponent(repository)}/tag/${encodeURIComponent(tag.version)}`}>
            <div className='row'>
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Identicon string={tag.version} size={48}/>}
                            title={tag.version}
                            description='Blah de bla'
                        />
                    </List.Item>
                    <style jsx>{`
                    .row {
                        padding: 0 20px;
                        background: #fff;
                        cursor: pointer;
                    }
                    `}</style>
            </div>
        </Link>
    )
};

export default TagTableRow
