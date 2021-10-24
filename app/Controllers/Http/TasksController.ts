import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

import Task from 'App/Models/Task'

export default class TasksController {
  public async index({ view, auth }: HttpContextContract) {
    const user = auth.user
    await user?.load('tasks')
    return view.render('tasks/index', { tasks: user?.tasks })
  }

  public async store({ request, response, session, auth }: HttpContextContract) {
    const validationSchema = schema.create({
      title: schema.string({ trim: true }, [rules.maxLength(255), rules.minLength(5)]),
    })

    const validatedData = await request.validate({
      schema: validationSchema,
      messages: {
        'title.required': 'Title field is required',
        'title.maxLength': 'Title field have a maximum size of 255 characters',
        'title.minLength': 'Title field have a minimum size of 5 characters',
      },
    })

    await auth.user?.related('tasks').create({
      title: validatedData.title,
    })

    session.flash('notification', 'Task added!')

    return response.redirect('back')
  }

  public async update({ request, response, session, params }: HttpContextContract) {
    const task = await Task.findOrFail(params.id)

    task.isCompleted = !!request.input('completed')
    await task.save()

    session.flash('notification', 'Task updated!')

    return response.redirect('back')
  }

  public async destroy({ response, session, params }: HttpContextContract) {
    const task = await Task.findOrFail(params.id)
    await task.delete()

    session.flash('notification', 'Task deleted!')

    response.redirect('back')
  }
}
