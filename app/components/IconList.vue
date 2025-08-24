<script lang="ts">
import type { Icon } from '@/model';

export interface IconListProps {
    icons: Icon[];
}
</script>

<script lang="ts" setup>
const props = defineProps<IconListProps>();
</script>

<template>
    <div v-if="props.icons && props.icons.length > 0" class="mb-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <template v-for="(icon, index) in props.icons" :key="index" >
                <IconCard :icon="icon" />
            </template>
        </div>
    </div>
</template>