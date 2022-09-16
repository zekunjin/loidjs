<script lang="ts" setup>
import { useRouter } from 'vue-router'

defineProps({
  id: { type: String }
})

const router = useRouter()
</script>

<template>
  <div>
    <div>{{ id }}</div>

    <button @click="router.go(-1)">back</button>
    <button @click="router.push('/parent/child')">child</button>

    <RouterView />
  </div>
</template>
