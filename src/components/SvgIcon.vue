<template>
    <div class="c-svg-icon" v-html='src'></div>
</template>

<script>
/* eslint-disable */
export default {
    name: 'SvgIcon',
    props: ['icon', 'color', 'originalColor'],
    computed: {
        src() {
            return require('icons/' + this.icon + '.svg');
        },
        _color() {
            return this.color || 'currentColor'
        },
    },
    methods: {
        getClassList(str) {
            const classList = {};
            let arr = str.match(/\.([^}]*?)(,|{)/g);
            arr = arr.map(el => el.slice(1,-1));
            arr.forEach(el => {
                if(!classList.hasOwnProperty(el)) {
                    classList[el] = 'class' + Math.random().toString().slice(2);
                }
            });
            return classList;
        },
        swapClasses(element, classList) {
            if (!element.classList) {
                return;
            }
            const classArr = Object.assign([], element.classList);
            classArr.forEach((el) => {
                element.classList.remove(el);
                element.classList.add(classList[el]);
            });
        },
        modifyStyleStr(str, classList) {
            let res = str;
            if (!this.originalColor) {
                res = str.replace(/#([\d\w^f]{6}|[\d\w^f]{3})([;}\n ])/g, this._color + '$2');
            }
            // let res = str.replace(/#([^f]{6}|[^f]{3})([;}\n ])/g, this._color + '$2');
            Object.keys(classList).forEach((key) => {
                const regex = new RegExp(key, 'g');
                res.match(regex).forEach(() => {
                    res = res.replace(key, classList[key]);
                });
            });
            return res;
        },
    },
    mounted() {
        const el = this.$el.firstChild;
        if (!el || !el.removeAttribute) return;
        el.removeAttribute('height');
        el.removeAttribute('width');
        el.removeAttribute('fill');
        const styleNode = this.$el.querySelector('style');
        if (styleNode) {
            const classList = this.getClassList(styleNode.innerHTML);
            const styleStr = this.modifyStyleStr(styleNode.innerHTML, classList);
            styleNode.innerHTML = styleStr;
            this.$el.querySelectorAll('*').forEach((el) => {
                this.swapClasses(el, classList);
            });
        } else {
            const defNode = document.createElement('defs');
            const styleNode = document.createElement('style');
            const className = 'class' + Math.random().toString().slice(2);
            let node = el.firstChild;
            while (node instanceof Text) {
                node = node.nextSibling;
            }
            node.setAttribute('class', className);
            styleNode.innerHTML = `.${className}{fill: ${this._color}}`;
            defNode.appendChild(styleNode);
            el.prepend(defNode);
        }
    },
};
</script>

<style lang="stylus" scoped>
.c-svg-icon
    overflow visible
    display flex
    justify-content center
    align-items center
    color inherit
</style>
