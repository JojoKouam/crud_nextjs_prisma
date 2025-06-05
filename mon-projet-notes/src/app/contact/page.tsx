import React from 'react'

export default function page() {
  return (
    <div className="flex justify-center items-center h-screen">

        <h1 className="text-2xl font-bold">Page de Contact</h1>
        <p className="mt-4 text-gray-600">Pour toute question, veuillez nous contacter à l&#39;adresse email suivante</p>
        <form className="mt-6">
            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message:</label>
                <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                ></textarea>
            </div>
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Envoyer
            </button>
        </form>

    </div>
  )
}
