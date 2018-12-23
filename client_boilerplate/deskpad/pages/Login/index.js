import { Component } from 'react'
import b from 'b_'

import Header from 'deskpad/components/Header'
import FormLogin from 'deskpad/pages/Login/FormLogin'

import './styles.css'

class PageLogin extends Component {
    /**
     * @override
     */
    render() {
        const props = this.props

        return (
           <div className={b(props.type)}>
            <Header />
            <FormLogin />
           </div>
        )
    }
}

PageLogin.defaultProps = {
    type: 'PageLogin'
}

module.exports = PageLogin
