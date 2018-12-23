import Cookies from 'js-cookie';
import config from './../configs';
/**
 * Строит урл до API
 * @private
 * @param {String} route
 * @param {String} action
 * @returns {String}
 */
function buildGateUrl(route, action) {
    return `${config.api}${route}/${action}`;
}

/**
 * Обрабатывает ответ
 * @private
 * @param {Object} json
 * @returns {Object}
 */
function processResponse(json) {
    const error = json.error;

    if (error) {
        throw error;
    }

    return json.response;
}

/**
 * Возвращает урл с параметрами
 * @private
 * @param {String} path
 * @param {Object} [query]
 * @returns {String}
 */
function getQueryString(path, query) {
    return query ? path + Object.keys(query).reduce((qs, key) => {
        const param = query[key];

        if (typeof param === 'undefined' || param === null) {
            return qs;
        }

        qs += ! qs ? '?' : '&';

        if (Array.isArray(param)) {
            qs += param.reduce((ret, value, paramIndex) => {
                return ret + (paramIndex === 0 ? '' : '&') + encodeURIComponent(key) + '=' + encodeURIComponent(value);
            }, '');
        } else {
            qs += encodeURIComponent(key) + '=' + encodeURIComponent(param);
        }

        return qs;
    }, '') : path;
}

/**
 * Возвращает заголовки
 * @private
 * @param {Object} headers
 * @returns {String}
 */
function makeHeaders(headers) {
    const token = Cookies.get('token');
    const auth = token ? { authorization: `Bearer ${token}` } : undefined;

    return Object.assign(headers, auth);
}

class API {
    /**
     * Делает GET-запрос для получения данных
     * @param {String} action
     * @param {Object} query
     * @returns {Promise}
     */
    static get(action, query) {
        const url = buildGateUrl(API.route, action);

        return fetch(getQueryString(url, query), {
            headers: makeHeaders({
                'X-Retpath-Y': location.href,
                'X-Requested-With': 'XMLHttpRequest'
            }),
            credentials: 'same-origin'
        })
            .then(response => Promise.all([ response.json(), response.status ]))
            .then(([ json, status ]) => {
                if (status > 300) {
                    return ({ error: { ...json, status } });
                }

                return ({ response: json, status });
            })
            .then(response => processResponse(response));
    }

    /**
     * Делает POST-запрос для создания наборов данных
     * @param {String} action
     * @param {FormData|Object} data
     * @returns {Promise}
     */
    static create(action, data) {
        const headers = makeHeaders({
            'X-Retpath-Y': location.href,
            'X-Requested-With': 'XMLHttpRequest'
        });
        const url = buildGateUrl(API.route, action);

        let body;

        if (! (data instanceof FormData)) {
            body = JSON.stringify(data);
            headers['Content-Type'] = 'application/json';
        } else {
            body = data;
        }

        return fetch(url, {
            body,
            headers,
            method: 'post',
            credentials: 'same-origin'
        })
            .then(response => Promise.all([ response.json(), response.status ]))
            .then(([ json, status ]) => {
                if (status > 300) {
                    return ({ error: { ...json, status } });
                }

                return ({ response: json, status });
            })
            .then(response => processResponse(response));
    }

    /**
     * Делает PUT-запрос для обновления данных
     * @param {String} action
     * @param {FormData|Object} update
     * @returns {Promise}
     */
    static update(action, update) {
        const headers = makeHeaders({
            'X-Retpath-Y': location.href,
            'X-Requested-With': 'XMLHttpRequest'
        });
        const url = buildGateUrl(API.route, action);

        let body;

        if (! (update instanceof FormData)) {
            body = JSON.stringify(update);
            headers['Content-Type'] = 'application/json';
        } else {
            body = update;
        }

        return fetch(url, {
            body,
            headers,
            method: 'put',
            credentials: 'same-origin'
        })
            .then(response => Promise.all([ response.json(), response.status ]))
            .then(([ json, status ]) => {
                if (status > 300) {
                    return ({ error: { ...json, status } });
                }

                return ({ response: json, status });
            })
            .then(response => processResponse(response));
    }

    /**
     * Делает DELETE-запрос для удаления записей
     * @param {String} action
     * @param {Object} query
     * @returns {Promise}
     */
    static delete(action, query) {
        const url = buildGateUrl(API.route, action);

        return fetch(getQueryString(url, query), {
            method: 'delete',
            headers: makeHeaders({
                'X-Retpath-Y': location.href,
                'X-Requested-With': 'XMLHttpRequest'
            }),
            credentials: 'same-origin'
        })
            .then(response => Promise.all([ response.json(), response.status ]))
            .then(([ json, status ]) => {
                if (status > 300) {
                    return ({ error: { ...json, status } });
                }

                return ({ response: json, status });
            })
            .then(response => processResponse(response));
    }

    /**
     * @param {String} path
     * @param {Object} query
     * @returns {String}
     */
    static getQueryString(path, query) {
        return getQueryString(path, query);
    }
}

/**
 * @static
 * @type {String}
 */
API.route = '/api';

module.exports = API;
