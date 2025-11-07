import { Inter } from 'next/font/google'
import './globals.css'
import '../styles/ai-design-system.css'
import { AuthProvider } from '../contexts/AuthContext'
import { ToastProvider } from '../contexts/ToastContext'
import ToastContainerWrapper from '../components/ToastContainerWrapper'
import { ErrorBoundary } from '../components/Error'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI Tools Management System',
  description: 'Professional AI tools management platform with role-based access and modern UI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        <ErrorBoundary>
          <AuthProvider>
            <ToastProvider>
              <div className="min-h-screen flex flex-col">
                {/* Main Content - Navigation is now handled by individual pages */}
                <main className="flex-1">
                  {children}
                </main>
                
                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                      {/* Brand and Copyright */}
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
                          <span className="text-white font-bold text-xs">AI</span>
                        </div>
                        <span className="text-sm text-gray-600">AI Tools Management System</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-500">© 2025</span>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <a 
                          href="/docs" 
                          className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          📚 Documentation
                        </a>
                        <a 
                          href="/api/docs" 
                          className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          🔗 API
                        </a>
                        <a 
                          href="https://github.com" 
                          className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          🔗 GitHub
                        </a>
                      </div>
                    </div>
                    
                    {/* Tech Stack Info */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="text-xs text-gray-500 text-center space-x-4">
                        <span>🚀 Next.js 14</span>
                        <span>•</span>
                        <span>⚙️ Laravel 11</span>
                        <span>•</span>
                        <span>🐳 Docker Ready</span>
                        <span>•</span>
                        <span>🎨 Tailwind CSS</span>
                        <span>•</span>
                        <span>🤖 AI-Enhanced</span>
                      </div>
                    </div>
                  </div>
                </footer>
              </div>
              
              {/* Toast Container - positioned outside main layout for proper z-index */}
              <ToastContainerWrapper />
            </ToastProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}