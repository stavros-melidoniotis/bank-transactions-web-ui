## bank-transactions-web-ui 📈💸

A simple dashboard to view monthly analytics of my bank transactions. Built with Next.js and MongoDB.

## How it works

Each month's transactions are being exported into a tsv file. This file is then parsed by the [transactions parser](https://github.com/stavros-melidoniotis/bank-transactions-parser) which extracts all the useful information and uploads it to a MongoDB database collection. The Next.js app then reads that data from the MongoDB collection and displays it in a beautiful, simplistic UI.

## Features
- Multiple users
- Login/Logout
- Comparisons between current and previous month
- Fully responsive
- Display data on charts (w/ [ApexCharts.js](https://apexcharts.com/))
- Dark/Light theme
- Month/Year navigator

## Demo

To see a live version of this project visit the [app](https://bank-transactions.melidon.dev/) and login with:
- username: ```demo```
- password: ```super-secret-passw0rd```

All data displayed on the demo user's page are random, thus some values may not seem realistic. 
