<template>
    <div ref="editor" class="text" @click.self="showinput">
        <div ref="inputbox" v-show="textbox" contenteditable="true" class="input"></div>
    </div>
</template>

<script>
    export default {
        name: "single2",
        data: () => ({
            textarea: '',
            text: '',
            textbox: false
        }),
        methods: {
            showinput() {
                this.textbox = true;
                this.$nextTick(() => this.$refs.inputbox.focus());
            }
        },
        mounted() {
            let editor = this.$refs.editor;
            let input = this.$refs.inputbox;
            input.onkeydown = (key) => {
                let chs = input.innerHTML;
                console.log(key);
                if ((key.keyCode > 47 && key.keyCode < 58) ||
                    (key.keyCode > 64 && key.keyCode < 91) ||
                    (key.keyCode > 95 && key.keyCode < 108) ||
                    (key.keyCode > 108 && key.keyCode < 112) ||
                    (key.keyCode > 185 && key.keyCode < 223)
                ) chs += key.key;
                if (key.key === 'Enter') chs += '\n';
                console.log(chs);
                let regobtain = chs.match(/#+ .+\n/g);
                if (regobtain) {
                    let matcharray = regobtain[0].split(/\s/g);
                    let headlevel = matcharray[0].length;
                    if (headlevel > 5) headlevel = 5;
                    if (headlevel < 1) headlevel = 1;

                    // let head = document.createElement('h'+headlevel.toString());
                    // head.contentEditable = true;
                    // head.innerText = matcharray[1];
                    editor.insertBefore(createNode('h' + headlevel.toString(), matcharray[1]), input);
                    setTimeout(() => input.innerHTML = '', 1);
                } else {
                    regobtain = chs.match(/\*.+\*/g);
                    if (regobtain) {
                        console.log(regobtain);
                        let matcharray = regobtain[0].split(/\*/g);
                        let headlevel = matcharray.length;
                        if (matcharray[1] === '') {
                            editor.insertBefore(createNode('strong', matcharray[2]), input);
                        } else {
                            editor.insertBefore(createNode('em', matcharray[1]), input);
                        }
                        setTimeout(() => input.innerHTML = '', 1);
                    }
                }
            };
        }
    }

    function createNode(tag, inner) {
        let node = document.createElement(tag);
        node.contentEditable = true;
        node.innerText = inner;
        return node;
    }

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