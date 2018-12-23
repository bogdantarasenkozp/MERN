import { Component } from 'react'
import PropTypes from 'prop-types'
import b from 'b_'

import Row from 'deskpad/components/Row'
import Col from 'deskpad/components/Col'
import Header from 'deskpad/components/Header'
import Section from 'deskpad/components/Section'
import provider from 'deskpad/containers/Provider'
import Container from 'deskpad/components/Container'
import HomeInfo from 'deskpad/pages/Home/HomeInfo'

import './styles.css'

class PageHome extends Component {
    constructor(props, context) {
        super(props, context)
    }

    getChildContext() {
        const props = this.props

        return {
            location: props.location
        }
    }

    /**
     * @override
     */
    render() {
        const props = this.props
        const { user, type } = props

        return (
           <div className={b(type)}>
                <Header />
                <div className={b(type, 'content')}>
                    <Section theme='lowGrey' size='m'>
                        <Container>
                            <Row>
                                <Col col='12'>
                                    <div className={b(type, 'header')}>
                                        <h2 className={b(type, 'title')}>THUMBNAIL TITLE</h2>
                                    </div>
                                </Col>
                            </Row>
                            <Row className={b(type, 'user-content')}>
                                <HomeInfo user={user} />
                            </Row>
                        </Container>
                    </Section>
                </div>
           </div>
        )
    }
}

PageHome.defaultProps = {
    type: 'PageHome'
}

PageHome.contextTypes = {
    router: PropTypes.object.isRequired
}

PageHome.childContextTypes = {
    location: PropTypes.object.isRequired
}

module.exports = provider([ 'user' ])(PageHome)
