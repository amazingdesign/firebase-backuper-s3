# firebase-backuper-s3

This is a simple NodeJS service written using [Moleculer Framework](https://moleculer.services/) to fetch and backup your Realtime Database from Firebase to Amazon S3.

## Configuration

You must specify `.env` file with vars as they are described in [.env.example](.env.example).

Notice that only ASW related variables are required, but others can be useful to fetch only part of your DB or schedule recurring backups.

This app connect to Firebase through service account .json file. The file can be found in your Firebase project console in Settings > Project Settings in Service accounts tab.

You must put the file as `secure-service-account.json` in main folder or mount in `/app` folder when using Docker.

## Usage

When `.env` file and `secure-service-account.json` are present you can run app with:

```bash
npm install

npm start
```

or using Docker:

```bash
docker build . --tag firebase-backuper-s3

docker run firebase-backuper-s3 \
  --env-file /path/to/your/.env
  -v /path/to/your/secure-service-account.json:/app/secure-service-account.json
```
