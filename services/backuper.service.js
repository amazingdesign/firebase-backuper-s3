'use strict'

module.exports = {
  name: 'backuper',

  settings: {
    intervalId: null
  },

  methods: {
    backup(){

    }

  },

  started() {
    this.backup()
  },

  stopped() {
    if (this.settings.intervalId) {
      clearInterval(this.settings.intervalId)
    }
  }
}