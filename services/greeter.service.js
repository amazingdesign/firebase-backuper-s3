'use strict'

module.exports = {
  name: 'greeter',

  /**
	 * Service settings
	 */
  settings: {
    intervalId: null
  },

  /**
	 * Service dependencies
	 */
  dependencies: [],

  /**
	 * Actions
	 */
  actions: {

    /**
		 * Say a 'Hello'
		 *
		 * @returns
		 */
    hello() {
      return 'Hello Moleculer'
    },

    /**
		 * Welcome a username
		 *
		 * @param {String} name - User name
		 */
    welcome: {
      params: {
        name: 'string'
      },
      handler(ctx) {
        return `Welcome, ${ctx.params.name}`
      }
    }
  },

  /**
	 * Events
	 */
  events: {

  },

  /**
	 * Methods
	 */
  methods: {

  },

  created() {

  },

  started() {

  },

  stopped() {

  }
}