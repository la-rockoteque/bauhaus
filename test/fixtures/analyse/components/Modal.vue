<script setup lang="ts">
defineProps<{ open: boolean; title: string; error?: boolean }>();
</script>
<template>
  <div class="modal" role="dialog" :aria-expanded="open"><h2>{{ title }}</h2><slot /></div>
</template>
<style>
.modal { background: #ffffff; padding: 24px; }
</style>
