import Net from './net.js'

export default {
    getComment: function (data) {
        return Net.get('/comment/list/', data);
    },
}
