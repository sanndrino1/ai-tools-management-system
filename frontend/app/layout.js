'use client';

import './globals.css'
import { AuthProvider } from '../contexts/AuthContext'
import { ToastProvider } from '../contexts/ToastContext'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>AI Tools Management System</title>
        <meta name="description" content="Professional AI tools management platform" />
      </head>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <AuthProvider>
          <ToastProvider>
            <div className="min-h-screen">
              {children}
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}