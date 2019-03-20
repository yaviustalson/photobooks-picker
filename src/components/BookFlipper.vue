<template>
    <div class='c-book-flipper' id='book-flipper'>
        <div
        class="c-book-flipper__page shadow zoom-this"
        v-for='(img, index) in images'
        :class='{"hard": isHardPage(index)}'
        :key='index'
        :style="{ backgroundImage: 'url(\'' + img + '\')', 'background-color': img ? '' : getRandomColor()}"
        >
        </div>
    </div>
</template>

<script>
const contentResizeKoeff = 0.95;
/* eslint-disable no-bitwise */
const getRandomColor = () => `#${((1 << 24) * Math.random() | 0).toString(16)}`;

export default {
    name: 'BookFlipper',
    components: {},
    props: {
        bookType: String,
        images: {
            type: Array,
            default() {
                return [];
            },
        },
        pageFormat: {
            type: Object,
            default() {
                return {
                    width: 20,
                    height: 20,
                };
            },
        },
    },
    data() {
        return {
            containerHeight: null,
            containerWidth: null,
            width: null,
            height: null,
        };
    },
    computed: {
        flipper() {
            return window.$('#book-flipper');
        },
    },
    watch: {},
    methods: {
        initSwiper() {
            const { width, height } = this;
            this.flipper.turn({
                width,
                height,
                autoCenter: true,
                duration: 1200,
                elevation: 120,
                gradients: true,
            });
        },
        setSize() {
            const { containerWidth, containerHeight, pageFormat } = this;
            const containerSizeRatio = containerWidth / containerHeight;
            const sizeRatio = (2 * pageFormat.width) / pageFormat.height;
            if (sizeRatio >= containerSizeRatio) {
                this.width = containerWidth * contentResizeKoeff;
                this.height = this.width / sizeRatio;
            } else {
                this.height = containerHeight * contentResizeKoeff;
                this.width = this.height * sizeRatio;
            }
        },
        setContainerSize() {
            const { width, height } = this.$el.parentElement.getBoundingClientRect();
            this.containerHeight = height * contentResizeKoeff;
            this.containerWidth = width * contentResizeKoeff;
        },
        next() {
            this.flipper.turn('next');
        },
        prev() {
            this.flipper.turn('previous');
        },
        isHardPage(index) {
            const { images } = this;
            const imagesCount = images.length;
            switch (index) {
                case 0:
                case 1:
                case imagesCount - 2:
                case imagesCount - 1:
                return true;
                default:
                return false;
            }
        },
        getRandomColor() {
            return getRandomColor();
        },
    },
    beforeMount() {},
    mounted() {
        this.setContainerSize();
        this.setSize();
        this.initSwiper();
    },
};
</script>

<style lang="stylus">
</style>
