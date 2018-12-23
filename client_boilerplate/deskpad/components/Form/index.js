import PropTypes from 'prop-types'
import { Component } from 'react'
import get from 'lodash/get'

const ENTER_KEY = 13

import './styles.css'

class Form extends Component {
    /** @override */
    constructor(...args) {
        super(...args)

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
    }

    /** @override */
    render() {
        const props = this.props

        return (
            <form
                className={`Form ${props.className || ''}`}
                method={props.method}
                action={props.action}
                id={props.id || ''}
                onSubmit={this.handleSubmit}
                onKeyDown={this.handleKeyDown}>
                {props.children}
            </form>
        )
    }

    /** @override */
    componentDidUpdate(prevProps) {
        const props = this.props
        const data = props.data
        const formStatuses = props.statuses
        const prevFormStatuses = prevProps.data.statuses
        const prevFormSubmitStatus = prevFormStatuses && prevFormStatuses.submit

        if (prevFormSubmitStatus === 'pending') {
            formStatuses && formStatuses.submit === 'success' ?
                props.onSuccess() :
                props.onFail(data.errors)
        }
    }

    /** @override */
    componentWillUnmount() {
        clearTimeout(this._prepareTimeout)
        clearTimeout(this._submitTimeout)
    }

    /**
     * @param {SyntheticEvent} e
     */
    handleSubmit(e) {
        e.preventDefault()

        const props = this.props
        const data = props.data

        props.onSubmit(data.fields, props.formType || props.type)
    }

    /**
     * @param {SyntheticEvent} e
     */
    handleKeyDown(e) {
        if (e.keyCode === ENTER_KEY) {
            e.preventDefault()
            document.activeElement.blur()
        }
    }

    static setValue({ formType, name, value }, cb = () => {}) {
        const state = this.state

        this.setState(Object.assign({}, state, {
            [formType]: Object.assign({}, state[formType], {
                fields: Object.assign(
                    {},
                    state[formType] && state[formType].fields || {},
                    { [name]: value }
                )
            })
        }), cb)
    }

    /**
     * @param {String} field
     * @param {String} status
     */
    static setStatus(field, status) {
        const props = this.props
        const state = this.state
        const { type } = props

        this.setState(Object.assign(state, {
            [type]: Object.assign({}, state[type], {
                statuses: Object.assign({}, {
                    [field]: status
                })
            })
        }))
    }

    /**
     * @param {String} field
     * @returns {Boolean}
     */
    static isPending(field) {
        const props = this.props
        const state = this.state

        return get(state[props.type], `statuses.${field}`) === 'pending'
    }

    /**
     * @param {String} field
     * @returns {Boolean}
     */
    static isSuccess(field) {
        const props = this.props
        const state = this.state

        return get(state[props.type], `statuses.${field}`) === 'success'
    }

    /**
     * @param {String} field
     * @returns {Boolean}
     */
    static isFail(field) {
        const props = this.props
        const state = this.state

        return get(state[props.type], `statuses.${field}`) === 'fail'
    }
}

Form.propTypes = {
    type: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    method: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
    onFail: PropTypes.func,
    onSubmit: PropTypes.func,
    onSuccess: PropTypes.func
}

Form.defaultProps = {
    submit: true,
    method: 'post',
    action: '/',
    onSuccess() {},
    onSubmit() {},
    onFail() {}
}

module.exports = Form
