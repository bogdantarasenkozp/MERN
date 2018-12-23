import PropTypes from 'prop-types'
import { Component } from 'react'
import b from 'b_'
import Cookies from 'js-cookie'
import API from 'lib/api'

import Icon from 'deskpad/components/Icon'
import Form from 'deskpad/components/Form'
import FormHeader from 'deskpad/components/Form/FormHeader'
import Row from 'deskpad/components/Row'
import Col from 'deskpad/components/Col'
import Input from 'deskpad/components/Input'
import Button from 'deskpad/components/Button'
import Link from 'deskpad/components/Link'
import Text from 'deskpad/components/Text'
import Checkbox from 'deskpad/components/Checkbox'

import './styles.css'

const REQUIRED_FIELDS = [ 'email', 'password', 'confirm_password', 'checkbox1', 'checkbox2' ]

class FormRegistration extends Component {
    constructor(props, context) {
        super(props, context)
        const { type } = props

        this.setValue = Form.setValue.bind(this)
        this.setStatus = Form.setStatus.bind(this)
        this.isPending = Form.isPending.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

        this.state = {
            errors: false,
            errorMessage: '',
            [type]: { fields: {} }
        }
    }

    render() {
        const props = this.props
        const state = this.state
        const { type } = props
        const { [type]: data = {} } = state
        const isPending = this.isPending('submit')
        let isRight = true

        if (REQUIRED_FIELDS.every(field => state[type].fields[field])) {
            isRight = false
        }

        return (
            <Form
                data={data}
                className={type}
                onSubmit={this.handleSubmit}>
                <FormHeader>SIGN UP</FormHeader>
                <div className={b(type, 'body')}>
                    <Row>
                        <Col col={12}>
                            <Text size='m' center className={b(type, 'title')}>REGISTRATION TITLE</Text>
                        </Col>
                    </Row>
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
                                onChange={this.handleChange} />
                        </Col>
                        <Col col={12} className={b(type, 'field')}>
                            <Icon type='lock' size='m' />
                            <Input
                                size='xl'
                                theme='default'
                                name='password'
                                type='password'
                                placeholder='Password'
                                onChange={this.handleChange} />
                        </Col>
                        <Col col={12} className={b(type, 'field')}>
                            <Icon type='lock' size='m' />
                            <Input
                                size='xl'
                                theme='default'
                                name='confirm_password'
                                type='password'
                                placeholder='Confirm password'
                                onChange={this.handleChange} />
                        </Col>
                    </Row>
                    <Row>
                        <Col col={12} className={b(type, 'field')}>
                            <Checkbox size='xl' theme='default' name='checkbox1' onCheck={this.handleChange} />
                            <Text size='s' card>
                                I confirm I have read and agree to the
                                <a href="#" target="_blank">
                                    <Link theme='default'> Terms&Conditions</Link>.
                                </a>
                            </Text>
                        </Col>
                        <Col col={12} className={b(type, 'field')}>
                            <Checkbox size='xl' theme='default' name='checkbox2' onCheck={this.handleChange} />
                            <Text size='xs' card>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </Text>
                        </Col>
                    </Row>
                    <Row>
                        <Col col={12} center>
                            <Button
                                size='xl'
                                theme='default'
                                type='submit'
                                disabled={isRight || isPending}>
                                SUBMIT
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col col={12}>
                            <Text center>Have an account with us?
                                <Link theme='default' to={{ pathname: '/login' }}> Login here</Link>
                            </Text>
                        </Col>
                    </Row>
                    <Row>
                        <Col col={12}>
                            <Text center size='s'>Copyrights ©. All rights reserved to Hello World Co.</Text>
                        </Col>
                    </Row>
                </div>
            </Form>
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
     * @returns {Object}
     */
    handleSubmit(data) {
        const context = this.context

        if (data.password && data.password.length < 6) {
            return this.setState({
                errors: true,
                errorMessage: 'Password is too short.'
            })
        }

        if (data.password !== data.confirm_password) {
            delete data.confirm_password
            return this.setState({
                errors: true,
                errorMessage: 'Verify password must match password.'
            })
        }

        this.setStatus('submit', 'pending')

        const clickid = Cookies.get('clickid')

        if (clickid && clickid.length > 1) {
            data.clickId = clickid
        }

        API.create('v1/users', data).then(() => {
            API.create('v1/users/login', data).then(result => {
                Cookies.set('token', result.token)

                context.router.push({
                    pathname: '/'
                })
            }).catch(error => {
                this.setState({
                    errors: true,
                    errorMessage: error.message
                }, () => this.setStatus('submit'))
            })
        }).catch(error => {
            if (error.message === 'A user with same email already exists') {
                delete data.email
            }
            this.setState({
                errors: true,
                errorMessage: error.message
            }, () => this.setStatus('submit'))
        })
    }

    /**
     * @param {String|Boolean} value
     * @param {Object} data
     */
    handleChange(value, data) {
        const { type } = this.props

        this.setValue({ formType: type, name: data.name, value })
    }
}

FormRegistration.defaultProps = {
    type: 'FormRegistration'
}

FormRegistration.propTypes = {
    type: PropTypes.string
}

FormRegistration.contextTypes = {
    router: PropTypes.object.isRequired
}

module.exports = FormRegistration
