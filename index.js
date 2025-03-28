const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()
const PORT = 3000

app.set('view engine', 'ejs')

//setting up json parser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

// set up static folder usage for ejs
app.use(express.static(path.join(__dirname, 'public')))

// routes
app.get('/', (req, res) => {
    files = fs.readdir('files', (err, files) => {
        console.log(files)
        res.render('index', {tasks: files})
    })
})

app.get('/files/:filename', (req, res) => {
    fs.readFile(`files/${req.params.filename}`, 'utf-8', (err, filedata) => {
        console.log(filedata)
        let task = req.params.filename
        task = task.substring(0, task.length-4)
        const description = filedata

        res.render('task', {task: task, description: description})
    })
})

app.post('/create', (req, res) => {
    const title = req.body.title
    const description = req.body.description;

    fs.writeFile(`files/${title}.txt`, `${description}`, (err) => {
        console.log(`Task created: ${title}\n description: `)
        console.log(req.body)

        res.redirect('/')
    })
})

// starting server
app.listen(PORT, () => {
    console.log(`App alive at: http://localhost:${PORT}`)
})