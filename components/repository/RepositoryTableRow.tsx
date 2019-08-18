import React, { FunctionComponent } from 'react'
import Identicon from '../common/Identicon'
import {Repository} from '../../types/repository'
import List from 'antd/lib/list'
import Link from 'next/link'

type Props = {
    repository: Repository,
}
const RepositoryTableRow: FunctionComponent<Props> = ({repository}) => {
    return (
        <Link href='/repository/[repo]'
              as={`/repository/${encodeURIComponent(repository.name)}`}>
            <div className='row'>
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Identicon string={repository.name} size={48}/>}
                            title={repository.name}
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

export default RepositoryTableRow
