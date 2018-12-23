import actionTypes from 'deskpad/action-types'
import API from 'lib/api'

module.exports = {
    /**
     * @param {Object} payload
     * @returns {Promise}
     */
    load: payload => dispatch => {
        API.get('account', payload.query).then((values = []) => {
            dispatch({ type: actionTypes.USERS_LOADING_SUCCESS, payload: {
                users: {
                    values,
                    query: payload.query,
                    totalPages: 1,
                    page: {
                        number: 0,
                        size: values.length
                    }
                }
            } })
        })
    }
};
