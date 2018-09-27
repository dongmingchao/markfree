import Mnode from '../src/Classes/Mnode';

describe('test', function () {
	it('# 标题', function () {
		expect(Mnode.parse("# aaa\n")).toEqual([{
			flag: '#',
			rest: 'aaa',
			tag: 'h1'
		}]);
	});
	it('**加粗**', function () {
		expect(Mnode.parse("**aaa**")).toEqual([{
			flag: '**',
			rest: 'aaa',
			tag: 'strong'
		}]);
	});
	it('*斜体*', function () {
		expect(Mnode.parse("*aaa*")).toEqual([{
			flag: '*',
			rest: 'aaa',
			tag: 'i'
		}]);
	});
	it('~~中划线~~', function () {
		expect(Mnode.parse("~~aaa~~")).toEqual([{
			flag: '~~',
			rest: 'aaa',
			tag: 's'
		}]);
	});
	it('换行', function () {
		expect(Mnode.parse("aaaa\n")).toEqual([{
			flag: '\n',
			rest: '',
			tag: 'br'
		},{
			flag: '',
			rest: 'aaaa',
			tag: 'span'
		}]);
	});
	it('列表', function () {
		expect(Mnode.parse("- ")).toEqual([{
			flag: '-',
			rest: '',
			tag: 'ul'
		},{
			flag: '',
			rest: '',
			tag: 'li'
		}]);
	});
});