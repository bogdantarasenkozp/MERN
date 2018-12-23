import PropTypes from 'prop-types'
import { Component } from 'react'
import Cookies from 'js-cookie'
import API from 'lib/api'
import b from 'b_'

import Form from 'deskpad/components/Form'
import Icon from 'deskpad/components/Icon'
import FormHeader from 'deskpad/components/Form/FormHeader'
import Row from 'deskpad/components/Row'
import Col from 'deskpad/components/Col'
import Input from 'deskpad/components/Input'
import Button from 'deskpad/components/Button'

import './styles.css'

class FormLogin extends Component {
    constructor(props, context) {
        super(props, context)

        this.setValue = Form.setValue.bind(this)
        this.setStatus = Form.setStatus.bind(this)
        this.isPending = Form.isPending.bind(this)
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
        const isPending = this.isPending('submit')

        return (
            <Form
                type={type}
                data={data}
                className={type}
                onSubmit={this.handleSubmit}>
                <FormHeader>LOGIN</FormHeader>
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
                                id='id_email'
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
                                id='id_password'
                                placeholder='Password'
                                onChange={this.handleChange} />
                        </Col>
                    </Row>
                    <Row>
                        <Col col={12} center>
                            <Button
                                size='xl'
                                type='submit'
                                theme='default'
                                id='button_login'
                                disabled={isPending}>
                                LOGIN
                            </Button>
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
     */
    handleSubmit(data) {
        const context = this.context

        this.setStatus('submit', 'pending')

        API.create('v1/users/login', data).then(result => {
            const url = result.role === 'admin' ? '/admin' : '/'

            Cookies.set('token', result.token)
            context.router.push({
                pathname: url
            })
        }).catch(() => {
            this.setState({
                errors: true,
                errorMessage: 'Invalid Email or password.'
            }, () => this.setStatus('submit'))
        })
    }

    /**
     * @param {String} value
     * @param {Object} data
     */
    handleChange(value, data) {
        const { type } = this.props

        this.setValue({ formType: type, name: data.name, value })
    }
}

FormLogin.defaultProps = {
    type: 'FormLogin'
}

FormLogin.propTypes = {
    type: PropTypes.string
}

FormLogin.contextTypes = {
    router: PropTypes.object.isRequired
}

module.exports = FormLogin
