<template>
    <div class='c-numeric-input'>
        <slot name='decrBtn'>
            <span
            class='c-numeric-input__btn c-numeric-input__decr-btn'
            :class='{"c-numeric-input__btn_disabled": value === min}'
            @click='change(-1)'>
                <SvgIcon icon='shevron-left'/>
            </span>
        </slot>
        <input
            ref='input'
            class='c-numeric-input__native'
            type='number'
            :value='value'
            @input='onInput'>
        <slot name='incrBtn'>
            <span
            class='c-numeric-input__btn c-numeric-input__incr-btn'
            :class='{"c-numeric-input__btn_disabled": value === max}'
            @click='change(1)'>
                <SvgIcon icon='shevron-right'/>
            </span>
        </slot>
    </div>
</template>

<script>
import SvgIcon from './SvgIcon';

export default {
    name: 'NumericInput',
    components: {
        SvgIcon,
    },
    props: {
        initialValue: Number,
        value: Number,
        min: Number,
        max: Number,
        step: {
            type: Number,
            default: 1,
        },
    },
    data() {
        return {};
    },
    computed: {},
    watch: {},
    methods: {
        change(sign) {
            const { value, step } = this;
            const newVal = value + (sign * step);
            this.$emit('input', this.correctValue(newVal));
        },
        onInput({ target }) {
            const newVal = this.correctValue(parseInt(target.value, 10));
            /* eslint-disable no-param-reassign */
            target.value = newVal;
            this.$emit('input', newVal);
        },
        correctValue(val) {
            const { max, min, step } = this;
            let value = val || this.value;
            if (value < min) {
                value = min;
            }
            if (value > max) {
                value = max;
            }
            return value - (value % step);
        },
    },
    mounted() {},
};
</script>


<style lang="stylus">
</style>
