<h1 align="center">JEC Placement Management Web Application</h1>
<p>
    <a href="#" target="_blank">
        <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
    </a>
</p>

## ✨ [Live demo : https://jecplacementmanagement.netlify.app ](https://jecplacementmanagement.netlify.app)

## Introduction

This is a web application built with React and Javascript to ease and organize the process of placement drives for students of Jyothi Engineering College. The build tool used is [Vite](https://vitejs.dev/). [AntDesign](https://ant.design/) and [TailwindCSS](https://tailwindcss.com/docs/installation) are used for component library and styling respectively. The server is build using [Nodejs](https://nodejs.org/en). This repository contains the source code for the app.

## Prerequisites

Before running this project, make sure you have the following software installed on your system:

- Node.js (v18.14.2 or higher)
- pnpm (v8.2.0 or higher)

## Installation

**NB**: All the mentioned steps must be done within the `main` branch only.
To get started with the app, you will need to clone this repository and install the dependencies. You can do this by running the following commands in your terminal:

```sh
git clone https://github.com/emvk09/react-placementmanagement.git
cd react-placementmanagement
```

In the `client` directory, install client dependencies,

```sh
cd client
pnpm install
```

In the `server` directory, install server dependencies,

```sh
cd server
pnpm install
```

## Setting Environment Variables

In `client` directory, create a file `.env.local`

From your Firebase console, create a new project and add Firebase to your webapp in the project settings. Collect your web app's Firebase configuration and add the following in the file.

```sh
VITE_APIKEY=*******************
VITE_AUTHDOMAIN=***************
VITE_PROJECTID=****************
VITE_STORAGEBUCKET=************
VITE_MESSAGINGSENDERID=********
VITE_APPID=********************
```

In `server` directory, create a file `.env`

Make sure you signup for a Cloudinary account and Mongodb Atlas. Collect the secret keys and urls, and add the following in the file.

```sh
MONGODB_URL=*******************
CLOUDINARY_CLOUD_NAME=*********
CLOUDINARY_API_KEY=************
CLOUDINARY_API_SECRET=*********
```

## Usage

Once you have installed the dependencies and set the environment variables, you can run the server by running the following command from the `server` directory:

```sh
pnpm start
```

You can then run the client by running the following command from the `client` directory:

```sh
pnpm run dev
```

This will start the client and open the app in your default browser. This may take 2-3 minutes.

## Building

If you want to build the app for production, you can run the following command from the `client` directory:

```sh
pnpm run build
```

This will generate a production-ready build of the app in the `dist` directory.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
