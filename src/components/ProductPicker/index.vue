<template>
    <div class='product-picker' :class='{"product-picker_params-active": paramsActive}'>
        <div class="product-picker__design">
                <div class="product-picker__title">{{design.name}}</div>
                <div class="product-picker__subtitle">{{paramsActive ? 'Параметры фотокниги' : 'Просмотр дизайна'}}</div>
                <div class="product-picker__design-nav">
                    <span class="product-picker__prev-design-btn" @click='$emit("changeDesign", -1)'>
                        Предыдущий
                    </span>
                    <span class="product-picker__next-design-btn" @click='$emit("changeDesign", 1)'>
                        Следующий
                    </span>
                </div>
        </div>
        <div class="product-picker__info" v-if='!paramsActive'>
                <span>Срок изготовления — 3-5 рабочих дней</span>
                <a href="/dostavka/">Сроки и способы доставки</a>
        </div>
        <div class="product-picker__main">
            <div class="product-picker__preview">
                <div class="product-picker__preview-wrap">
                    <div class="product-picker__subtitle">Нажимайте на страницы для просмотра дизайна</div>
                    <div class="product-picker__flipper-wrap">
                        <span class="product-picker__params-slider-btn" @click='flipPage(-1)'>
                            <SvgIcon icon='shevron-left'/>
                        </span>
                        <div class="product-picker__flipper">
                            <BookFlipper
                            v-if='selectedFormat && bookFlipperImages && bookFlipperImages.length'
                            ref='flipper'
                            :key='flipperKey'
                            :images='bookFlipperImages'
                            :pageFormat='selectedFormat'/>
                        </div>
                        <span class="product-picker__params-slider-btn" @click='flipPage(1)'>
                            <SvgIcon icon='shevron-right'/>
                        </span>
                    </div>
                    <button class='product-picker__submit c-btn' @click='goToParams'>Выбрать дизайн</button>
                </div>
            </div>
            <div class="product-picker__params">
                <div class="product-picker__params-block product-picker__formats">
                    <div class="product-picker__params-title">Формат и размер фотокниги</div>
                    <div class="product-picker__params-slider" :style='{height: sliderItemHeight + 24 + "px"}'>
                        <span class="product-picker__params-slider-btn" @click='slide("formatSlider", -1)'>
                            <SvgIcon icon='shevron-left'/>
                        </span>
                        <Slick
                        ref='formatSlider'
                        :options='formatSliderOptions'
                        @reInit='reInitSlider("formatSlider")'>
                            <div
                            class="product-picker__params-slider-item"
                            v-for='(format, index) in bookFormats'
                            :key='index'
                            :class='{"product-picker__params-slider-item_disabled": !format.available}'
                            @click='selectFormat(format)'>
                                <ProductParam
                                :title='format.width + "x" + format.height'
                                :iconSize='{width: resolveFormatItemSize(format.width), height: resolveFormatItemSize(format.height)}'
                                :discount='format.discount'
                                :disabled='!format.available'
                                :selected='format === selectedFormat'>
                                    <FormatItem
                                    :width='resolveFormatItemSize(format.width)'
                                    :height='resolveFormatItemSize(format.height)'
                                    :disabled='!format.available'/>
                                </ProductParam>
                            </div>
                        </Slick>
                        <span class="product-picker__params-slider-btn" @click='slide("formatSlider", 1)'>
                            <SvgIcon icon='shevron-right'/>
                        </span>
                    </div>
                </div>
                <div class="product-picker__params-block product-picker__types">
                    <div class="product-picker__params-title">
                        <span>Тип фотокниги</span>
                        <a href="/products/2/" class='product-picker__params-title-add'>Подробнее о типах</a>
                    </div>
                    <div class="product-picker__params-slider" :style='{height: sliderItemHeight + 24 + "px"}'>
                        <span class="product-picker__params-slider-btn" @click='slide("typeSlider", -1)'>
                            <SvgIcon icon='shevron-left'/>
                        </span>
                        <Slick
                        ref='typeSlider'
                        :options='typeSliderOptions'
                        :slidesToShow='2'
                        @reInit='reInitSlider("typeSlider")'>
                            <div
                            class="product-picker__params-slider-item"
                            v-for='(type, index) in bookTypes'
                            :key='index'
                            @click='selectType(type)'
                            :disabled='!type.available'>
                                <ProductParam
                                :title='type.name'
                                :iconSize='{width: 72, height: 52}'
                                :discount='type.discount'
                                :iconBorder='type.available ? "1px solid #000000" : "1px solid rgba(0,0,0,0.2)"'
                                :alignTop='true'
                                :disabled='!type.available'
                                :selected='type === selectedType'>
                                    <div
                                    class="product-picker__type-item"
                                    :style="type.img ? { backgroundImage: 'url(\'' + type.img + '\')'} : ''"
                                    ></div>
                                </ProductParam>
                            </div>
                        </Slick>
                        <span class="product-picker__params-slider-btn" @click='slide("typeSlider", 1)'>
                            <SvgIcon icon='shevron-right'/>
                        </span>
                    </div>
                </div>
                <div class="product-picker__params-block product-picker__capacity">
                    <button class='product-picker__submit c-btn' @click='createProject'>Выбрать дизайн</button>
                    <div class="product-picker__price" v-if='selectedFormat'>
                        <span>Стоимость</span>
                        <Price
                        :value='price'
                        />
                    </div>
                    <div class="product-picker__pages-count" v-if='selectedFormat'>
                        <span>Кол-во страниц</span>
                        <NumericInput
                        :value='pagesCount'
                        :initialValue='pagesCount'
                        :min='selectedFormat.pagesMin'
                        :max='selectedFormat.pagesMax'
                        :step='selectedFormat.pagesStep'
                        @input='onPagesCountInput'
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Slick from 'vue-slick';
import BookFlipper from '../BookFlipper';
import FormatItem from './FormatItem';
import ProductParam from './ProductParam';
import SvgIcon from '../SvgIcon';
import Price from '../Price';
import NumericInput from '../NumericInput';
import { createProject } from '../../serverApi';
import data from '../../data/';
import { constants } from '../../../config';

