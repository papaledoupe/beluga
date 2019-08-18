import React, { FunctionComponent } from 'react'
import Descriptions from 'antd/lib/descriptions'

type Props = {
    digest: string,
    architecture: string,
}

const TagDescription: FunctionComponent<Props> = ({ digest, architecture }) => (
    <div className='description'>
        <h3>Information</h3>
        <Descriptions bordered column={1}>
            <Descriptions.Item label='Digest'>{digest}</Descriptions.Item>
            <Descriptions.Item label='Arch'>{architecture}</Descriptions.Item>
        </Descriptions>
        <style jsx>{`
            h3 {
                margin-bottom: 1em;
            }
        `}</style>
    </div>
);

export default TagDescription
