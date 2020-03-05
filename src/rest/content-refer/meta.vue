<template>
  <div>
    <p v-if="tag === 'p'">{{title}}</p>
    <ul v-else-if="tag === 'ul'">
      <li v-for="(text, index) in title" :key="index">{{text}}</li>
    </ul>
    <h2 v-else-if="tag === 'h2'">{{title}}</h2>
    <h3 v-else-if="tag === 'h3'">{{title}}</h3>
    <h4 v-else-if="tag === 'h4'">{{title}}</h4>
    <table v-else-if="tag === 'table'">
      <tr v-for="(row, ri) in title" :key="ri">
        <td v-for="(col, ci) in row" :key="ci">
          {{col}}
        </td>
      </tr>
    </table>
    <span v-else>{{title}}</span>
    <content-meta v-for="(each,index) in children" v-bind="each" :key="index" />
  </div>
</template>

<script>
export default {
  name: "ContentMeta",
  props: {
    tag: {
      validator: function(value) {
        return ["p", "ul", "h3", "h4", "h2", 'table'].indexOf(value) !== -1;
      }
    },
    title: [String, Array],
    children: Array
  }
};
</script>
