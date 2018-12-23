import actionTypes from 'deskpad/action-types'

module.exports = (state = { isLoading: false }, action) => {
    switch (action.type) {
        case actionTypes.PAGE_LOADING_START:
            return Object.assign({}, state, {
                isLoading: true
            })

        case actionTypes.PAGE_LOADING_SUCCESS:
        case actionTypes.PAGE_LOADING_FAIL:
            return Object.assign({}, state, {
                isLoading: false
            })

        default:
            return state
    }
}
