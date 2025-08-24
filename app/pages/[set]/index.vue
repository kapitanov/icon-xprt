<script setup lang="ts">
import type { Icon, IconSet } from '@/model';
import { Icon as IconifyIcon } from '@iconify/vue';
import { getIconSetById, searchIcons } from '@/model';

const route = useRoute();
const setID = route.params.set as string;
const iconSet = ref<IconSet | null>(null);
const iconList = ref<Icon[] | null>(null);
const error = ref<string | null>(null);

const searchQuery = useQueryParam('q');

async function searchHandler() {
    if (!iconSet.value) {
        return;
    }

    const q = searchQuery.value;
    if (!q) {
        iconList.value = iconSet.value.getIcons();
        return;
    }

    const sourceIconSet = iconSet.value! as IconSet;
    iconList.value = (await searchIcons({ query: q, iconSets: [sourceIconSet] })).map(hit => hit.icon);
}

onMounted(async () => {
    iconSet.value = (await getIconSetById(setID)) || null;
    if (!iconSet.value) {
        error.value = `Icon set with ID "${setID}" not found.`;
    }

    await searchHandler();
});

watch(() => searchQuery.value, async () => {
    await searchHandler();
});
</script>

<template>
    <div class="flex items-center justify-center mt-4">
        <div class="flex flex-col gap-4 w-8/12">
            <div class="flex flex-row items-start gap-2 mb-4">
                <h1 class="font-bold text-2xl">
                    <a href="/" class="hover:underline text-primary">icon-xprt</a>
                    <span class="text-gray-500 px-2">
                        <IconifyIcon icon="fa7-solid:caret-right" class="inline-block" />
                    </span>
                    <span>{{ setID }}</span>
                </h1>
            </div>

            <div v-if="!!error" class="flex flex-col gap-4">
                <UAlert color="error" variant="outline" :description="error" :actions="[
                    {
                        label: 'Back to Icon Set',
                        color: 'error',
                        variant: 'solid',
                        icon: 'fa6-solid:arrow-left',
                        to: `/${setID}`
                    }
                ]" />
            </div>

            <div v-if="!!iconSet" class="flex flex-col gap-4">
                <form @submit.prevent="searchHandler" class="w-full mb-2">
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