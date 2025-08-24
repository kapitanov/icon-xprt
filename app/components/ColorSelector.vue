<script lang="ts" setup>

const props = defineProps<{
    label: string;
    colors: string[];
}>();
const modelValue = defineModel<string>(undefined);
</script>

<template>
    <div class="flex flex-col gap-2 mb-2">
        <div>{{ props.label }}:</div>
        <div class="flex flex-col gap-2">
            <UInput v-model="modelValue" type="color" class="w-full cursor-pointer" size="md" />

            <div class="flex flex-row gap-1">
                <UButton :color="modelValue === 'transparent' ? 'primary' : 'neutral'"
                    :variant="modelValue === 'transparent' ? 'solid' : 'outline'" size="md" class="cursor-pointer"
                    @click="modelValue = 'transparent'">
                    Transparent
                </UButton>
                <template v-for="color in props.colors" :key="color">
                    <UButton :color="modelValue === color ? 'primary' : 'neutral'"
                        :variant="modelValue === color ? 'solid' : 'outline'" size="md" @click="modelValue = color"
                        class="cursor-pointer">
                        <span class="border border-gray-600"
                            :style="{ backgroundColor: color, display: 'inline-block', height: '1rem', width: '100%', minWidth: '1rem' }"></span>
                    </UButton>
                </template>
            </div>
        </div>
    </div>
</template>