<template>
  <div class="container">
    <div class="row">
      <app-header />
    </div>
    <div class="row">
      <todo-input />
    </div>
    <div class="row">
      <router-view />
    </div>
  </div>
</template>
<script lang="ts" setup>
import AppHeader from "@/components/header.vue";
import TodoInput from "@/components/todoInput.vue";
</script>
<style lang="scss">
#app {
  padding: 100px;
  font-size: 14px;

  .row + .row {
    margin-top: 15px;
  }
}
</style>
