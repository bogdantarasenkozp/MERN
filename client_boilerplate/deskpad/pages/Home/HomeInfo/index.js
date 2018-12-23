import { Component } from 'react'
import Row from 'deskpad/components/Row'
import Col from 'deskpad/components/Col'
import Text from 'deskpad/components/Text'

import './styles.css'

class HomeInfo extends Component {

    render() {
        return (
            <Row>
                <Col className='Card' col={12} xs={10}>
                    <Col col='12' center>
                        <Text center>Hello World</Text>
                    </Col>
                </Col>
            </Row>
        )
    }
}

export default HomeInfo