const sortParamItems = (a, b) => {
    if (a.available && !b.available) {
        return -1;
    } else if (!a.available && b.available) {
        return 1;
    }
    return 0;
};

const sliderParams = {
    infinite: false,
    accessibility: true,
    adaptiveHeight: false,
    arrows: false,
    dots: false,
    draggable: true,
    edgeFriction: 0.30,
    swipe: true,
    touchThreshold: 12,
};

export default {
    name: 'ProductPicker',
    components: {
        Slick,
        SvgIcon,
        BookFlipper,
        ProductParam,
        FormatItem,
        Price,
        NumericInput,
    },
    props: {
        design: Object,
    },
    data() {
        return {
            sliderItemHeight: 67,
            formatItemResizeKoeff: 1,
            selectedType: null,
            selectedFormat: null,
            pagesCount: 0,
            flipperKey: Math.random(),
            paramsActive: false,
        };
    },
    computed: {
        bookTypes() {
            const types = Object.assign([], data.bookTypes);
            for (let i = 0; i < types.length; i++) {
                const type = types[i];
                this.design.productTypes.forEach(({ name }) => {
                    if (type.regex.test(name)) {
                        type.available = true;
                    }
                });
            }
            types.sort(sortParamItems);
            return types;
        },
        bookFormats() {
            const formats = Object.assign([], data.bookFormats);
            const { selectedType, design } = this;
            const { productTypes } = design;
            if (selectedType && productTypes) {
                const type = productTypes.filter(({ name }) => selectedType.regex.test(name))[0];
                if (!type) {
                    return formats;
                }
                for (let i = 0; i < formats.length; i++) {
                    const format = formats[i];
                    for (let j = 0; j < type.formats.length; j++) {
                        const _format = type.formats[j];
                        const { width, height } = _format;
                        if (format.height === height && format.width === width) {
                            Object.assign(format, _format, { available: true });
                            break;
                        }
                        format.available = false;
                    }
                }
                formats.sort(sortParamItems);
            }
            return formats;
        },
        bookFlipperImages() {
            const { selectedFormat, design } = this;
            const { pageImages } = selectedFormat;
            let imgs = [];
            if (pageImages && pageImages.length > 1) {
                let urls = [];
                pageImages.forEach((item) => {
                    urls = urls.concat(item);
                });
                const end = urls.shift();
                const regex = /https?:\/\/.*?\//i;
                urls.push(end);
                if (urls % 2 === 1) {
                    urls.splice(urls.length - 2, 1);
                }
                imgs = urls.map(imgUrl => {
                    if (regex.test(imgUrl)) {
                        return imgUrl ? `${imgUrl.replace(/https?:\/\/.*?\//i, `${constants.BASE_URL}/`)}` : '';
                    }
                    return imgUrl ? `${constants.BASE_URL}/${imgUrl}` : '';
                });
            } else {
                for (let i = 0; i < selectedFormat.pagesMin; i++) {
                    imgs.push(i === 0 ? `${constants.BASE_URL}${design.image}` : '');
                }
            }
            return imgs;
        },
        formatSliderOptions() {
            const windowWidth = window.innerWidth;
            let slidesToShow = 4;
            if (windowWidth < 1240 && windowWidth > 767) {
                slidesToShow = 6;
            }
            return Object.assign({}, sliderParams, { slidesToShow });
        },
        typeSliderOptions() {
            const windowWidth = window.innerWidth;
            let slidesToShow = 3;
            if (windowWidth < 1240 && windowWidth > 767) {
                slidesToShow = 5;
            }
            return Object.assign({}, sliderParams, { slidesToShow });
        },
        price() {
            const { selectedFormat, pagesCount } = this;
            if (!selectedFormat) {
                return 0;
            }
            const { price, pagesMin, priceStep, pagesStep } = selectedFormat;
            return price + (((pagesCount - pagesMin) / pagesStep) * priceStep);
        },
    },
    watch: {
        selectedFormat() {
            this.flipperKey = Math.random();
        },
        design() {
            this.flipperKey = Math.random();
        },
        selectedType() {
            this.$nextTick(() => {
                this.selectedFormat = this.bookFormats[0];
                this.$refs.formatSlider.goTo(0);
                this.pagesCount = this.selectedFormat.pagesMin;
            });
        },
    },
    methods: {
        reInitSlider(sliderName) {
            this.$nextTick(() => {
                this.$refs[sliderName].reSlick();
            });
        },
        setFormatItemResizeKoeff() {
            let maxHeight = 0;
            this.bookFormats.forEach((format) => {
                const { height } = format;
                if (height > maxHeight) {
                    maxHeight = height;
                }
            });
            this.formatItemResizeKoeff = (this.sliderItemHeight / maxHeight) * 0.9;
            this.formatItemMaxHeight = maxHeight;
        },
        resolveFormatItemSize(val) {
            const { formatItemMaxHeight, formatItemResizeKoeff } = this;
            return val * formatItemResizeKoeff * (formatItemMaxHeight === val ? 0.9 : 1);
        },
        slide(sliderName, direction) {
            const methodName = direction === 1 ? 'next' : 'prev';
            this.$refs[sliderName][methodName]();
        },
        flipPage(direction) {
            const { flipper } = this.$refs;
            if (direction === -1) {
                flipper.prev();
            } else {
                flipper.next();
            }
        },
        goToParams() {
            this.paramsActive = true;
                this.reInitSlider('formatSlider');
            this.reInitSlider('typeSlider');
        },
        setDefaultSelection() {
            this.selectedType = this.bookTypes[0];
            this.selectedFormat = this.bookFormats[0];
            this.pagesCount = this.bookFormats[0].pagesMin;
        },
        onPagesCountInput(val) {
            console.log('onPagesCountInput', val);
            this.pagesCount = val;
        },
        async createProject() {
            const { selectedFormat, pagesCount } = this;
            try {
                const res = await createProject({
                    name: selectedFormat.title,
                    new_editor: true,
                    pages_count: pagesCount,
                    product_kind: selectedFormat.production,
                    template_id: selectedFormat.layout,
                    tmc_id: selectedFormat.product,
                });
                if (res.error) {
                    throw new Error(res.errorText);
                }
                console.log(`Pproject created. Id: ${res}`);
                window.location = `${constants.BASE_URL}/projectEditor/?project_id=${res}`;
            } catch (e) {
                console.warn(e);
            }
        },
        selectType(type) {
            if (type.available) {
                this.selectedType = type;
            }
        },
        selectFormat(format) {
            if (format.available) {
                this.selectedFormat = format;
            }
        },
    },
    beforeMount() {
        this.setFormatItemResizeKoeff();
        this.setDefaultSelection();
    },
    mounted() {
        this.setDefaultSelection();
        this.$forceUpdate();
        this.reInitSlider('formatSlider');
    },
};
</script>


<style lang="stylus">
</style>
