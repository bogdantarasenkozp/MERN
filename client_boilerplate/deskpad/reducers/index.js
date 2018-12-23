import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import page from 'deskpad/reducers/page'
import config from 'deskpad/reducers/config'

module.exports = combineReducers({
    page,
    config,
    routing: routerReducer
})
