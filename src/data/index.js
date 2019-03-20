/* eslint-disable import/no-mutable-exports */
/* eslint-disable import/no-dynamic-require */
import designsStub from './stub/designs';
import themesStub from './stub/themes';
import activeTheme from './stub/activeTheme';

const bookFormats = [
    {
        width: 15,
        height: 20,
        discount: false,
        available: false,
    },
    {
        width: 20,
        height: 15,
        discount: false,
        available: false,
    },
    {
        width: 20,
        height: 20,
        discount: false,
        available: false,
    },
    {
        width: 20,
        height: 30,
        discount: false,
        available: false,
    },
    {
        width: 30,
        height: 20,
        discount: false,
        available: false,
    },
    {
        width: 30,
        height: 30,
        discount: false,
        available: false,
    },
];

const bookTypes = [
    {
        name: 'Фотокнига',
        img: require('img/book-img.png'),
        discount: false,
        regex: /фотокниги/i,
        available: false,
    },
    {
        name: 'Фотокнига Flexbind',
        img: require('img/book-flex-img.png'),
        discount: false,
        regex: /flexbind/i,
        available: false,
    },
    {
        name: 'Фотоальбом',
        img: require('img/album-img.png'),
        discount: false,
        regex: /фотоальбом/i,
        available: false,
    },
    {
        name: 'Фототетрадь',
        img: null,
        discount: false,
        regex: /фототетрад/i,
        available: false,
    },
    {
        name: 'Фотоблокнот',
        img: null,
        discount: false,
        regex: /фотоблокнот/i,
        available: false,
    },
];

const bookFlipperImgs = [];

for (let i = 1; i < 13; i++) {
    bookFlipperImgs.push(require(`img/flipper/img${i}.png`));
}

const stubs = {
    themes: themesStub,
    designs: designsStub,
    bookFlipperImgs,
    bookTypes,
    bookFormats,
    activeTheme,
};

let data = {};

if (process.env.NODE_ENV === 'production') {
    data = {
        designs: window.grouped_designs,
        themes: window.all_themes,
        bookFormats,
        bookTypes,
        activeTheme: window.active_theme,
    };
} else {
    data = stubs;
}
console.log('[debug] data', data);

export default data;
