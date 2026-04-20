import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Minimum 6 caractères'),
  confirmPassword: z.string(),
  role: z.enum(['STUDENT', 'COMPANY'], { required_error: 'Choisissez un rôle' }),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

export default function RegisterPage() {
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'STUDENT' },
  })

  const role = watch('role')

  const onSubmit = async (data) => {
    try {
      setError('')
      const { confirmPassword, ...payload } = data
      const res = await api.post('/auth/register', payload)
      const { user, token, refreshToken } = res.data
      setAuth(user, token, refreshToken)

      if (user.role === 'STUDENT') navigate('/student')
      else navigate('/company')
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary-600 mb-1">InternLab</h1>
          <p className="text-gray-600">Créer votre compte</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { value: 'STUDENT', label: '🎓 Étudiant', sub: 'Je cherche un stage' },
            { value: 'COMPANY', label: '🏢 Entreprise', sub: 'Je recrute' },
          ].map(({ value, label, sub }) => (
            <label
              key={value}
              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                role === value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                {...register('role')}
                type="radio"
                value={value}
                className="sr-only"
              />
              <p className="font-medium text-sm text-gray-900">{label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
            </label>
          ))}
        </div>
        {errors.role && <p className="text-red-500 text-xs mb-4">{errors.role.message}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input {...register('email')} type="email" placeholder="ahmed@example.com" className="input-field" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input {...register('password')} type="password" placeholder="••••••••" className="input-field" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
            <input {...register('confirmPassword')} type="password" placeholder="••••••••" className="input-field" />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-2.5">
            {isSubmitting ? 'Inscription...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-primary-600 font-medium hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}