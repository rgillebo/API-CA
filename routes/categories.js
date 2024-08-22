var express = require('express');
var router = express.Router();
const { Category, Todo } = require('../models');
const isAuth = require('../middleware/middleware');
var jsend = require('jsend');

router.use(jsend.middleware);

// GET all categories for the logged-in user
router.get('/', isAuth, async (req, res) => {
// #swagger.tags = ['Categories']
/* #swagger.path = '/categories'  
*/
// #swagger.description = 'Retrieve all categories for the logged-in user'
// #swagger.responses[200] = { description: "List of all categories", schema: { $ref: "#/definitions/Category" } }
// #swagger.responses[500] = { description: "Internal server error" }
    try {
        const UserId = req.user.UserId;
        const categories = await Category.findAll({
            where: { UserId: UserId }
        });
        res.jsend.success({ statusCode: 200, result: categories });
    } catch (error) {
        res.status(500).jsend.error({ message: error.message });
    }
});

// GET a specific category by ID
router.get('/:id', isAuth, async (req, res) => {
// #swagger.tags = ['Categories']
/* #swagger.path = '/categories/{id}'  
*/
// #swagger.parameters['id'] = { description: "Category ID" }
// #swagger.description = 'Retrieve a specific category by ID'
// #swagger.responses[200] = { description: "Category found", schema: { $ref: "#/definitions/Category" } }
// #swagger.responses[404] = { description: "Category not found" }
// #swagger.responses[500] = { description: "Internal server error" }
    try {
        const categoryId = req.params.id;
        const UserId = req.user.UserId; 

        const category = await Category.findOne({
            where: { 
                id: categoryId,
                UserId: UserId // Ensure that users can only access their own categories
            }
        });

        if (category) {
            res.jsend.success({ statusCode: 200, result: category });
        } else {
            res.jsend.fail({ statusCode: 404, message: 'Category not found.' });
        }
    } catch (error) {
        res.status(500).jsend.error({ message: error.message });
    }
});

// POST a new category
router.post('/', isAuth, async (req, res) => {
// #swagger.tags = ['Categories']
/* #swagger.path = '/categories'  
*/
// #swagger.parameters['name'] = { in: 'body', description: "Category name", required: true, type: 'string' }
// #swagger.description = 'Create a new category'
// #swagger.responses[201] = { description: "Category created successfully", schema: { $ref: "#/definitions/NewCategory" } }
// #swagger.responses[400] = { description: "Bad request" }
    try {
        const { name } = req.body;
        const UserId = req.user.UserId;
        const newCategory = await Category.create({
            name,
            UserId
        });
        res.jsend.success({ statusCode: 201, result: newCategory });
    } catch (error) {
        res.status(400).jsend.fail({ statusCode: 400, message: error.message });
    }
});

// PUT to update a category by ID
router.put('/:id', isAuth, async (req, res) => {
// #swagger.tags = ['Categories']
/* #swagger.path = '/categories/{id}'  
*/
// #swagger.description = 'Update an existing category by ID'
// #swagger.parameters['id'] = { description: "Category ID", required: true, type: 'string' }
// #swagger.parameters['name'] = { in: 'body', description: "New category name", required: true, type: 'string' }
// #swagger.responses[200] = { description: "Category updated successfully" }
// #swagger.responses[404] = { description: "Category not found" }
// #swagger.responses[500] = { description: "Error updating category" }
    try {
        const categoryId = req.params.id;
        const { name } = req.body;
        const UserId = req.user.UserId;

        const updated = await Category.update({ name }, {
            where: {
                id: categoryId,
                UserId: UserId
            }
        });

        if (updated[0] > 0) {
            res.jsend.success({ statusCode: 200, message: 'Category updated successfully.' });
        } else {
            res.jsend.fail({ statusCode: 404, message: 'Category not found.' });
        }
    } catch (error) {
        res.status(500).jsend.error({ message: error.message });
    }
});

// DELETE a category by ID
router.delete('/:id', isAuth, async (req, res) => {
// #swagger.tags = ['Categories']
/* #swagger.path = '/categories/{id}'  
*/
// #swagger.description = 'Delete a category by ID'
// #swagger.parameters['id'] = { description: "Category ID", required: true, type: 'string' }
// #swagger.responses[200] = { description: "Category deleted successfully" }
// #swagger.responses[404] = { description: "Category not found" }
// #swagger.responses[400] = { description: "Cannot delete category because it is assigned to one or more Todos." }
    try {
        const categoryId = req.params.id;
        const UserId = req.user.UserId;

        // Check if the category is assigned to any Todo items
        const todosWithCategory = await Todo.findAll({
            where: {
                categoryId: categoryId,
                UserId: UserId
            }
        });

        if (todosWithCategory.length > 0) {
            // Category is assigned to a Todo and cannot be deleted
            return res.jsend.fail({ statusCode: 400, message: 'Category cannot be deleted because it is assigned to one or more Todos.' });
        }

        // Proceed with deletion if no Todo items are using the category
        const deletionInfo = await Category.destroy({
            where: {
                id: categoryId,
                UserId: UserId
            }
        });

        if (deletionInfo > 0) {
            res.jsend.success({ statusCode: 200, message: 'Category deleted successfully.' });
        } else {
            res.jsend.fail({ statusCode: 404, message: 'Category not found.' });
        }
    } catch (error) {
        res.status(500).jsend.error({ message: error.message });
    }
});

module.exports = router;
