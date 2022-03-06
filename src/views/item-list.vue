<template>
  <todo-item
    v-for="{ id, title, status } in renderItems"
    :id="id"
    :title="title"
    :status="status"
    :key="id"
  />
</template>
<script lang="ts">
export default {
  name: "ItemList",
};
</script>
<script lang="ts" setup>
import { watch, ref } from "vue";
import { useRoute } from "vue-router";
import { storeTodo } from "@/store/modules/todo";
import TodoItem from "@/components/item.vue";

const route = useRoute();
const store = storeTodo();
let renderItems = ref(store.todoList);

watch(
  () => route.params.status,
  (newVal) => {
    if (!newVal) {
      renderItems.value = store.todoList;
    } else if (newVal === "active" || newVal === "clear") {
      renderItems.value = [...store.todoList].filter((item: any) => {
        return item.status === newVal;
      });
    }
  },
  { deep: true }
);
</script>
<style lang="scss"></style>
