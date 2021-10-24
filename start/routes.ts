import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'TasksController.index')
  Route.post('/tasks', 'TasksController.store').as('tasks')
  Route.patch('/tasks/:id', 'TasksController.update')
  Route.delete('/tasks/:id', 'TasksController.destroy')
}).middleware('auth')

// User registration and authentication
Route.get('/register', 'AuthController.formRegister').middleware('guest')
Route.post('/register', 'AuthController.register')
Route.get('/login', 'AuthController.formLogin').middleware('guest')
Route.post('/login', 'AuthController.login')
Route.get('/logout', 'AuthController.logout').as('logout')
