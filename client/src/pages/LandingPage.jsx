import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex flex-col">
      <header className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white">
        <h1 className="text-xl font-bold text-primary-600">InternLab</h1>
        <div className="flex gap-3">
          <Link to="/login" className="btn-outline">Connexion</Link>
          <Link to="/register" className="btn-primary">S'inscrire</Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-8">
        <div className="text-center max-w-2xl">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Trouve ton stage.<br />
            <span className="text-primary-600">Facilement.</span>
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            InternLab connecte les étudiants avec les meilleures startups et entreprises 
            pour des stages enrichissants.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="btn-primary text-base px-6 py-3">
              Je cherche un stage →
            </Link>
            <Link to="/register" className="btn-outline text-base px-6 py-3">
              Je recrute des stagiaires
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}