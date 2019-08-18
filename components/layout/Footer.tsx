import React, { ReactNode } from 'react'
import AntLayout from 'antd/lib/layout'
import Divider from 'antd/lib/divider'
import { Meta } from '../../types/registry'
import fetch from 'isomorphic-unfetch'

const AntFooter = AntLayout.Footer;

type State = {
    registryMeta: Meta | null,
}

class Footer extends React.Component<{}, State> {

    state: Readonly<State> = {
        registryMeta: null,
    };

    async fetchMeta(): Promise<void> {
        const response = await fetch(`/api/meta`);
        const json = await response.json();
        this.setState({
            registryMeta: json,
        })
    }

    componentDidMount() {
        this.fetchMeta().catch(console.error);
    }

    render(): ReactNode {
        const { registryMeta } = this.state;
        return <AntFooter>{
            registryMeta === null ? (
                ''
            ) : (
                <>
                    <a href='https://github.com/papaledoupe/beluga'>Beluga {registryMeta.appVersion}</a>
                    <Divider type='vertical'/>
                    <a href='https://docs.docker.com/registry/spec/api'>API {registryMeta.registryApiVersion}</a>
                </>
            )
        }</AntFooter>
    }
}

export default Footer
