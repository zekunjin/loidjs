<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
</script>

<template>
  <div>
    <div>{{ route.params }}</div>

    <button @click="router.go(-1)">back</button>
    <button @click="router.push('/parent/child')">child</button>
  </div>
</template>
