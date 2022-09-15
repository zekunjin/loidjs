<script lang="ts" setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <span>
    {{ route.params }}
  </span>
</template>
