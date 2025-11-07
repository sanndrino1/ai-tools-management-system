'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';

export default function HomePage() {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    
    // Initialize auth only after component mounts
    useEffect(() => {
        setMounted(true);
    }, []);
    
    // Only use auth after mounting to prevent SSR issues
    const authHook = mounted ? useAuth() : { isAuthenticated: false, isLoading: true, user: null };
    const { isAuthenticated, isLoading, user } = authHook;

    useEffect(() => {
        if (mounted && !isLoading) {
            if (isAuthenticated) {
                router.push('/dashboard');
            }
        }
    }, [mounted, isLoading, isAuthenticated, router]);

    // Show loading while determining auth state
    if (!mounted || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Зареждане...</p>
                </div>
            </div>
        );
    }

    // Show welcome page for non-authenticated users
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="mb-8">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                            <svg 
                                className="w-12 h-12 text-white" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                                />
                            </svg>
                        </div>
                        
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                ЕкипенХъб
                            </span>
                        </h1>
                        
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Система за управление на екип с роли, разрешения и персонализиран българки интерфейс
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/auth/login"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            🚀 Влез в системата
                        </Link>
                        
                        <Link
                            href="/about"
                            className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
                        >
                            📖 Научи повече
                        </Link>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {/* Feature 1 */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-200">
                        <div className="bg-red-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                            <span className="text-3xl">👑</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">6 Роли в Екипа</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Owner, Project Manager, Backend, Frontend, QA и Designer - всяка с уникални разрешения и интерфейс
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-200">
                        <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                            <span className="text-3xl">🇧🇬</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Български Интерфейс</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Пълна българска локализация с персонализирани поздрави и роле-специфични съобщения
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-200">
                        <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                            <span className="text-3xl">🐳</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Docker Среда</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Laravel backend, Next.js frontend, MySQL база и Redis cache в Docker контейнери
                        </p>
                    </div>
                </div>

                {/* Team Roles Preview */}
                <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Екипни Роли</h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[
                            { role: 'owner', name: 'Собственик', emoji: '👑', color: 'from-red-500 to-red-600' },
                            { role: 'pm', name: 'Проект Мениджър', emoji: '📋', color: 'from-blue-500 to-blue-600' },
                            { role: 'backend', name: 'Backend', emoji: '⚙️', color: 'from-green-500 to-green-600' },
                            { role: 'frontend', name: 'Frontend', emoji: '🎨', color: 'from-purple-500 to-purple-600' },
                            { role: 'qa', name: 'QA', emoji: '🐛', color: 'from-yellow-500 to-yellow-600' },
                            { role: 'designer', name: 'Дизайнер', emoji: '✨', color: 'from-pink-500 to-pink-600' },
                        ].map((role) => (
                            <div key={role.role} className="text-center">
                                <div className={`bg-gradient-to-r ${role.color} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-3`}>
                                    <span className="text-2xl">{role.emoji}</span>
                                </div>
                                <div className="text-sm font-medium text-gray-900">{role.name}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tech Stack */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Технологии</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {[
                            { name: 'Next.js 14', icon: '⚛️' },
                            { name: 'Laravel 10', icon: '🐘' },
                            { name: 'MySQL 8', icon: '🗄️' },
                            { name: 'Redis', icon: '🔴' },
                            { name: 'Docker', icon: '🐳' },
                            { name: 'Tailwind CSS', icon: '🎨' },
                        ].map((tech) => (
                            <div key={tech.name} className="bg-white rounded-lg px-4 py-2 shadow-md flex items-center space-x-2">
                                <span className="text-lg">{tech.icon}</span>
                                <span className="text-sm font-medium text-gray-700">{tech.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}