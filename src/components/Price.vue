<template>
    <div class='c-price'
    :class='{"c-price_discount": oldValue}'>
        <div class="c-price__old-value">
            {{oldValue}}
        </div>
        <div class="c-price__value">
            {{value + ' ₽'}}
        </div>
    </div>
</template>

<script>
export default {
    name: 'Price',
    components: {},
    props: {
        oldValue: {
            type: Number,
            default: 0,
        },
        value: Number,
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
