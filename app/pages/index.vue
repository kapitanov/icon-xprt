<script setup lang="ts">
import { Icon as IconifyIcon } from '@iconify/vue';

const router = useRouter();

const searchQuery = ref('');
const disabled = ref(false);

const promoSearchQueries = [
  'arrow',
  'home',
  'user',
  'settings',
  'search',
  'menu',
  'close',
  'check',
  'star',
  'heart',
];


function search(query: string) {
  query = query.trim();
  if (!query) {
    return;
  }

  disabled.value = true;
  router.push({ path: '/search', query: { q: query } });
}

function onSubmit() {
  search(searchQuery.value);
}
</script>

<template>
  <div class="flex h-screen w-screen items-center justify-center align-center mt-4">
    <div class="flex flex-col gap-4 w-8/12">
      <h1 class="font-bold text-4xl text-center mb-4">
        <IconifyIcon icon="fa6-solid:circle-info" class="inline text-primary" />
        <span>c</span>
        <span>o</span>
        <span>n</span>
        <span>-</span>
        <IconifyIcon icon="fa6-solid:circle-xmark" class="inline text-primary" />
        <span>p</span>
        <span>r</span>
        <span>t</span>
      </h1>
      <form class="w-full" @submit.prevent="onSubmit">
        <UInput type="search" placeholder="Search icons..." color="primary" variant="outline" size="xl" class="w-full"
          v-model="searchQuery" :disabled="disabled" :autofocus="true" :autofocus-delay="250" />
        <button type="submit" style="display: none;"></button>
        <div>
          <span class="text-gray-500 mr-2">Try:</span>
          <template v-for="(query, index) in promoSearchQueries" :key="index">
            <UButton color="primary" variant="link" :to="`/search?q=${encodeURIComponent(query)}`" size="md"
              :disabled="disabled" @click="search(query)">
              {{ query }}
            </UButton>
          </template>
        </div>
      </form>
      <div class="flex flex-row items-center gap-2 mb-4">
      </div>
      <div class="flex flex-row items-center justify-center">
        <UButton color="primary" variant="outline" to="/browse" size="xl" :disabled="disabled">
          Browse Icon Sets
        </UButton>
      </div>
    </div>
  </div>
</template>