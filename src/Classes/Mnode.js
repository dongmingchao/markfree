class Mnode {
	constructor(str, template) {
		template.init.bind(this)(str);
	}

	static create() {
		return new Mnode('', {
			init() {
			}
		});
	}

	static parse(str, lib = templib) {
		let res = [];
		for (let each of lib) {
			// console.log('lib each',each);
			let handle = str.match(each.regexp);
			// console.log('str',str);
			// console.log('handle',handle);
			if (handle) {
				let fresh = new Mnode(str, each);
				let other = this.parse(fresh.rest, lib);
				let next = fresh.next;
				fresh.next = undefined;
				res.push(fresh);
				if (next instanceof Array) {
					for (let e of next) {
						let got = Object.assign(Mnode.create(), e);
						res.push(got);
					}
				}
				res = res.concat(other);
			}
		}
		return res;
	}

	toHTML() {
		let res = document.createElement(this.tag);
		res.innerText = this.rest;
		res.contentEditable = true;
		return res;
	}

	/**
	 * 由parse方法生成的列表在这里转化为html
	 * 只有最后一个调用toHTML方法，其他的都只看tag
	 * @param {Mnode[]}arr
	 */
	static arrayToHTML(arr) {
		let last = null;
		for (let each of arr.reverse()) {
			if (!last) last = each.toHTML();
			else {
				let one = document.createElement(each.tag);
				one.appendChild(last);
				last = one;
			}
		}
		return last;
	}
}

let sharp = {
	regexp: /#+ .+\n/g,
	init(str) {
		let matcharray = str.split(/\s/g);
		this.flag = matcharray[0];
		this.rest = str.split(this.flag)[1].trim();
		let headlevel = this.flag.length;
		if (headlevel > 5) {
			this.tag = 'h5';
			this.rest = new Array(headlevel - 5).fill('#').join('') + this.rest;
		} else if (headlevel === 0) this.tag = '';
		else this.tag = 'h' + headlevel.toString();
	}
};

let slash = {
	regexp: /\*[^\*]+\*/g,
	init(str) {
		let matcharray = str.match(/\*+/g);
		let restGroup = str.split(/\*+/g);
		this.flag = matcharray[0];
		this.rest = restGroup[1];
		if (this.flag.length === 1) this.tag = 'i';
		else this.tag = 'strong';
	}
};

let templib = [sharp, slash,
	{
		regexp: /~{2}[^-]+~{2}/g,
		init(str) {
			let matcharray = str.match(/~+/g);
			let restGroup = str.split(/~+/g);
			this.flag = matcharray[0];
			this.rest = restGroup[1];
			this.tag = 's';
		}
	},
	{
		regexp: /^[^#]*\n/g,
		init(str) {
			this.flag = '\n';
			this.rest = str.substr(0, str.length - 1);
			this.tag = 'div';
			// this.next = [{
			// 	flag: '',
			// 	rest: str.substr(0, str.length - 1),
			// 	tag: 'span'
			// }]
		}
	},
	{
		regexp: /^- /g,
		init(str) {
			this.flag = '-';
			this.rest = '';
			this.tag = 'ul';
			this.next = [{
				flag: '',
				tag: 'li',
				rest: ''
			}];
		}
	}
];

export default Mnode;