import Net from './net.js'

export default {
    upload: function (file, progress) {
        return Net.axiosUpload('/file/upload/', file, progress);
    },
}
