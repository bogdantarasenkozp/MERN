import PropTypes from 'prop-types'
import { Component } from 'react'
import b from 'b_'
import API from 'lib/api'

import Form from 'deskpad/components/Form'
import Icon from 'deskpad/components/Icon'
import FormHeader from 'deskpad/components/Form/FormHeader'
import Row from 'deskpad/components/Row'
import Col from 'deskpad/components/Col'
import Input from 'deskpad/components/Input'
import Button from 'deskpad/components/Button'
import Link from 'deskpad/components/Link'
import Text from 'deskpad/components/Text'

import './styles.css'

class FormReset extends Component {
    constructor(props, context) {
        super(props, context)

        this.setValue = Form.setValue.bind(this)
        this.setStatus = Form.setStatus.bind(this)
        this.isPending = Form.isPending.bind(this)
        this.isSuccess = Form.isSuccess.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

        this.state = {
            errors: false,
            errorMessage: ''
        }
    }

    render() {
        const props = this.props
        const state = this.state
        const { type } = props
        const { [type]: data = {} } = state
        const isSuccess = this.isSuccess('submit')

        return (
            <Form
                type={type}
                data={data}
                className={type}
                onSubmit={this.handleSubmit}>
                <FormHeader>Restore Password</FormHeader>
                {isSuccess ? this.renderFinish() : this.renderForm()}
            </Form>
        )
    }

    renderFinish() {
        const props = this.props
        const { type } = props

        return (
            <div className={b(type, 'body')}>
                <p>
                    You will receive an email with instructions on how to reset your password in a few minutes.
                     You can close this page now.
                </p>
            </div>
        )
    }

    renderForm() {
        const props = this.props
        const { type } = props
        const isPending = this.isPending('submit')

        return (
            <div className={b(type, 'body')}>
                <Row>
                    <Col col={12}>
                        {this.renderErrors()}
                    </Col>
                </Row>
                <Row>
                    <Col col={12} className={b(type, 'field')}>
                        <Icon type='envelope' size='m' />
                        <Input
                            size='xl'
                            theme='default'
                            name='email'
                            placeholder='Email'
                            disabled={isPending}
                            onChange={this.handleChange} />
                    </Col>
                </Row>
                <Row>
                    <Col col={12} center>
                        <Button
                            size='xl'
                            type='submit'
                            theme='default'
                            disabled={isPending}>
                            Restore Password
                        </Button>
                        </Col>
                </Row>
                <Row>
                    <Col col={12}>
                        <Text center>Return to <Link theme='default' to={{ pathname: '/login' }}>Login</Link></Text>
                    </Col>
                </Row>
            </div>
        )
    }

    renderErrors() {
        const { type } = this.props
        const state = this.state
        const { errors, errorMessage } = state

        if (! errors) {
            return null
        }

        return <p className={b(type, 'errors')}>{errorMessage}</p>
    }

    /**
     * @param {Object} data
     */
    handleSubmit(data) {
        this.setStatus('submit', 'pending')

        API.create('v1/users/password/forgot', data).then(() => {
            this.setStatus('submit', 'success')
        }).catch(error => {
            this.setState({
                errors: true,
                errorMessage: error.message
            }, () => this.setStatus('submit'))
        })
    }

    /**
     *
     * @param {String} value
     * @param {Object} data
     */
    handleChange(value, data) {
        const { type } = this.props

        this.setValue({ formType: type, name: data.name, value })
    }
}

FormReset.defaultProps = {
    type: 'FormReset'
}

FormReset.propTypes = {
    type: PropTypes.string
}

FormReset.contextTypes = {
    router: PropTypes.object.isRequired
}

module.exports = FormReset
