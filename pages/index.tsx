import React from 'react'
import {NextPage} from 'next'
import Head from 'next/head'
import Layout from '../components/layout/Layout'

type Props = {

}
const Home: NextPage<Props> = props => (
    <Layout>
        <Head>
            <title>Beluga</title>
        </Head>
        <h1>Home</h1>
    </Layout>
);

export default Home
