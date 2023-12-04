# Melodiverse

An all new sample sharing and music collaboration platform.

## Features

- The ability to upload and download samples.
- A comment and like system.
- A fleshed out filtering system to sort by genre, key, bpm, and more.
- Groups that let you collaboratively upload samples under a collective name.
- A messaging and alert system.
- A moderation system to control content and post issues.

## Installation

Pre-requisites:

> Node.JS and npm
> 
> MongoDB

Instructions:

Make sure pre-requisites are installed, then clone the github repository. You will need 2 terminals to run the application locally.

Enter the project directory.
```
cd melodiverse
```

Terminal 1:

```
cd client
npm install
npm run dev
```

Terminal 2:

```
cd server
npm install
npm run dev
```

There are default settings that will let the application run with no additional configuration. However it is recommended to go to the server.ts file and change some of the variables using a .env file, including the MongoDB server URL and security keys.

### Additional information

This is built using typescript on the backend, and JS on the frontend. I try to keep them separated. The frontend is just built with vanilla react and vite. You can look at the [vite documentation](https://vitejs.dev/guide) to get an idea of how to deploy. I recommend using [PM2](https://pm2.keymetrics.io/) for the backend if you plan on hosting this for whatever reason (maybe as a local way to manage your samples). There should always be a hosted version of this app by me as well.
  

  
