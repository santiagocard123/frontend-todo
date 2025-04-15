import React, { useState } from 'react'

type LoginProps = {
  onLogin: (email: string, password: string) => void;
  switchToRegister: () => void;
  error: string | null;
};

export default function Login({ onLogin, switchToRegister }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="mx-auto max-w-md ">
      <form onSubmit={handleSubmit} className="bg-gray-900 text-white shadow-md rounded px-8 pt-6 pb-8 ">
        <h2 className="text-2xl mb-4">Iniciar sesión</h2>
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full bg-gray-800 border-gray-700 py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
            Contraseña
          </label>
          <input
            className="shadow appearance-none border rounded w-full bg-gray-800 border-gray-700 py-2 px-3 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="******************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Iniciar sesión
          </button>
          <button
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            onClick={switchToRegister}
            type="button"
          >
            Registrarse
          </button>
        </div>
      </form>
    </div>
  )
}