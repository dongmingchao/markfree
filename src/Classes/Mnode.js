class Mnode {
    constructor(str,template){
        template.init.bind(this)(str);
    }
    static parse(str,lib=templib){
        let res = [];
        for(let each of lib){
            // console.log('lib each',each);
            let handle = str.match(each.regexp);
            // console.log('str',str);
            // console.log('handle',handle);
            if(handle) {
                let fresh = new Mnode(str,each);
                let other = this.parse(fresh.rest,lib);
                res.push(fresh);
                res.concat(other);
            }
        }
        return res;
    }
    toHTML(){
        let res = document.createElement(this.tag);
        res.innerText = this.rest;
        res.contentEditable = true;
        return res;
    }

    /**
     * 由parse方法生成的列表在这里转化为html
     * @param {Mnode[]}arr
     */
    static arrayToHTML(arr){
        let last = null;
        for(let each of arr.reverse()){
            if(!last) last = each.toHTML();
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
    regexp:/#+ .+\n/g,
    init(str){
        let matcharray = str.split(/\s/g);
        this.flag = matcharray[0];
        this.rest = str.split(this.flag)[1].trim();
        let headlevel = this.flag.length;
        if (headlevel > 5) headlevel = 5;
        if (headlevel < 1) headlevel = 1;
        this.tag = 'h' + headlevel.toString();
    }
};

let slash = {
    regexp:/\*[^\*]+\*/g,
    init(str){
        let matcharray = str.match(/\*+/g);
        let restGroup = str.split(/\*+/g);
        this.flag = matcharray[0];
        this.rest = restGroup[1];
        if (this.flag.length === 1) this.tag = 'em';
        else this.tag = 'strong';
    }
};

let templib = [sharp,slash,{
    regexp:/-{2}[^-]+-{2}/g,
    init(str){
        let matcharray = str.match(/-+/g);
        let restGroup = str.split(/-+/g);
        this.flag = matcharray[0];
        this.rest = restGroup[1];
        this.tag = 's';
    }
}];

console.log(new Mnode('# aaa',sharp));
console.log(new Mnode('## *aaa*',slash));
console.log(new Mnode('### aa*aaa*',sharp));
console.log(Mnode.parse('### aa**-aaa--**\n'));

export default Mnode;