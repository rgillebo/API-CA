const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Todo List API',
    description: 'This API handles operations related to managing todo lists including categories and statuses.',
  },
  host: 'localhost:3000',
  schemes: ['http'],
  tags: [
    {
      "name": "Users",
      "description": "Endpoints related to user functionalities"
    },
    {
      "name": "Todos",
      "description": "Endpoints related to todo functionalities"
    },
    {
      "name": "Categories",
      "description": "Endpoints related to category functionalities"
    },
    {
      "name": "Statuses",
      "description": "Endpoints related to status functionalities"
    }
  ],
  definitions: {
    NewUser: {
        email: 'validuser@example.com',
        password: 'validpassword'
      },
    UserLogin: {
        email: 'validuser@example.com',
        password: 'validpassword'
      },
    User: {
      id: '1',
      email: 'validuser@example.com',
    },
    Todo: {
      id: '1',
      name: 'Sample Todo',
      description: 'Description of a todo item',
      CategoryId: '1',
      StatusId: '1',
      UserId: '1'
    },
    TodoList: {
        id: '1',
        name: 'Sample Todo',
        description: 'Description of a todo item',
        CategoryId: '1',
        StatusId: '1',
        UserId: '1'
      },
    NewTodo: {
        id: '2',
        name: 'New Sample Todo',
        description: 'Description of a new todo item',
        CategoryId: '2',
        StatusId: '2',
        UserId: '1'
      },
      UpdateTodo: {
        name: 'Updated Sample Todo',
        description: 'Description of a updated todo item',
        StatusId: '4',
      },
      UpdatedTodo: {
        id: '1',
        name: 'Updated Sample Todo',
        description: 'Description of a updated todo item',
        CategoryId: '2',
        StatusId: '3',
        UserId: '1'
      },
      DeletedTodo: {
        id: '1',
        name: 'Deleted Sample Todo',
        description: 'Description of a deleted todo item',
        CategoryId: '3',
        StatusId: '4',
        UserId: '1'
      },
    Category: {
      id: '1',
      name: 'Work',
      UserId: '1'
    },
    NewCategory: {
        id: '2',
        name: 'New Category',
        UserId: '1'
      },
      UpdatedCategory: {
        id: '2',
        name: 'New Category',
        UserId: '1'
      },
    Status: {
      id: '1',
      status: 'Not Started'
    }
  }
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./routes/users.js', './routes/todos.js', './routes/categories.js', './routes/statuses.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
