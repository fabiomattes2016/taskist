import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class AuthController {
  public formRegister({ view }: HttpContextContract) {
    return view.render('auth/register')
  }

  public async register({ request, auth, response }: HttpContextContract) {
    const validationSchema = schema.create({
      name: schema.string({ trim: true }),
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.maxLength(255),
        rules.unique({ table: 'users', column: 'email' }),
      ]),
      password: schema.string({ trim: true }, [rules.confirmed(), rules.minLength(8)]),
    })

    const validatedData = await request.validate({
      schema: validationSchema,
      messages: {
        'required': 'O campo {{ field }} é obrigatório',
        'email.maxLength': 'O email deve ter menos de 255 caracteres',
        'email.email': 'Informe um e-mail válido',
        'email.unique': 'Este e-mail já está em uso',
        'password_confirmation.confirmed': 'As senhas informadas não são compatíveis',
        'password.minLength': 'A senha deve ter no mínimo 8 caracteres',
      },
    })

    const user = await User.create(validatedData)

    await auth.login(user)

    return response.redirect('/')
  }

  public formLogin({ view }: HttpContextContract) {
    return view.render('auth/login')
  }

  public async login({ request, auth, session, response }: HttpContextContract) {
    const { email, password } = request.all()

    try {
      await auth.attempt(email, password)
      return response.redirect('/')
    } catch (error) {
      session.flash('notification', 'Usuário e/ou senha inválidos')
      return response.redirect('back')
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout()

    return response.redirect('/')
  }
}
