import React, {FunctionComponent, PropsWithChildren} from 'react'
import AntLayout from 'antd/lib/layout'
import 'antd/dist/antd.css'
import Header from './Header'
import Footer from './Footer'

type Props = {
}

const { Content } = AntLayout;

const Layout: FunctionComponent<PropsWithChildren<Props>> = ({children}) => (
    <div className='layout'>
        <AntLayout>
            <Header/>
            <Content>
                {children}
            </Content>
            <Footer/>
        </AntLayout>
        <style jsx>{`
        .layout :global(.ant-layout-content) {
            padding: 90px 120px 0 120px;
        }
        .layout :global(.ant-layout-footer) {
            text-align: center;
        }
        `}</style>
    </div>
);

export default Layout;