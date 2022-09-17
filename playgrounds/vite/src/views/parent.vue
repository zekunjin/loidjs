<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { definePageMeta } from '@loidjs/core'

definePageMeta({ document: { title: 'parent page' } })

const router = useRouter()
const id = ref('')
</script>

<template>
  <div>
    <div>parent layout</div>

    <input v-model="id" />
    <button @click="router.push(`/parent/${id}`)">navi</button>

    <RouterView />
  </div>
</template>
