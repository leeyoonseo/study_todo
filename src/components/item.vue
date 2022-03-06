<template>
  <div class="input-group">
    <div class="input-group-text">
      <input
        class="form-check-input mt-0"
        type="checkbox"
        :checked="props.status === 'clear'"
        @change="handleChangeStatus"
      />
    </div>
    <input type="text" class="form-control" :value="props.title" disabled />
    <button
      class="btn btn-outline-secondary"
      type="button"
      @click="handleRemoveItem"
    >
      X
    </button>
  </div>
</template>
<script lang="ts">
export default {
  name: "TodoItem",
};
</script>
<script lang="ts" setup>
import { defineProps } from "vue";
import { TodoItem } from "@/store/index.interface";
import { storeTodo } from "@/store/modules/todo";

export interface Props {
  id: TodoItem["id"];
  title: TodoItem["title"];
  status: TodoItem["status"];
}
const store = storeTodo();
const props = defineProps<Props>();

const handleChangeStatus = () => {
  const changeStatus = props.status === "active" ? "clear" : "active";
  store.changeStatus({ id: props.id, status: changeStatus });
};
const handleRemoveItem = () => {
  store.removeItem(props.id);
};
</script>
<style lang="scss">
.input-group {
  padding: 0;

  input {
    font-size: 14px;

    &::placeholder {
      font-size: 14px;
    }
  }

  button {
    font-size: 14px;
  }
}
</style>
