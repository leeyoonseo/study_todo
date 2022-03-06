<template>
  <input
    type="text"
    class="form-control todo-input"
    :value="inputValue"
    placeholder="할일을 입력해주세요."
    @keyup.enter="handleAddItem"
  />
</template>
<script lang="ts">
export default {
  name: "TodoInput",
};
</script>
<script lang="ts" setup>
import { ref } from "vue";
import { storeTodo } from "@/store/modules/todo";

const store = storeTodo();
const inputValue = ref("");
const handleAddItem = (event: Event) => {
  inputValue.value = (event.target as HTMLInputElement).value;

  store.$patch(() => {
    store.todoList.push({
      id: store.createId,
      title: inputValue.value,
      status: "active",
    });
  });

  inputValue.value = "";
};
</script>
<style lang="scss">
.todo-input {
  font-size: 14px;

  &::placeholder {
    font-size: 14px;
  }
}
</style>
