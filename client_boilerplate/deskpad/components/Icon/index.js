import { Component } from 'react'
import b from 'b_'

import './styles.css'

class Icon extends Component {
    render() {
        const { type, size = 'm', color } = this.props

        return (
            <i className={b('Icon', { type, size, color })}>
                <svg className={b('Icon', 'svg')}>
                    <use xlinkHref={`#${type}`} />
                </svg>
            </i>
        )
    }
}

module.exports = Icon
