import Net from './net.js'

export default {
    save: function (data) {
        return Net.jsonPost('/thirdparty/addOrUpdate/', data);
    },
    gets: function (data) {
        return Net.get('/thirdparty/list/', data);
    },
    get: function (data) {
        return Net.get('/thirdparty/get/', data);
    },
    delete: function (data) {
        return Net.post('/thirdparty/delete/', data);
    }
}
