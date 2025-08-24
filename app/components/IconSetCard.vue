<script lang="ts">
import type { IconSet } from '@/model';
import { Icon as IconifyIcon } from '@iconify/vue';

export interface IconSetCardProps {
    iconSet: IconSet
}
</script>
<script lang="ts" setup>
const props = defineProps<IconSetCardProps>();
</script>

<template>
    <UButton color="primary" variant="outline" :to="`/${props.iconSet.id}`" class="flex w-96">
        <div class="flex flex-col grow-1 p-1">
            <div class="text-lg font-bold mb-2">
                {{ props.iconSet.info.name }}
            </div>

            <div class="text-sm mb-1">
                by {{ props.iconSet.info.author.name }}
            </div>

            <div class="flex flex-row w-full">
                <div class="text-xs opacity-75 grow-1">
                    {{ props.iconSet.info.license.title }}
                </div>
                <div v-if="props.iconSet.info.total" class="text-xs opacity-75">
                    {{ props.iconSet.info.total }} icons
                </div>
            </div>

            <div v-if="props.iconSet.info.samples && props.iconSet.info.samples.length > 0"
                class="flex flex-row gap-2 w-full mt-4">
                <template v-for="sample in props.iconSet.info.samples" :key="sample">
                    <IconifyIcon :icon="`${props.iconSet.id}:${sample}`" class="text-2xl" />
                </template>
            </div>
        </div>
    </UButton>
</template>