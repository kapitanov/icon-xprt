<script setup lang="ts">
import { Icon as IconifyIcon } from '@iconify/vue';
import { iconSets } from '@/model';
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
                    <span>icon sets</span>
                </h1>
            </div>

            <div class="flex flex-row gap-4">
                <template v-for="iconSet in iconSets" :key="iconSet.id">
                    <IconSetCard :iconSet="iconSet" />
                </template>
            </div>
        </div>
    </div>
</template>
