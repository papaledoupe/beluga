import React, {FunctionComponent} from 'react'
import AntAvatar from 'antd/lib/avatar'
import {User} from '../../types/user'

type Props = {
    user: User
}

const Avatar: FunctionComponent<Props> = ({user}) => (
    <span className='avatar'>
        <AntAvatar />
        <span className='username'>{user.name}</span>
        <style jsx>{`
        .avatar {
            color: #fff;
        }
        .avatar span {
            padding-left: 1em;
        }
        `}</style>
    </span>
);

export default Avatar