function fill0(number) {
	return number < 10 ? "0" + number : number
}

export default {
	getFormattedDate: function(date) {
		return date.getFullYear() + "-" + fill0(date.getMonth() + 1) + "-" + fill0(date.getDate())
	},
	clearObject(object) {
		for (let key in object) {
			if (typeof object[key] === 'string' || typeof object[key] === 'number') {
				object[key] = ''
			} else if (typeof object[key] === 'object') {
				if (object[key] instanceof Array) {
					object[key] = []
				} else {
					this.clearObject(object[key])
				}
			}
		}
	},
	priceCN: function(n) {
		console.log(n)
		var fraction = ['角', '分'];
		var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
		var unit = [
			['元', '万', '亿'],
			['', '拾', '佰', '仟']
		];
		var head = n < 0 ? '欠' : '';
		
		n = Math.abs(n);

		var s = '';

		for (var i = 0; i < fraction.length; i++) {
			s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
		}
		s = s || '整';
		n = Math.floor(n);

		for (var i = 0; i < unit[0].length && n > 0; i++) {
			var p = '';
			for (var j = 0; j < unit[1].length && n > 0; j++) {
				p = digit[n % 10] + unit[1][j] + p;
				n = Math.floor(n / 10);
			}
			s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
		}
		return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
	}
}
