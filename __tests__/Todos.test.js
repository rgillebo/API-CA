const request = require('supertest');
const app = require('../app');

describe('Todos API', () => {
  let token, todoId;

  beforeAll(async () => {
    // Attempt to log in and get a token
    const loginResponse = await request(app)
      .post('/users/login')
      .send({
        email: 'validuser@example.com', // Ensure this matches a user in the test database
        password: 'validpassword' // Ensure this matches the password for the user
      });
      
    if (loginResponse.statusCode !== 200) {
      throw new Error('Login failed, status code: ' + loginResponse.statusCode);
    }

    token = loginResponse.body.data.token; 
  });

  it('should get all the user\'s Todos', async () => {
    const response = await request(app)
      .get('/todos')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('data');
  });

it('should add a new Todo item', async () => {
    const newTodoResponse = await request(app)
      .post('/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Todo', 
        description: 'Test Description',
        CategoryId: 1, // Ensure a category is present in the database or this will fail
        StatusId: 1 // Ensure a status is present in the database or this will fail
      });
  
    expect(newTodoResponse.statusCode).toBe(200);
    todoId = newTodoResponse.body.data.result.id;
    expect(todoId).toBeDefined(); // Ensures todoId is not undefined
  });
  
  it('should delete the created Todo item', async () => {
    // This check is to ensure we only proceed if a `todoId` has been set.
    if (!todoId) {
      console.log('Skipping delete test because todoId is undefined.');
      return;
    }
  
    const deleteResponse = await request(app)
      .delete(`/todos/${todoId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(deleteResponse.statusCode).toBe(200); 
  });
  
  it('should not get Todos without JWT token', async () => {
    const response = await request(app).get('/todos');
    expect(response.statusCode).toBe(401);
  });

  it('should not get Todos with an invalid JWT token', async () => {
    const response = await request(app)
      .get('/todos')
      .set('Authorization', 'Bearer invalidtoken123');
    
    expect(response.statusCode).toBe(401);
  });
});
