import PropTypes from 'prop-types'
import { Component } from 'react'
import { Link as RouterLink } from 'react-router'
import b from 'b_'
import omit from 'lodash/omit'

import './styles.css'

const extraProps = [ 'to', 'nav', 'pseudo', 'theme', 'padded', 'active' ]

class Link extends Component {
    constructor() {
        super()

        this.handleClick = this.handleClick.bind(this)
    }

    /**
     * @override
     */
    render() {
        const props = this.props
        const to = props.to
        const linkProps = Object.assign(omit(props, extraProps), {
            className: b('link', {
                theme: props.theme,
                padded: props.padded,
                active: props.active,
                pseudo: props.pseudo
            })
        })
        let link

        if (props.pseudo) {
            link = <span {...linkProps} onClick={this.handleClick}>{props.children}</span>
        } else if (props.nav) {
            link = <RouterLink {...linkProps} to={to}>{props.children}</RouterLink>
        } else {
            link = (
                <a
                    rel={props.target === '_blank' ? 'noopener' : null}
                    {...linkProps}
                    href={typeof to === 'string' ? to : this.context.router.createPath(to)}>
                    {props.children}
                </a>
            )
        }

        return link
    }

    handleClick(e) {
        const props = this.props

        props.onClick(e, omit(props, [ 'onClick' ]))
    }
}

Link.propTypes = {
    nav: PropTypes.bool,
    theme: PropTypes.string,
    padded: PropTypes.bool,
    pseuso: PropTypes.bool,
    target: PropTypes.string,
    tabIndex: PropTypes.number
}

Link.defaultProps = {
    nav: true,
    tabIndex: 0
}

Link.contextTypes = {
    router: PropTypes.object.isRequired
}

module.exports = Link
