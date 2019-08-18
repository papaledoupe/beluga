import React from 'react'
import {NextPage} from 'next'
import Layout from '../../../../components/layout/Layout'
import Breadcrumb from 'antd/lib/breadcrumb'
import Card from 'antd/lib/card'
import fetch from 'isomorphic-unfetch'
import Row from 'antd/lib/row'
import Link from 'next/link'
import Head from 'next/head'
import {Manifest} from '../../../../types/manifest'
import {Meta} from '../../../../types/registry'
import TagPullCommand from '../../../../components/tag/TagPullCommand'
import TagDescription from '../../../../components/tag/TagDescription'
import TagLayers from '../../../../components/tag/TagLayers'

type Props = {
    meta: Meta
    manifest: Manifest
}
const Tag: NextPage<Props> = ({ meta, manifest }) => {
    const repository = manifest.name;

    const { tag, digest, architecture, fsLayerDigests } = manifest;
    return (
        <Layout>
            <Head>
                <title>{repository}:{tag} - Beluga</title>
            </Head>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link href='/repositories'>
                        <a>Repositories</a>
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link href='/repository/[repo]' as={`/repository/${encodeURIComponent(repository)}`}>
                        <a>{repository}</a>
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link href='/repository/[repo]/tag/[tag]' as={`/repository/${encodeURIComponent(repository)}/tag/${encodeURIComponent(tag)}`}>
                        <a>{tag}</a>
                    </Link>
                </Breadcrumb.Item>
            </Breadcrumb>
            <h1>{repository}:{tag}</h1>
            <Card>
                <div className='card'>
                    <Row>
                        <TagPullCommand
                            repository={repository}
                            tag={tag}
                            baseUrl={meta.registryBaseUrl}
                        />
                    </Row>
                    <Row>
                        <TagDescription
                            digest={digest}
                            architecture={architecture}
                        />
                    </Row>
                    <Row>
                        <TagLayers
                            fsLayerDigests={fsLayerDigests}
                        />
                    </Row>
                    <style jsx>{`
                    .card :global(.ant-row:not(:last-of-type)) {
                        margin-bottom: 2em;
                    }
                    `}</style>
                </div>
            </Card>
        </Layout>
    )
};

Tag.getInitialProps = async ({ req, query }) => {
    const { repo, tag } = query;

    // TODO
    const metaResponse = await fetch('http://localhost:3000/api/meta');
    const meta = await metaResponse.json();
    // TODO
    const manifestResponse = await fetch(`http://localhost:3000/api/repository/${repo}/tag/${tag}`);
    const manifest = await manifestResponse.json();

    return { meta, manifest }
};

export default Tag
