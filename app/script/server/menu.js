import Net from './net.js'

export default {
    getMenu: function () {
        return Net.get('/menu/list/');
    }
}
