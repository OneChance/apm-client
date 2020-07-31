import Net from './net.js'

export default {
    upload: function (id, file) {
        return Net.axiosUpload('/file/upload/?id=' + id, file);
    },
}
