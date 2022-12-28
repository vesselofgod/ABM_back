const path = require('path') // to serve public dir, path는 core node module이라 install not required
const express = require('express')
const app = express()

const PORT = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

app.listen(PORT, () => {
    console.log(`server on port ${PORT}!`)
})
