var express = require('express');
var router = express.Router();
const isAuth = require('../middleware/middleware');
const { Sequelize } = require('sequelize'); 
const { Todo, Status, Category } = require('../models');

// Return all the todos with the deleted status
router.get('/deleted', isAuth, async (req, res) => {
    // #swagger.tags = ['Todos']
    /* #swagger.path = '/todos/deleted'  
    */
    // #swagger.description = 'Retrieve all todos that are marked as deleted'
    // #swagger.responses[200] = { description: "List of deleted todos", schema: { $ref: "#/definitions/DeletedTodo" } }
    // #swagger.responses[500] = { description: "Internal server error" }
        try {
            const UserId = req.user.UserId;
            console.log("UserID:", UserId);
            const todos = await Todo.findAll({
                where: { 
                    UserId: UserId,
                    StatusId: 4 
                },
                include: [Category, Status]
            });
            console.log("Todos found:", todos.length);
            res.json({ status: "success", data: { statusCode: 200, result: todos } });
        } catch (error) {
            res.status(500).json({ status: "error", result: error.message });
        }
    });

// Return all the users todos including todos with a deleted status
router.get('/all', isAuth, async (req, res) => {
    // #swagger.tags = ['Todos']
    /* #swagger.path = '/todos/all'  
    */
    // #swagger.description = 'Retrieve all todos including those with deleted status'
    // #swagger.responses[200] = { description: "List of all todos", schema: { $ref: "#/definitions/TodoList" } }
    // #swagger.responses[500] = { description: "Internal server error" }
        try {
            const UserId = req.user.UserId;
            const todos = await Todo.findAll({
                where: { UserId: UserId },
                include: [Category, Status]
            });
            res.json({ status: "success", data: { statusCode: 200, result: todos } });
        } catch (error) {
            res.status(500).json({ status: "error", result: error.message });
        }
    });

/* Return all the logged in users todo's with the category associated with each todo and
status that is not the deleted status */
router.get('/', isAuth, async (req, res) => {
// #swagger.tags = ['Todos']
/* #swagger.path = '/todos'  
*/
// #swagger.description = 'Retrieve all todos except those with deleted status'
// #swagger.responses[200] = { description: "List of todos", schema: { $ref: "#/definitions/TodoList" } }
// #swagger.responses[500] = { description: "Internal server error" }
    try {
        const UserId = req.user.UserId; 
        const todos = await Todo.findAll({
            where: { 
                UserId: UserId,
                StatusId: { [Sequelize.Op.not]: 4 } 
            },
            include: [Category, Status]
        });
        res.json({ status: "success", data: { statusCode: 200, result: todos } });
    } catch (error) {
        res.status(500).json({ status: "error", result: error.message });
    }
});

// GET a specific todo by ID
router.get('/:id', isAuth, async (req, res) => {
// #swagger.tags = ['Todos']
/* #swagger.path = '/todos/{id}'  
*/
// #swagger.description = 'Retrieve a specific todo by ID'
// #swagger.parameters['id'] = { description: "Todo ID" }
// #swagger.responses[200] = { description: "Todo found", schema: { $ref: "#/definitions/Todo" } }
// #swagger.responses[404] = { description: "Todo not found" }
// #swagger.responses[500] = { description: "Internal server error" }
    try {
        const { id } = req.params;
        const UserId = req.user.UserId; 

        const todo = await Todo.findOne({
            where: { id, UserId }, 
            include: [Category, Status] 
        });

        if (todo) {
            res.json({ status: "success", data: { statusCode: 200, result: todo } });
        } else {
            res.status(404).json({ status: "fail", data: { statusCode: 404, message: 'Todo not found.' } });
        }
    } catch (error) {
        console.error(error); // For debugging
        res.status(500).json({ status: "error", result: error.message });
    }
});

// Add a new todo with their category for the logged in user
router.post('/', isAuth, async (req, res) => {
// #swagger.tags = ['Todos']
/* #swagger.path = '/todos'  
*/
// #swagger.description = 'Create a new todo'
/* #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Todo data',
        required: true,
        type: 'object',
        schema: { $ref: "#/definitions/NewTodo" }
} */
// #swagger.responses[200] = { description: "Todo created", schema: { $ref: "#/definitions/NewTodo" } }
// #swagger.responses[500] = { description: "Error creating todo" }
    try {
        const { name, description, CategoryId, StatusId } = req.body;
        const UserId = req.user.UserId;
        console.log('Creating new Todo with UserId:', UserId);
        const newTodo = await Todo.create({
            name,
            description,
            CategoryId,
            StatusId,
            UserId
        });

        return res.json({ status: "success", data: { statusCode: 200, result: newTodo } });
    } catch (error) {
        console.error(error); 
        return res.status(500).json({ status: "fail", data: { statusCode: 500, result: error.message } });
    }
});

// Change/update a specific todo for logged in user
router.put('/:id', isAuth, async (req, res) => {
// #swagger.tags = ['Todos']
/* #swagger.path = '/todos/{id}'  
*/
// #swagger.description = 'Update a specific todo'
// #swagger.parameters['id'] = { description: 'Todo ID' }
/* #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Updated todo data',
        required: true,
        type: 'object',
        schema: { $ref: "#/definitions/UpdateTodo" }
} */
// #swagger.responses[200] = { description: "Todo updated", schema: { $ref: "#/definitions/UpdatedTodo" } }
// #swagger.responses[400] = { description: "Invalid data or not found" }
// #swagger.responses[500] = { description: "Error updating todo" }
    try {
        const { name, description, CategoryId, StatusId } = req.body;
        const todoId = req.params.id;
        const UserId = req.user.UserId;
        const updatedTodo = await Todo.update(
            { name, description, CategoryId, StatusId },
            { where: { id: todoId, UserId: UserId } }
        );
        res.json({ status: "success", data: { statusCode: 200, result: "Todo updated successfully." } });
    } catch (error) {
        res.status(400).json({ status: "fail", data: { statusCode: 400, result: error.message } });
    }
});

// Delete a specific todo for the logged in user
router.delete('/:id', isAuth, async (req, res) => {
// #swagger.tags = ['Todos']
/* #swagger.path = '/todos/{id}'  
*/
// #swagger.description = 'Delete a specific todo by marking its status as deleted'
// #swagger.parameters['id'] = { description: 'Todo ID' }
// #swagger.responses[200] = { description: "Todo deleted", schema: { $ref: "#/definitions/DeletedTodo" } }
// #swagger.responses[400] = { description: "Todo cannot be deleted or not found" }
// #swagger.responses[500] = { description: "Error deleting todo" }
    try {
        const todoId = req.params.id;
        const UserId = req.user.UserId;
        const deletedStatus = await Status.findOne({ where: { status: 'Deleted' } }); 
        await Todo.update({ StatusId: deletedStatus.id }, { where: { id: todoId, UserId: UserId } });
        res.json({ status: "success", data: { statusCode: 200, result: "Todo deleted successfully." } });
    } catch (error) {
        res.status(400).json({ status: "fail", data: { statusCode: 400, result: error.message } });
    }
});

module.exports = router;

