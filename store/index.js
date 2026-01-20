import { createStore } from 'vuex'
import user from './modules/user'
import app from './modules/app'

const store = createStore({
	modules: {
		user,
		app
	}
})

export default store 