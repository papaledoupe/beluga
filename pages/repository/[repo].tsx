import React from 'react'
import {NextPage} from 'next'
import Layout from '../../components/layout/Layout'
import Breadcrumb from 'antd/lib/breadcrumb'
import Link from 'next/link'
import Head from 'next/head'
import TagTable from '../../components/repository/TagTable'

type Props = {
    name: string,
}
const Repository: NextPage<Props> = ({ name }) => (
    <Layout>
        <Head>
            <title>{name} - Beluga</title>
        </Head>
        <Breadcrumb>
            <Breadcrumb.Item>
                <Link href='/repositories'>
                    <a>Repositories</a>
                </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
                {name}
            </Breadcrumb.Item>
        </Breadcrumb>
        <h1>All {name} tags</h1>
        <TagTable repository={name}/>
    </Layout>
);

Repository.getInitialProps = async ({ req, query }) => {
    const { repo } = query;
    const name = decodeURIComponent('' + repo);
    return { name }
};

export default Repository
