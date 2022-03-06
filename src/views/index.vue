<template>
  <div class="container">
    <!-- <h1>Todo</h1> -->
    <!-- 
    <div class="row">
      <todo-header />
    </div>
    <div class="row">
      <todo-item-input />
    </div>
    <div class="row">
      <todo-item />
    </div> -->
  </div>
</template>
<script lang="ts">
export default {
  name: "indexPage",
};
</script>
<script lang="ts" setup>
import { storeTodo } from "@/store/modules/todo";
// import TodoHeader from "@/components/header.vue";
// import TodoItem from "@/components/item.vue";
// import TodoItemInput from "@/components/item-Input.vue";

const store = storeTodo();
console.log("store", store);
</script>
<style lang="scss">
/* .row + .row {
  margin-top: 15px;
} */
</style>
