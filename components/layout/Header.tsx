import React, {FunctionComponent} from 'react'
import Icon from 'antd/lib/icon'
import Menu from 'antd/lib/menu'
import Layout from 'antd/lib/layout'
import {useRouter} from "next/router"
import Link from 'next/link'
import Avatar from '../common/Avatar'

const Header: FunctionComponent<{}> = () => {
    const router = useRouter();
    return (
        <div className='header'>
            <Layout.Header>
                <Menu mode='horizontal' theme='dark' selectedKeys={[router.route]}>
                    <Menu.Item key='/'>
                        <Link href='/'>
                            <span>
                                <Icon type='home'/>
                                Home
                            </span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key='/repositories'>
                        <Link href='/repositories'>
                            <span>
                                Repositories
                            </span>
                        </Link>
                    </Menu.Item>
                </Menu>
                <Avatar user={{ name: 'Stub user' }}/>
            </Layout.Header>
            <style jsx>{`
                .header {
                    position: fixed;
                    width: 100%;
                    z-index: 999;
                }
                .header :global(.ant-layout-header) {
                    width: 100%;
                    display: flex;
                }
                .header :global(.ant-menu) {
                    flex-grow: 1;
                }
                .header :global(.ant-menu-item) {
                    line-height: 64px;
                }
            `}</style>
        </div>
    )
};

export default Header
