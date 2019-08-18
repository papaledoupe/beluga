import React, { FunctionComponent } from 'react'
import Timeline from 'antd/lib/timeline'

type Props = {
    fsLayerDigests: string[],
}

const TagLayers: FunctionComponent<Props> = ({ fsLayerDigests }) => (
    <div className='layers'>
        <h3>Layers</h3>
        <Timeline>
            {fsLayerDigests.map(fsLayerDigest =>
                <Timeline.Item key={fsLayerDigest}>
                    {fsLayerDigest}
                </Timeline.Item>
            )}
        </Timeline>
        <style jsx>{`
        .layers h3 {
            margin-bottom: 1em;
        }
        `}</style>
    </div>
);

export default TagLayers
