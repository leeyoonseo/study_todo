<template>
  <div>
    <h1>Todo</h1>
    <the-input />
  </div>
</template>
<script lang="ts">
export default {
  name: "indexPage",
};
</script>
<script lang="ts" setup>
import TheInput from "@/components/common/Input/Input.vue";
import { storeTodo } from "@/store/modules/todo";

const store = storeTodo();
console.log("store", store);
</script>
<style lang="scss">
$color: red;
body {
  color: red;
}
</style>
