import React, { useState } from 'react'

type RegisterProps = {
  onRegister: (nameUser: string, email: string, password: string) => void;
  switchToLogin: () => void;
  error: string | null;
};

export default function Register({ onRegister, switchToLogin }: RegisterProps) {
  const [nameUser, setNameUser] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(nameUser, email, password);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="bg-gray-900 text-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl mb-4">Registrarse</h2>
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="nameUser">
            Nombre
          </label>
          <input
            className="shadow appearance-none border rounded w-full bg-gray-800 border-gray-700 py-2 px-3  text-white leading-tight focus:outline-none focus:shadow-outline"
            id="nameUser"
            type="text"
            placeholder="Nombre"
            value={nameUser}
            onChange={(e) => setNameUser(e.target.value)}
          />
        </div>
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
            Registrarse
          </button>
          <button
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            onClick={switchToLogin}
            type="button"
          >
            Iniciar sesión
          </button>
        </div>
      </form>
    </div>
  )
}