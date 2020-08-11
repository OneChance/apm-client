export default {
    priceValidator: function (rule, value, callback) {
        let reg = /^[+]?(0|([1-9]\d*))(\.\d+)?$/g;
        if (value === '') {
            console.log('value:' + value)
            callback(new Error('请输入内容'));
        } else if (!reg.test(value)) {
            callback(new Error('请输入大于等于0的数字'));
        } else {
            callback();
        }
    },
}
