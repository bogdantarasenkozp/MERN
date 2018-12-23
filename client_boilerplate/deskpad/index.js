import '@babel/polyfill'
import 'whatwg-fetch'

import thunk from 'redux-thunk'
import { render } from 'react-dom'
import { compose } from 'redux'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { applyMiddleware } from 'redux'
import { Router } from 'react-router'
import { createHistory } from 'history'
import { useRouterHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import config from 'configs'

import reducer from 'deskpad/reducers'
import routes from 'deskpad/routes'

const INITIAL_STATE = { config }
const basename = config.basename

const store = createStore(reducer, INITIAL_STATE, compose(
    applyMiddleware(thunk),
    IS_DEBUG && window.devToolsExtension ? window.devToolsExtension() : f => f
))

const history = syncHistoryWithStore(useRouterHistory(createHistory)({ basename }), store)

const checkCookies = () => {
    function setCookie(name, value, options) {
        options = options || {}

        let expires = options.expires

        if (typeof expires === 'number' && expires) {
            const d = new Date()

            d.setTime(d.getTime() + expires * 1000)
            expires = options.expires = d
        }
        if (expires && expires.toUTCString) {
            options.expires = expires.toUTCString()
        }

        value = encodeURIComponent(value)

        let updatedCookie = name + '=' + value

        document.cookie = Object.keys(options).reduce((ret, propName) => {
            updatedCookie += ' ' + propName

            const propValue = options[propName]

            if (propValue !== true) {
                updatedCookie += '=' + propValue
            }

            return ret
        }, updatedCookie)
        document.cookie = updatedCookie
    }

    // Parce incoming url to find Advendors ClickId and the cookie
    const data = window.location.search
    const cookiesData = data.replace('?', '').split('&').map(el => el.split('='))

    if (cookiesData && cookiesData.length > 0) {
        const clickId = cookiesData.filter(elm => elm[0].toLowerCase() === 'clickid')[0]

        if (clickId && clickId.length === 2 && clickId[1].length > 0) {
            // console.log(clickId)
            // console.log('data_adv_v2', cookiesData)

            cookiesData.map(item => {
                setCookie(item[0], item[1], { expires: 31536000 })
                return item
            })
            setCookie('advendor_url', data, { expires: 31536000 })
        }
    }
}

render(
    <Provider store={store}>
        <Router history={history} routes={routes} onUpdate={checkCookies} />
    </Provider>,
    document.getElementById('app')
)
