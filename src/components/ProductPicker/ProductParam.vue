<template>
    <div class='c-product-param'
    :style='style'
    :class='{
        "c-product-param_discount": discount,
        "c-product-param_selected": selected,
        "c-product-param_disabled": disabled}'>
        <div
        class="c-product-param__icon"
        :style='iconStyle'>
            <slot>
            </slot>
            <span class="c-product-param__discount-icon">
                <SvgIcon icon='discount' :originalColor='true'/>
            </span>
            <span class="c-product-param__selected-icon">
                <SvgIcon icon='selected' :originalColor='true'/>
            </span>
        </div>
        <span class="c-product-param__value">{{title}}</span>
    </div>
</template>

<script>
import SvgIcon from '../SvgIcon';

export default {
    name: 'ProductParam',
    components: { SvgIcon },
    props: {
        discount: {
            type: Boolean,
            default: false,
        },
        selected: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        title: String,
        iconSize: {
            type: Object,
            default() {
                return null;
            },
        },
        iconBorder: String,
        alignTop: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {};
    },
    computed: {
        style() {
            const { alignTop } = this;
            const style = {};
            if (alignTop) {
                style['justify-content'] = 'flex-start';
            }
            return style;
        },
        iconStyle() {
            const { iconSize, iconBorder } = this;
            const style = {};
            if (iconSize) {
                style.width = `${iconSize.width}px`;
                style.height = `${iconSize.height}px`;
            }
            if (iconBorder) {
                style.border = iconBorder;
            }
            return style;
        },
    },
    watch: {},
    methods: {},
    mounted() {},
};
</script>


<style lang="stylus">
</style>
