import { Component } from 'react'
import b from 'b_'

import Row from 'deskpad/components/Row'
import Col from 'deskpad/components/Col'
import Text from 'deskpad/components/Text'
import Link from 'deskpad/components/Link'
import Section from 'deskpad/components/Section'
import Container from 'deskpad/components/Container'

import './styles.css'

class Header extends Component {
    handleLogOut() {
        document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;'
        window.location = '/'
    }
    render() {
        return (
            <Section className={b('Header')} theme='white'>
                <Container className={b('Header', 'content')}>
                    <Row>
                        <Col col={12} xs={12}>
                            <div className={b('Header', 'link-nav')}>
                                <Link
                                    theme='default'
                                    onlyActiveOnIndex
                                    to={{ pathname: '/' }}
                                    activeClassName='link_active'>
                                    <Text bold size='m' lightGrey>HOME</Text>
                                </Link>
                                <Link
                                    theme='default'
                                    disabled='true'
                                    to={{ pathname: '/login' }}
                                    activeClassName='link_active'>
                                    <Text bold size='m' lightGrey>LOGIN</Text>
                                </Link>
                                <Link
                                    theme='default'
                                    disabled='true'
                                    to={{ pathname: '/registration' }}
                                    activeClassName='link_active'>
                                    <Text bold size='m' lightGrey>REGISTRATION</Text>
                                </Link>
                                <Link
                                    theme='default'
                                    disabled='true'
                                    to={{ pathname: '/reset' }}
                                    activeClassName='link_active'>
                                    <Text bold size='m' lightGrey>RESET</Text>
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Section>
        )
    }
}

module.exports = Header
