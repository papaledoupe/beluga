import React, { FunctionComponent } from 'react'
import Icon from 'antd/lib/icon'
import message from 'antd/lib/message'
import { CopyToClipboard } from 'react-copy-to-clipboard'

type Props = {
    baseUrl: string,
    repository: string,
    tag: string,
}

const TagPullCommand: FunctionComponent<Props> = ({ baseUrl, repository, tag }) => {
    const onCopy = (text, result) => {
        if (result) {
            message.success('Copied to clipboard')
        } else {
            message.error('Could not copy');
        }
    };

    const cmd = `docker pull ${baseUrl}/${repository}:${tag}`;

    return (
        <div className='shell'>
            <pre className='prompt'>$</pre>
            <pre className='cmd'>{cmd}</pre>
            <span>
                <CopyToClipboard text={cmd} onCopy={onCopy}>
                    <Icon type="copy" />
                </CopyToClipboard>
            </span>
            <style jsx>{`
                .shell {
                    display: flex;
                    align-items: center;
                    background-color: #445d6e;
                    padding: 0.5em;
                    color: rgba(255, 255, 255, 0.5);
                }
                .shell pre {
                    margin: 0;
                    padding: 0.5em;
                }
                .shell pre.cmd {
                    color: white;
                    flex-grow: 1;
                }
                .shell span {
                    font-size: 1.6em;
                    padding-left: 0.5em;
                }
                .shell span:hover {
                    color: white;
                    cursor: pointer;
                }
            `}</style>
        </div>
    )
};

export default TagPullCommand
