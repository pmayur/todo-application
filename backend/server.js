const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 4000;

let Todo = require('./todo.model');

app.use(cors());
app.use(bodyParser.json());

//mount the router on top
app.use('/todos', todoRoutes);

//Database connection
mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true });
    const connection = mongoose.connection;
    connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

/* GET REQUEST, also router.get() can be used
Displays all the todos */

todoRoutes.route('/').get(function(req, res) {

    // mongo find query
    Todo.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

// get todo objects by userid

todoRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;

    // mongo find by id query
    Todo.findById(id, function(err, todo) {
        res.json(todo);
    });
});

// update the todo list

todoRoutes.route('/update/:id').post(function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send("data is not found");
        else
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;
            todo.save().then(todo => {
                res.json('Todo updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

// add the todo to the database

todoRoutes.route('/add').post(function(req, res) {
    // every add creates a new todo instance and passess the body to it
    let todo = new Todo(req.body);

    // mongo save query .then logs to console, .then = promise based .catch catches errors
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});


app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});