import { Component } from 'react'
import b from 'b_'

import Header from 'deskpad/components/Header'
import FormRegistration from 'deskpad/pages/Registration/FormRegistration'

import './styles.css'

class PageRegistration extends Component {
    /**
     * @override
     */
    render() {
        const props = this.props

        return (
           <div className={b(props.type)}>
            <Header />
            <FormRegistration />
           </div>
        )
    }
}

PageRegistration.defaultProps = {
    type: 'PageRegistration'
}

module.exports = PageRegistration
