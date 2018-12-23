// import API from 'lib/api'
import actionTypes from 'deskpad/action-types'
// import Cookies from 'js-cookie'
/**
 * @type {{PageTypeHome(): *, PageTypeAdmin(): *}}
 */
const dataInjections = {
    PageTypeUsers(pageName, dispatch) {
        dispatch({ type: actionTypes.PAGE_LOADING_SUCCESS, payload: {} })
    },
    PageTypeVotings(pageName, dispatch) {
        dispatch({ type: actionTypes.PAGE_LOADING_SUCCESS, payload: {} })
    }
};

module.exports = {
    /**
     * @param {String} pageName
     * @returns {Promise}
     */
    load: pageName => dispatch => {
        if (typeof dataInjections[pageName] === 'function') {
            return dataInjections[pageName](pageName, dispatch)
        }

        return dispatch({ type: actionTypes.PAGE_LOADING_FAIL, payload: {} })
    }
};
