var express = require('express');
var router = express.Router();
var { Status, Todo } = require('../models');
var isAuth = require('../middleware/middleware');
var jsend = require('jsend');

router.use(jsend.middleware);

// GET all statuses
router.get('/', isAuth, async (req, res) => {
// #swagger.tags = ['Statuses']
/* #swagger.path = '/statuses'  
*/
// #swagger.description = 'Retrieve all statuses'
// #swagger.responses[200] = { description: "List of all statuses", schema: { $ref: "#/definitions/Status" } }
// #swagger.responses[500] = { description: "Internal server error" }
    try {
        const statuses = await Status.findAll();
        res.jsend.success({ statusCode: 200, result: statuses });
    } catch (error) {
        res.status(500).jsend.error({ message: error.message });
    }
});

// GET a specific status by ID
router.get('/:id', isAuth, async (req, res) => {
// #swagger.tags = ['Statuses']
/* #swagger.path = '/statuses/{id}'  
*/
// #swagger.description = 'Retrieve a specific status by ID'
// #swagger.responses[200] = { description: "Status found", schema: { $ref: "#/definitions/Status" } }
// #swagger.responses[404] = { description: "Status not found" }
// #swagger.responses[500] = { description: "Internal server error" }
    try {
        const statusId = req.params.id;

        const status = await Status.findOne({
            where: { id: statusId }
        });

        if (status) {
            res.jsend.success({ statusCode: 200, result: status });
        } else {
            res.jsend.fail({ statusCode: 404, message: 'Status not found.' });
        }
    } catch (error) {
        res.status(500).jsend.error({ message: error.message });
    }
});

// POST a new status
router.post('/', isAuth, async (req, res) => {
// #swagger.tags = ['Statuses']
/* #swagger.path = '/statuses'  
*/
// #swagger.description = 'Create a new status'
// #swagger.responses[201] = { description: "Status created successfully", schema: { $ref: "#/definitions/Status" } }
// #swagger.responses[400] = { description: "Bad request" }
    try {
        const { status } = req.body;
        const newStatus = await Status.create({
            status
        });
        res.jsend.success({ statusCode: 201, result: newStatus });
    } catch (error) {
        res.status(400).jsend.fail({ statusCode: 400, message: error.message });
    }
});

// PUT to update a status by ID
router.put('/:id', isAuth, async (req, res) => {
// #swagger.tags = ['Statuses']
/* #swagger.path = '/statuses/{id}'  
*/
// #swagger.description = 'Update an existing status by ID'
// #swagger.responses[200] = { description: "Status updated successfully" }
// #swagger.responses[404] = { description: "Status not found" }
// #swagger.responses[500] = { description: "Error updating status" }
    try {
        const statusId = req.params.id;
        const { status } = req.body;

        const updated = await Status.update({ status }, {
            where: { id: statusId }
        });

        if (updated[0] > 0) {
            res.jsend.success({ statusCode: 200, message: 'Status updated successfully.' });
        } else {
            res.jsend.fail({ statusCode: 404, message: 'Status not found.' });
        }
    } catch (error) {
        res.status(500).jsend.error({ message: error.message });
    }
});

// DELETE a status by ID
router.delete('/:id', isAuth, async (req, res) => {
// #swagger.tags = ['Statuses']
/* #swagger.path = '/statuses/{id}'  
*/
// #swagger.description = 'Delete a status by ID'
// #swagger.responses[200] = { description: "Status deleted successfully" }
// #swagger.responses[404] = { description: "Status not found" }
// #swagger.responses[500] = { description: "Error deleting status" }
try {
    const statusId = req.params.id;

    // Check if the status is assigned to any Todo items
    const todosWithStatus = await Todo.findAll({
        where: { StatusId: statusId }
    });

    if (todosWithStatus.length > 0) {
        // Status is assigned to a Todo and cannot be deleted
        return res.jsend.fail({ statusCode: 400, message: 'Status cannot be deleted because it is assigned to one or more Todos.' });
    }

    // Proceed with deletion if no Todo items are using the status
    const deletionInfo = await Status.destroy({
        where: { id: statusId }
    });

    if (deletionInfo > 0) {
        res.jsend.success({ statusCode: 200, message: 'Status deleted successfully.' });
    } else {
        res.jsend.fail({ statusCode: 404, message: 'Status not found.' });
    }
} catch (error) {
    res.status(500).jsend.error({ message: error.message });
}
});

module.exports = router;
