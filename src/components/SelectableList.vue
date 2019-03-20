<template>
    <div class='c-selectable-list'>
        <div
        class='c-selectable-list__item'
        :class='{active: !activeTheme}'
        key='no_theme'>
            <a
            class='c-selectable-list__item-title'
            :href='basePath'
            >Все дизайны
            </a>
        </div>
        <div
        class='c-selectable-list__item'
        v-for='item in _items'
        :class='{active: activeTheme && item.id === activeTheme.id }'
        :key='item.id'>
            <a
            class='c-selectable-list__item-title'
            :href='basePath + item.slug'
            >{{item.title}}
            </a>
            <div v-if='item.addition' class="c-selectable-list__item-add">{{item.addition}}</div>
        </div>
        <div class="c-selectable-list__expand-btn" @click='expanded = !expanded'>
            {{expanded ? 'Скрыть все' : 'Показать все'}}
            <slot name='itemsName'>темы</slot>
            <SvgIcon :icon='expanded ? "shevron-up" : "shevron-down"'/>
        </div>
    </div>
</template>

<script>
import SvgIcon from './SvgIcon';

export default {
    name: 'SelectableList',
    components: {
        SvgIcon,
    },
    props: {
        items: {
            type: Array,
            default() {
                return [];
            },
        },
        itemsToShow: {
            type: Number,
            default: 7,
        },
        basePath: {
            type: String,
            required: true,
        },
        activeTheme: Object,
    },
    data() {
        return {
            expanded: false,
            selectedItem: null,
        };
    },
    computed: {
        _items() {
            if (this.expanded) {
                return this.items;
            }
            return this.items.slice(0, this.itemsToShow);
        },
    },
    watch: {},
    methods: {},
    mounted() {},
};
</script>


<style lang="stylus">
</style>
