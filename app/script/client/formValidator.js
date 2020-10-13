export default {
    priceValidator: function (rule, value, callback) {
        let reg = /^[+]?(0|([1-9]\d*))(\.\d+)?$/g;
        if (value === '') {
            callback(new Error('请输入内容'));
        } else if (!reg.test(value)) {
            callback(new Error('请输入大于等于0的数字'));
        } else {
            callback();
        }
    },
    auditNoValidator: function (rule, value, callback) {
        let reg = /^[1-9]\d*$/g;
        if (value === '') {
            callback(new Error('请输入审计编号'));
        } else if (!reg.test(value)) {
            callback(new Error('只能输入数字'));
        } else {
            callback();
        }
    },
}
