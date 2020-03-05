<template>
  <div ref="editor" class="text" @click.self="clickEditor">
    <div ref="inputbox" contenteditable="true" class="input"></div>
  </div>
</template>

<script>
import Mnode from "../Classes/Mnode";

export default {
  name: "single-area",
  data() {
    return {
      text: "",
      textbox: false,
      nowInput: null
    };
  },
  watch: {
    nowInput(val, oldVal) {
      val.onkeydown = this.handleEachKey;
      const range = document.createRange();
			const sel = window.getSelection();
			const text = val.childNodes[0];
      console.log("now input", val, text);
			if (text === undefined) {
				range.setStart(val, 0);
			} else {
      	range.setStart(text, text.length);
			}
      range.collapse(true);
      sel.removeAllRanges();
			sel.addRange(range);
      if (oldVal === null) return;
      delete oldVal.onkeydown;
    }
  },
  methods: {
    showinput(target) {
      this.textbox = true;
      // this.$nextTick(() => this.nowInput.focus());
      target.focus();
      // window.getSelection().collapseToEnd()
    },
    pressBackSpace(event) {
      const cursor = window.getSelection();
      let pressTarget = cursor.focusNode;
      console.log("target", pressTarget);
      // 删到只剩编辑器外壳
      if (this.$refs.editor.children.length < 2) return;
      if (pressTarget === this.$refs.inputbox) {
        const preTarget = pressTarget.previousElementSibling;
				this.nowInput = preTarget;
				event.preventDefault();
        return;
      }
      if (!pressTarget.nodeValue) {
				pressTarget.parentElement.removeChild(pressTarget);
				this.nowInput = this.$refs.inputbox;
        // this.$nextTick(() => this.$refs.inputbox.focus());
      }
    },
    handleEachKey(key) {
      let editor = this.$refs.editor;
      // let input = this.$refs.inputbox;

      let chs = this.nowInput.innerHTML;
      console.log(key);
      if (
        (key.keyCode > 47 && key.keyCode < 58) ||
        (key.keyCode > 64 && key.keyCode < 91) ||
        (key.keyCode > 95 && key.keyCode < 108) ||
        (key.keyCode > 108 && key.keyCode < 112) ||
        (key.keyCode > 185 && key.keyCode < 223)
      )
        chs += key.key;
      if (key.key === "Enter") chs += "\n";
      if (key.key === "Backspace") this.pressBackSpace(key);
      console.log(chs);
      for (let each of Mnode.parse(chs)) {
        console.log(each.toHTML());
      }
      let got = Mnode.arrayToHTML(Mnode.parse(chs));
      if (got) {
        // got.onkeydown = this.handleEachKey;
        got.onfocus = () => {
          this.nowInput = got;
        };
        editor.insertBefore(got, this.nowInput);
        setTimeout(() => (this.nowInput.innerHTML = ""), 1);
      }
      // let reg = judgeReg(chs,matchMap);
      // if(reg) {
      //     let generateDom = matchMap[reg.index].node(chs);
      //     if (generateDom) editor.insertBefore(generateDom, input);
      // }
      //
      // let regobtain = chs.match(/#+ .+\n/g);
      // if (regobtain) {
      //     let matcharray = regobtain[0].split(/\s/g);
      //     let headlevel = matcharray[0].length;
      //     if (headlevel > 5) headlevel = 5;
      //     if (headlevel < 1) headlevel = 1;
      //     editor.insertBefore(createNode(document.createElement('div'), chs), input);
      //     setTimeout(() => input.innerHTML = '', 1);
      // } else {
      //     regobtain = chs.match(/\*.+\*/g);
      //     if (regobtain) {
      //         console.log(regobtain);
      //         let matcharray = regobtain[0].split(/\*/g);
      //         let headlevel = matcharray.length;
      //         if (matcharray[1] === '') {
      //             editor.insertBefore(createNode('strong', matcharray[2]), input);
      //         } else {
      //             editor.insertBefore(createNode('em', matcharray[1]), input);
      //         }
      //         setTimeout(() => input.innerHTML = '', 1);
      //     }
      // }
    },
    clickEditor() {
      this.nowInput = this.$refs.inputbox;
    },
    eachOnFocus() {}
  },
  mounted() {}
};

// const matchMap = [
//   {
//     index: 0,
//     regexp: /#+ .+\n/g,
//     tag: function(regBack) {
//       let matcharray = regBack.split(/\s/g);
//       let headlevel = matcharray[0].length;
//       if (headlevel > 5) headlevel = 5;
//       if (headlevel < 1) headlevel = 1;
//       return "h" + headlevel.toString();
//     }
//   }
// ];

// function createNode(inner) {
//   //# aaa
//   let node = null;
//   let reg = judgeReg(inner, matchMap);
//   if (reg) {
//     let oGroup = inner.split(reg.regexp); //''
//     let mGroup = inner.match(reg.regexp); //# aaa
//     node = document.createElement(matchMap[reg.index].tag(inner));
//     let maxlength =
//       oGroup.length > mGroup.length ? oGroup.length : mGroup.length;
//     for (let i = 0; i < maxlength; i++) {
//       if (oGroup[i]) node.innerHTML += oGroup[i];
//       if (mGroup[i]) node.appendChild(createNode(mGroup[i]));
//     }
//   }
//   return node;
// }

// function judgeReg(str, matchMap) {
//   for (let { regexp, index } of matchMap) {
//     let handler = str.match(regexp);
//     if (handler)
//       return {
//         regexp,
//         index
//       };
//   }
//   return null;
// }

// /**
//  * 处理各种正则匹配
//  * @param {String} str
//  * @param {{RegExp regexp,Function method}[]} matchObj
//  * @param {HTMLElement} rootDom
//  * @return {HTMLElement} endDom
//  */
// function handleReg(str, matchObj, rootDom) {
//   let reststr = method(handler);
//   let endDom = handleReg(reststr[1], matchObj, null);
// }
</script>

<style scoped>
.full {
  width: 100%;
  height: 100%;
}

.text {
  background-color: #acd;
  margin: auto;
  width: 80%;
  height: 80%;
  font-size: larger;
  padding: 1em;
}

.input {
  display: inline-block;
}
</style>