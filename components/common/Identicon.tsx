import React, {FunctionComponent} from 'react'
import md5 from 'md5';

type Props = {
    string: string,
    size: number,
}

const Identicon: FunctionComponent<Props> = ({string, size}) => {
    const hash = md5(string);
    const url = `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon&f=y`;
    return (
        <div className='identicon'>
            <style jsx>{`
            .identicon {
                background: #ccc url(${url}) no-repeat;
                width: ${size}px;
                height: ${size}px;
            }
            `}</style>
        </div>
    )
};

export default Identicon

