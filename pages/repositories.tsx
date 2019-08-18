import React from 'react'
import {NextPage} from 'next'
import Layout from '../components/layout/Layout'
import RepositoryTable from '../components/repository/RepositoryTable'
import Breadcrumb from 'antd/lib/breadcrumb'
import Head from 'next/head'

const Repositories: NextPage<{}> = () => (
    <Layout>
        <Head>
            <title>Repositories - Beluga</title>
        </Head>
        <Breadcrumb>
            <Breadcrumb.Item>
                Repositories
            </Breadcrumb.Item>
        </Breadcrumb>
        <h1>All repositories</h1>
        <RepositoryTable/>
    </Layout>
);

export default Repositories
