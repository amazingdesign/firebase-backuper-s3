/* eslint-disable max-lines */
'use strict'

const { getConfig, getConfigOrFail } = require('@bit/amazingdesign.utils.config')

const intervalTime = Number(getConfig('INTERVAL_TIME') || 24 * 60 * 60 * 1000)

// MOMENT
const moment = require('moment')
const dateTimeFormat = getConfig('DATE_TIME_FORMAT') || 'DD-MM-YYYY:HH:ss'

// FIREBASE
const admin = require('firebase-admin')
const serviceAccount = require('../secure-service-account.json')
const dbName = process.env.DATABASE_NAME || serviceAccount.project_id
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${dbName}.firebaseio.com`
})

// S3
const AWS = require('aws-sdk')
const directory = getConfig('S3_DIRECTORY') || dbName
const s3 = new AWS.S3({
  accessKeyId: getConfigOrFail('AWS_ID'),
  secretAccessKey: getConfigOrFail('AWS_SECRET'),
})

module.exports = {
  name: 'backuper',

  settings: {
    intervalId: null
  },

  methods: {
    downloadFile() {
      const path = process.env.DB_PATH || '/'

      this.logger.info('STARTING TO FETCH ' + path)

      return admin.database().ref(path).once('value')
        .then(snapshot => {
          this.logger.info('DATA FETCHED!')
          return JSON.stringify(snapshot.val())
        })
        .catch(error => {
          this.logger.error('ERROR DURING FETCH')
          this.logger.error(error)

          return Promise.reject(error)
        })
    },
    saveJSONToS3(content) {
      this.logger.info('SAVING TO S3...')

      const params = {
        Bucket: getConfigOrFail('AWS_BUCKET_NAME'),
        Key: `${directory}/${moment().format(dateTimeFormat)}.json`,
        Body: content,
      }

      return new Promise((resolve, reject) => {
        s3.upload(
          params,
          (err, data) => {
            if (err) {
              this.logger.info('SAVING TO S3 FAILURE!')
              reject(err)
            } else {
              this.logger.info('SAVING TO S3 SUCCESS!')
              resolve()
            }
          }
        )
      })
    },
    backup() {
      this.downloadFile()
        .then(this.saveJSONToS3)
        .then(() => this.logger.info('BACKUP SUCCESS!'))
        .catch(() => this.logger.info('BACKUP FAILURE!'))
    }
  },

  started() {
    this.logger.info(
      `SETTING INTERVAL TO BACKUP EVERY ${intervalTime} ms (${moment().to(Date.now() + intervalTime, true)})`
    )

    this.settings.intervalId = setInterval(
      () => this.backup(),
      intervalTime
    )

    this.backup()

  },

  stopped() {
    if (this.settings.intervalId) {
      clearInterval(this.settings.intervalId)
    }
  }
}