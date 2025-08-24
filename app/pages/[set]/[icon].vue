<script lang="ts">
const foregroundColors = ['#00C16A', '#FF5733', '#3357FF', '#FFC300', '#DAF7A6', '#C70039', '#900C3F', '#581845', '#FF5733', '#33FF57', '#5733FF', '#FF33A1', '#33FFF5', '#F533FF', '#FF3357', '#3357F5'];
const backgroundColors = ['#FFFFFF', '#F0F0F0', '#E0E0E0', '#D0D0D0', '#C0C0C0', '#B0B0B0', '#A0A0A0', '#909090', '#808080', '#707070', '#606060', '#505050', '#404040', '#303030', '#202020', '#101010'];
</script>
<script setup lang="ts">
import { default as IconPresenter } from '@/components/IconPresenter.vue';
import { Icon as IconifyIcon } from '@iconify/vue';
import { Icon, IconSet, getIconSetById } from '@/model';

const route = useRoute();
const iconSet = ref<IconSet | null>(null);
const icon = ref<Icon | null>(null);
const error = ref<string | null>(null);

const setID = route.params.set as string;
const iconID = route.params.icon as string;

onMounted(() => {
    iconSet.value = getIconSetById(setID) || null;
    if (!iconSet.value) {
        error.value = `Icon set with ID "${setID}" not found.`;
        return;
    }

    icon.value = iconSet.value.getIcon(iconID) || null;
    if (!icon.value) {
        error.value = `Icon with ID "${iconID}" not found in set "${setID}".`;
        return;
    }
});

const fgColor = useQueryParam('fg', foregroundColors[0]);
const bgColor = useQueryParam('bg', 'transparent');
const sizeStr = useQueryParam('size', '32');

const size = computed(() => {
    return parseInt(sizeStr.value || '32', 10);
});
const setSize = (newSize: number | undefined) => {
    sizeStr.value = newSize?.toString() || '32';
};

function swapColors() {
    const temp = fgColor.value!;
    fgColor.value = bgColor.value!;
    bgColor.value = temp;
}

const presenter = useTemplateRef<typeof IconPresenter>('presenter');

function downloadURI(uri: string, name: string) {
    const link = document.createElement('a');
    link.href = uri;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function saveToPNG() {
    const result = await presenter.value!.toPNG();
    downloadURI(result.url, `${iconSet.value?.id}-${icon.value?.name}-${result.width}x${result.height}.png`);
};

async function saveToJPEG() {
    const result = await presenter.value!.toJPEG();
    downloadURI(result.url, `${iconSet.value?.id}-${icon.value?.name}-${result.width}x${result.height}.jpg`);
};
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
                    <a :href="`/${setID}`" class="hover:underline text-primary">
                        {{ setID }}
                    </a>
                    <span class="text-gray-500 px-2">
                        <IconifyIcon icon="fa7-solid:caret-right" class="inline-block" />
                    </span>
                    <span>{{ iconID }}</span>
                </h1>
            </div>

            <UAlert v-if="error" color="error" variant="outline" :description="error" :actions="[
                {
                    label: 'Back to Icon Set',
                    color: 'error',
                    variant: 'solid',
                    icon: 'fa6-solid:arrow-left',
                    to: `/${setID}`
                }
            ]" />

            <div v-if="icon">
                <div class="flex flex-col gap-4">
                    <div class="flex flex-row gap-1">
                        <UButton color="primary" variant="solid" label="Download (PNG)" icon="fa6-solid:download"
                            class="cursor-pointer" loading-auto @click="saveToPNG" />
                        <UButton color="primary" variant="solid" label="Download (JPEG)" icon="fa6-solid:download"
                            class="cursor-pointer" loading-auto @click="saveToJPEG" />
                    </div>

                    <div class="flex flex-row gap-4">
                        <IconPresenter ref="presenter" :icon="icon?.id" :fg="fgColor" :bg="bgColor" :size="size" />

                        <div class="flex flex-col gap-2 grow-1">
                            <div>
                                <UButton color="neutral" variant="outline" icon="fa6-solid:arrows-rotate"
                                    class="cursor-pointer" @click="swapColors">
                                    Swap colors
                                </UButton>
                            </div>
                            <ColorSelector label="Foreground color" :colors="foregroundColors" v-model="fgColor" />
                            <ColorSelector label="Background color" :colors="backgroundColors" v-model="bgColor" />
                            <SizeSelector :model-value="size" @update:model-value="setSize" />
                            <div class="grow-1"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>