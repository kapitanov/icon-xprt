<script lang="ts">
import * as htmlToImage from 'html-to-image';
import { Icon as IconifyIcon } from '@iconify/vue';

export default {
    name: 'IconPresenter',
    props: {
        class: { type: String, required: false },
        icon: { type: String, required: true },
        fg: { type: String, required: true },
        bg: { type: String, required: true },
        size: { type: Number, required: true }
    },
    components: {
        IconifyIcon
    },
    computed: {
        containerStyle() {
            return {
                color: this.fg,
                backgroundColor: this.bg,
                width: `${this.size}px`,
                height: `${this.size}px`,
                fontSize: `${this.size}px`
            };
        },
        divClass() {
            return `flex items-center justify-center w-96 h-96 border border-gray-600 bg-white rounded-lg shadow-md relative ${this.class}`;
        }
    },
    methods: {
        async toPNG() {
            const el = this.$refs.iconContainer as HTMLElement;
            const fontEmbedCSS = await htmlToImage.getFontEmbedCSS(el);
            const url = await htmlToImage.toPng(el, {
                backgroundColor: this.bg,
                fontEmbedCSS,
                width: this.size,
                height: this.size,
                canvasWidth: this.size,
                canvasHeight: this.size
            });
            return {
                url,
                width: this.size,
                height: this.size
            }
        },
        async toJPEG(quality = 0.92) {
            const el = this.$refs.iconContainer as HTMLElement;
            const fontEmbedCSS = await htmlToImage.getFontEmbedCSS(el);
            const url = await htmlToImage.toJpeg(el, {
                backgroundColor: this.bg,
                quality,
                fontEmbedCSS,
                width: this.size,
                height: this.size,
                canvasWidth: this.size,
                canvasHeight: this.size
            });
            return {
                url,
                width: this.size,
                height: this.size
            }
        }
    }
};
</script>


<template>
    <div :class="divClass">
        <div
            class="absolute overflow-hidden rounded-lg bg-gray-400 opacity-75 flex items-center justify-center w-full h-full z-0">
            <div class="absolute inset-0 h-full w-full checkboard"></div>
        </div>

        <div ref="iconContainer" class="flex items-center justify-center p-1 z-10" :style="containerStyle">
            <IconifyIcon :icon="icon" />
        </div>
    </div>
</template>