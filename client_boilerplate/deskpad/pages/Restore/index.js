import { Component } from 'react'
import b from 'b_'
import API from 'lib/api'
import Spin from 'deskpad/components/Spin'
import Row from 'deskpad/components/Row'
import Col from 'deskpad/components/Col'
import Input from 'deskpad/components/Input'
import Button from 'deskpad/components/Button'
import Form from 'deskpad/components/Form'
import FormHeader from 'deskpad/components/Form/FormHeader'
import Link from 'deskpad/components/Link'

import './styles.css'

class PageTypeRestore extends Component {
    /**
     * @override
     */
    constructor(props) {
        super(props)

        this.setValue = Form.setValue.bind(this)
        this.setStatus = Form.setStatus.bind(this)
        this.isPending = Form.isPending.bind(this)
        this.isSuccess = Form.isSuccess.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

        this.state = {
            resetToken: '',
            errorMessage: '',
            checkToken: true
        }
    }

    componentDidMount() {
        const props = this.props
        const { type, params: { token } } = props

        API.get(`v1/users/password/reset/${token}`)
            .then(result => {
                return this.setState({
                    checkToken: false
                }, () => this.setValue({ formType: type, name: 'resetToken', value: result.resetToken }))
            })
            .catch(err => {
                this.setState({
                    checkToken: false,
                    isBrokenToken: true,
                    errorMessage: err.message
                })
            })
    }

    renderTokenError() {
        const type = this.props.type
        const state = this.state

        return (
            <div className={b(type, 'broken-token')}>
                {state.errorMessage}
                <br />
                <Link theme='default' to={{ pathname: '/reset' }}>Reset password</Link>
            </div>
        )
    }

    renderForm() {
        const props = this.props
        const state = this.state
        const { type } = props
        const { [type]: data = {} } = state
        const isPending = this.isPending('submit')
        const isSuccess = this.isSuccess('submit')

        if (isSuccess) {
            return (
                <div className={b(type, 'success')}>
                    Password was update! <Link theme='default' to={{ pathname: '/login' }}>Login</Link>
                </div>
            )
        }

        return (
            <Form
                data={data}
                type={props.type}
                className={b(type, 'form')}
                action={'api/v1/users/password'}
                onSubmit={this.handleSubmit}>
                    <FormHeader>Forgot your password?</FormHeader>
                    <div className={b(type, 'form-body')}>
                        <Row>
                            <Col col={12}>
                                <p className={b(type, 'errors')}>{this.state.errorMessage}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col col={12} className={b(props.type, 'field')}>
                                <Input
                                    size='xl'
                                    theme='default'
                                    name='password'
                                    type='password'
                                    placeholder='New Password'
                                    onChange={this.handleChange} />
                            </Col>
                            <Col col={12} className={b(props.type, 'field')}>
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
                            <Col col={12} center>
                                <Button
                                    size='xl'
                                    type='submit'
                                    theme='default'
                                    disabled={isPending}>
                                    Confirm New Password
                                </Button>
                            </Col>
                        </Row>
                    </div>
            </Form>
        )
    }

    render() {
        const props = this.props
        const state = this.state
        const { checkToken, isBrokenToken } = state
        let content = <Spin size='m' theme='default' />

        if (checkToken) {
            content = <Spin size='m' theme='default' />
        } else if (isBrokenToken) {
            content = this.renderTokenError()
        } else {
            content = this.renderForm()
        }

        return (
            <div className={b(props.type)}>
                <div className={b(props.type, 'content')}>
                    {content}
                </div>
            </div>
        )
    }

    /**
     * @param {String} value
     * @param {Object} data
     */
    handleChange(value, data) {
        const { type } = this.props

        this.setValue({ formType: type, name: data.name, value })
    }

    /**
     * @param {Object} data
     * @returns {Object}
     */
    handleSubmit(data) {
        if (data.password && data.password.length < 6) {
            return this.setState({
                errors: true,
                errorMessage: 'Password is too short.'
            })
        }

        if (data.password !== data.confirm_password) {
            return this.setState({
                errors: true,
                errorMessage: 'Verify password must match password.'
            })
        }

        delete data.confirm_password

        this.setStatus('submit', 'pending')

        API.update('v1/users/password', data).then(() => {
            this.setStatus('submit', 'success')
        }).catch(error => {
            this.setState({
                errors: true,
                errorMessage: error.message
            }, () => this.setStatus('submit'))
        })
    }
}

PageTypeRestore.defaultProps = {
    type: 'PageRestore'
}

module.exports = PageTypeRestore
