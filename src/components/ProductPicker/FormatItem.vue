<template>
    <div
    class='c-format-item'
    :style='{width: width + "px", height: height + "px"}'
    :class='{"c-format-item_disabled": disabled}'>
    </div>
</template>

<script>
export default {
    name: 'FormatItem',
    components: {},
    props: {
        width: {
            type: Number,
            default: 20,
        },
        height: {
            type: Number,
            default: 20,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {};
    },
    computed: {},
    watch: {},
    methods: {},
    mounted() {},
};
</script>


<style lang="stylus">
</style>
