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
    priceValidatorNoRequire: function (rule, value, callback) {
        let reg = /^[+]?(0|([1-9]\d*))(\.\d+)?$/g;
        if (value && !reg.test(value)) {
            callback(new Error('请输入大于等于0的数字'));
        } else {
            callback();
        }
    },
    auditNoValidator: function (rule, value, callback) {
        let reg = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*])[\da-zA-Z~!@#$%^&*]{8,}$/;
        if (value === '') {
            callback(new Error('请输入审计编号'));
        } else if (!reg.test(value)) {
            callback(new Error('审计编号必须由字母数字和符号组成'));
        } else {
            callback();
        }
    },
}
