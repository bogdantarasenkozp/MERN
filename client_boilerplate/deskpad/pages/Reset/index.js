import { Component } from 'react'
import b from 'b_'

import Header from 'deskpad/components/Header'
import FormReset from 'deskpad/pages/Reset/FormReset'

import './styles.css'

class PageTypeReset extends Component {
    /**
     * @override
     */
    render() {
        const props = this.props

        return (
           <div className={b(props.type)}>
            <Header />
            <FormReset />
           </div>
        )
    }
}

PageTypeReset.defaultProps = {
    type: 'PageReset'
}

module.exports = PageTypeReset
