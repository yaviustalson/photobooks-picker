<template>
	<div class='app'>
		<div class="app__content-wrap">
			<div class="app__sidebar" :class='{active: !sideBarHidden}'>
				<span class="app__sidebar-hide" @click='sideBarHidden = true'>
					<SvgIcon icon='close'/>
				</span>
				<div class="app__filter">
					<SelectableList :items="themes" :basePath='baseAppPath' :activeTheme='activeTheme'/>
				</div>
				<div class="app__sidebar-info" v-if='activeTheme'>{{activeTheme.short_text}}</div>
			</div>
			<div class="app__main">
				<div class="app__header">
					<div class="app__header-block">
						<h1 class="app__title">{{ activeTheme ? activeTheme.header_h1 : 'Все фотокниги'}}</h1>
					</div>
					<div class="app__header-block app__description">
						<span class='app__start-price'>от 750 ₽</span>
						<span><a href="#">Подробнее о фотокнигах</a></span>
					</div>
					<div class="app__header-block">
						Выберите понравившийся дизайн и приступите к созданию вашей фотокниги
					</div>
					<div class="app__header-block app__create-btn">
						<button class="c-btn app__btn">
							Создать без шаблона
						</button>
					</div>
					<div class="app__header-block app__header-block_spread-items app__header-additional-block">
						<div class="app__filter-picker-btn c-btn" @click='sideBarHidden = false'>
							<span>Выбор темы</span>
							<SvgIcon icon='shevron-down'/>
						</div>
						<div class="app__items-count">
							{{designItems.length}} дизайнов
						</div>
					</div>
				</div>
				<div class="app__catalog">
					<div class="app__catalog-list" ref='list'>
						<div
						class="app__design-item"
						v-for='(design, index) in designItemsToShow'
						:key='design.id'
						@click='selectDesign(design, index)'
						>
							<div
							class="app__design-img"
							:style="{ backgroundImage: 'url(\'' + baseUrl + design.image + '\')', width: itemIconSize + 'px', height: itemIconSize + 'px'}"
							>
								<div
								class="app__design-img-mask"
								:style="{ backgroundImage: 'url(\'' + maskImg + '\')'}"
								></div>
								<div class="app__design-img-hover">
									<SvgIcon icon='magnify-plus'/>
									<span>Просмотр</span>
								</div>
							</div>
							<span class="app__design-title">
								{{design.name}}
							</span>
						</div>
						<div
						class="app__design-item"
						v-for='i in clearfixItemsCount'
						:key='i + "clearfixItem"'
						>
							<div
							class="app__design-img"
							:style="{visibility: 'hidden', cursor: 'default', width: itemIconSize + 'px', height: itemIconSize + 'px'}">
							</div>
						</div>
					</div>
					<button
					class="app__btn c-btn app__expand-btn"
					:disabled='itemsBatchLength * batchesCount >= designItems.length'
					@click='batchesCount++'>
						Показать еще
					</button>
				</div>
				<div class="app__bottom" v-if='activeTheme'>
					<h2 class="app__bottom-title">{{activeTheme.title}}</h2>
					<div class="app__bottom-text">{{activeTheme.long_text}}</div>
				</div>
			</div>
		</div>
		<transition name='fade'>
			<div class="app__product-picker" v-if='selectedDesign'>
				<div class="app__product-picker-wrap">
					<span class="app__product-picker-close" @click='selectedDesign=null'>
						<SvgIcon icon='close'/>
					</span>
					<div class="app__product-picker-main">
						<ProductPicker
						:design='selectedDesign'
						@changeDesign='changeDesign'/>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './styles/index.styl';
import './vendor/zoom';
import './vendor/turn';
import config from '../config';
import data from './data/';
import SelectableList from './components/SelectableList';
import SvgIcon from './components/SvgIcon';
import ProductPicker from './components/ProductPicker/';

export default {
	name: 'App',
	components: {
		SelectableList,
		SvgIcon,
		ProductPicker,
	},
	data() {
		return {
			itemsBatchLength: 12,
			batchesCount: 1,
			selectedDesign: null,
			selectedDesignIndex: null,
			itemIconSize: 0,
			sideBarHidden: true,
		};
	},
	computed: {
		designItems() {
			return data.designs.sort(({ priority: p1 }, { priority: p2 }) => p1 - p2) || [];
		},
		designItemsToShow() {
			return this.designItems.slice(0, this.itemsBatchLength * this.batchesCount);
		},
		maskImg() {
			return require('img/book-mask.png');
		},
		themes() {
			return data.themes || [];
		},
		activeTheme() {
			return data.activeTheme;
		},
		baseUrl() {
			return config.constants.BASE_URL;
		},
		href() {
			return window.location.href;
		},
		baseAppPath() {
			const { href, activeTheme } = this;
			if (activeTheme) {
				const { slug } = activeTheme;
				return href.slice(0, href.indexOf(slug));
			}
			return href;
		},
		clearfixItemsCount() {
			if (window.innerWidth > 667) {
				return (3 - ((this.designItemsToShow.length % 3))) % 3;
			}
			return 0;
		},
	},
	methods: {
		selectDesign(design, index) {
			this.selectedDesign = design;
			this.selectedDesignIndex = index;
		},
		changeDesign(shift) {
			const { selectedDesignIndex, designItems } = this;
			const designsCount = designItems.length;
			if (selectedDesignIndex === null) {
				return;
			}
			let newIndex = (selectedDesignIndex + shift) % designsCount;
			newIndex = newIndex < 0 ? newIndex = designsCount - 1 : newIndex;
			this.selectedDesign = designItems[newIndex];
			this.selectedDesignIndex = newIndex;
		},
		setItemIconSize() {
			const windowWidth = window.innerWidth;
			const { width } = this.$refs.list.getBoundingClientRect();
			if (windowWidth > 1240) {
				this.itemIconSize = 212;
				return;
			}
			if (windowWidth > 1024) {
				this.itemIconSize = 180;
				return;
			}
			if (windowWidth > 667) {
				this.itemIconSize = width * 0.244;
				return;
			}
			this.itemIconSize = width * 0.4475;
		},
	},
	beforeMount() {},
	mounted() {
		this.setItemIconSize();
		window.addEventListener('resize', this.setItemIconSize.bind(this));
	},
};
</script>

<style lang='stylus'>
</style>
