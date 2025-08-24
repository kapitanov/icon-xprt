<script lang="ts">
class Size {
    constructor(public value: number) { }

    toString() {
        return `${this.value}x${this.value}`;
    }
}
const sizes = [16, 24, 32, 48, 64, 96, 128, 192, 256].map(size => new Size(size));
</script>
<script lang="ts" setup>
const modelValue = defineModel<number>(undefined);
</script>

<template>
    <div class="flex flex-col gap-2 mb-2">
        <div>Icon size:</div>
        <div class="flex flex-row gap-1">
            <template v-for="size in sizes" :key="size">
                <UButton :label="size.toString()" :color="modelValue === size.value ? 'primary' : 'neutral'"
                    :variant="modelValue === size.value ? 'solid' : 'outline'" class="cursor-pointer" size="md" @click="modelValue = size.value" />
            </template>
        </div>
    </div>
</template>