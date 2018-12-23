import actionTypes from 'deskpad/action-types'

module.exports = (state = {}, action) => {
    const { payload: { config = {} } = {} } = action

    switch (action.type) {
        case actionTypes.PAGE_LOADING_SUCCESS:
            return Object.assign({}, state, config)
        default:
            return state
    }
}
