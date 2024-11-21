import { createStore } from "vuex";
import {localStorageService} from "@/LocalStorageService";

const store = createStore(
    {
        state: {
            token: null,
            isAuthenticated: false,
            user: localStorageService.getItem('auth_token') || null,

        },
        mutations: {
            setToken: (state, token) => {
                state.token = token;
                state.isAuthenticated = !!token;
            },
            logout: (state) => {
                state.token = null;
                state.isAuthenticated = false;
            },
            setUser(state, userData) {
                state.user = userData
            },
        },
        actions: {
            login({ commit }, token) {
                commit('setToken', token);
            },
            logout({ commit }) {
                commit('logout');
            },
            updateUser({ commit }, userData) {
                commit('setUser', userData)
            },
        },
        getters: {
            isAuthenticated: state => {
                !!state.isAuthenticated;
            },
            user: (state) => state.user
        }
    }
)

export default store;