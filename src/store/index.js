import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';
export default new Vuex.Store({
    modules: {},
    state: {},
    mutations: {
        setData(state, { name, data }) {
            state[name] = data;
        },
    },
    actions: {},
    strict: debug,
});
