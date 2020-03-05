<template>
  <span v-if="value" :class="discolor">
    <template v-for="(n, i) in value.content.rest.length+value.content.cap.length">
      <span v-if="n%2" :key="i">{{eachRest.next().value}}</span>
      <xml-doc-line v-else :key="i" :value="eachCap.next().value"></xml-doc-line>
    </template>
  </span>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Capture, CaptureNode, supportTag } from "./xmlTools";
//  {{ value.rest }}

function applyMod(tag?: supportTag) {
  switch (tag) {
    case "<red>":
      return "text-red";
    case "<em>":
      return "text-em";
    default:
      return "";
  }
}

@Component({
  components: {}
})
export default class XMLDocLine extends Vue {
  @Prop() value?: CaptureNode;
  eachRest?: IterableIterator<string> = [].values();
  eachCap?: IterableIterator<CaptureNode> = [].values();
  tag?: supportTag;
  discolor: string = "";

  @Watch("value")
  valueChange() {
    if (!this.value) return;
    this.eachRest = this.value.content.rest.values();
    this.eachCap = this.value.content.cap.values();
    this.discolor = applyMod(this.value.tag);
  }
  mounted() {
    this.valueChange();
  }
}
</script>

<style lang="less" scoped>
.text-red {
  color: red;
}
.text-em {
  font-weight: bolder;
}
</style>