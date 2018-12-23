import { LOCATION_CHANGE } from 'react-router-redux'

module.exports = Object.assign({
    CONFIG: 'CONFIG',
    PAGE_LOADING_FAIL: 'PAGE_LOADING_FAIL',
    PAGE_LOADING_START: 'PAGE_LOADING_START',
    PAGE_LOADING_SUCCESS: 'PAGE_LOADING_SUCCESS'
}, { LOCATION_CHANGE });
