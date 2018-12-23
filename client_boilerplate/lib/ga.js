import config from 'configs';
import API from 'lib/api';

module.exports = params => {
    const newParams = API.getQueryString('', params).substr(1);

    return fetch(config.ga_measurement, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        method: 'post',
        credentials: 'same-origin',
        body: newParams
    });
};
