import { createStore, Commit } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
import { arrToObj, objToArr } from './helper'

interface ListProps<P> {
  [id: string]: P;
}

export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
  avatar?: ImageProps;
  description?: string;
}

export interface ImageProps {
  url?: string;
  _id?: string;
  createdAt?: string;
  fitUrl?: string;
}

export interface ColumnProps {
  _id: string;
  title: string,
  avatar?: ImageProps,
  description: string,
}

export interface PostProps {
  _id?: string,
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps | string
  createdAt?: string;
  column: string;
  author?: string | UserProps;
  isHTML?: boolean;
}
export interface GlobalDataProps {
  token: string;
  columns: { data: ListProps<ColumnProps>; currentPage: number, total: number};
  posts: { data: ListProps<PostProps>; loadedColumns: string[] };
  user: UserProps;
  loading: boolean;
  error: GlobalErrorProps 
}

export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}

export interface ResponseType<P = {}> {
  code: number;
  msg: string;
  data: P;
}

const asyncAndCommit = async(url: string, mutationName: string, commit: Commit, config: AxiosRequestConfig = {method: 'get'}, extraData?: any) => {
  const { data } = await axios(url, config)
  if(extraData) {
    commit(mutationName, {data, extraData})
  }else {
    commit(mutationName, data)
  }
  return data
}

const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    columns: { data: {}, currentPage: 0, total: 0},
    posts: { data: {}, loadedColumns: []},
    user: { isLogin: false },
    loading: false
  },
  mutations: {
    createPost(state, newPost) {
      state.posts.data[newPost._id] = newPost
    },
    fetchColumns(state, rawData) {
      const { data } = state.columns
      const { list, count, currentPage } = rawData.data
      state.columns = {
        data: { ...data, ...arrToObj(list)},
        total: count,
        currentPage: currentPage * 1
      }
    },
    fetchColumn(state, rawData) {
      state.columns.data[rawData.data._id] = rawData.data
    },
    fetchPosts(state, { data: rawData, extarData: columnId}) {
      state.posts.data = { ...state.posts.data, ...arrToObj(rawData.data.list)}
      state.posts.loadedColumns.push(columnId)
    },
    fetchPost(state, rawData) {
      state.posts.data[rawData.data._id] = rawData.data
    },
    updatePost(state, { data }) {
      state.posts.data[data._id] = data
    },
    deletePost(state, { data }) {
      delete state.posts.data[data._id]
    },
    fetchCurrentUser(state, rawData) {
      state.user = {isLogin: true, ...rawData.data}
    },
    setLoading(state, status) {
      state.loading = status
    },
    setError(state, error) {
      state.error = error
      console.log(state.error)
    },
    login(state, rawData) {
      const { token } = rawData.data
      state.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    logout(state) {
      state.token = ''
      state.user = {...state.user, isLogin: false}
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    }
  },
  actions: {
    fetchColumns({ state, commit }, params={}) {
      const { currentPage = 1, pageSize = 6 } = params
      if(state.columns.currentPage < currentPage) {
        return asyncAndCommit(`/columns?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchColumns', commit)
      }
    },
    fetchColumn({ state, commit }, cid) {
      if(!state.posts.loadedColumns.includes(cid)) {
        return asyncAndCommit(`/columns/${cid}`, 'fetchColumn', commit, { method: 'get' }, cid)
      }
    },
    fetchPosts({ state, commit }, id) {
      if(!state.posts.loadedColumns.includes(id)) {
        return asyncAndCommit(`/columns/${id}/posts`, 'fetchPosts', commit, { method: 'get'}, id)
      }
    },
    fetchPost({ state, commit }, id) {
      const currentPost = state.posts.data[id]
      if(!currentPost || !currentPost.content) {
        return asyncAndCommit(`/posts/${id}`, 'fetchPost', commit)
      }else {
        return Promise.resolve({ data: currentPost })
      }
    },
    updatePost({ commit }, { id, payload}) {
      return asyncAndCommit(`/posts/${id}`, 'updatePost', commit, {
        method: 'patch',
        data: payload
      })
    },
    fetchCurrentUser({ commit }) {
      return asyncAndCommit('user/current', 'fetchCurrentUser', commit)
    },
    createPost( {commit}, payload ) {
      return asyncAndCommit('/posts', 'createPost', commit, { method: 'post', data: payload })
    },
    deletePost({ commit }, id) {
      return asyncAndCommit(`/posts/${id}`, 'createPost', commit, { method: 'delete'})
    },
    login({commit}, payload) {
      return asyncAndCommit('user/login', 'login', commit, { method: 'post', data: payload})
    },
    loginAndFetch({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    }
  },
  getters: {
    getColumns: (state) => {
      return objToArr(state.columns.data)
    },
    getColumnById: (state) => (id: string) => {
      return state.columns.data[id]
    },
    getPostsByCid: (state) => (cid: string) => {
      return objToArr(state.posts.data).filter(post => post.column === cid)
    },
    getCurrentPost: (state) => (cid: string) => {
      return state.posts.data[cid]
    }
  }
})

export default store