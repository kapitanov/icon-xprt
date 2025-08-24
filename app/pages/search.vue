<script lang="ts" setup>
import type { Icon, IconSet } from '@/model';
import { Icon as IconifyIcon } from '@iconify/vue';
import { searchIcons } from '@/model';

const searchQuery = useQueryParam('q');
const iconList = ref<Icon[] | null>(null);
const error = ref<string | null>(null);
const busy = ref(false);

watch(searchQuery, () => {
    onSubmit();
}, { immediate: true });

async function onSubmit() {
    if (busy.value) {
        return;
    }
    busy.value = true;

    try {
        const q = searchQuery.value;
        if (!q) {
            iconList.value = null;
            return;
        }

        iconList.value = (await searchIcons({ query: q })).map(result => result.icon);
    } catch (e: any) {
        error.value = e.message || 'An unknown error occurred during the search.';
    } finally {
        busy.value = false;
    }
}
</script>

<template>
    <div class="flex items-center justify-center mt-4">
        <div class="flex flex-col gap-4 w-8/12">
            <div class="flex flex-row items-start gap-2 mb-4">
                <h1 class="font-bold text-2xl">
                    <a href="/" class="hover:underline text-primary">icon-xprt</a>
                </h1>
            </div>

            <div class="flex flex-col gap-4">
                <form @submit.prevent="onSubmit" class="w-full mb-2">
                    <UInput type="search" placeholder="Search icons..." color="primary" variant="outline" size="lg"
                        class="w-full" v-model="searchQuery" :autofocus="true" :autofocus-delay="250" />
                    <button type="submit" style="display: none;"></button>
                </form>

                <UAlert v-if="!searchQuery && iconList && iconList.length > 0" color="neutral" variant="soft"
                    :description="`Showing all ${iconList!.length} icons`" />
                <UAlert v-if="searchQuery && iconList && iconList.length > 0" color="neutral" variant="outline"
                    :description="`Showing ${iconList!.length} results for '${searchQuery}'`" />
                <UAlert v-if="searchQuery && (!iconList || iconList.length === 0)" color="warning" variant="solid"
                    icon="fa6-solid:triangle-exclamation" :description="`No results found for '${searchQuery}'`" />

                <IconList v-if="iconList && iconList.length > 0" :icons="iconList" />
            </div>
        </div>
    </div>
</template>