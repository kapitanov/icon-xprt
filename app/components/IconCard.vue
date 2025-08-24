<script lang="ts">
import type { Icon } from '@/model';
import { Icon as IconifyIcon } from '@iconify/vue';

export interface IconCardProps {
    icon: Icon
}
</script>
<script lang="ts" setup>
const props = defineProps<IconCardProps>();
</script>

<template>
    <UButton color="neutral" variant="outline" :to="`/${props.icon.iconSetId}/${props.icon.name}`" class="flex w-full">
        <div class="flex flex-col p-1">
            <div class="mb-2 text-primary">
                <IconifyIcon :icon="props.icon.id" class="w-8 h-8" />
            </div>
            <div class="text-xs">
                {{ props.icon.name }}
            </div>
        </div>
    </UButton>
</template>