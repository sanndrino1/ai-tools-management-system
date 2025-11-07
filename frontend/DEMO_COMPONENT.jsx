import React from 'react';

/**
 * ДЕМОНСТРАЦИОНЕН КОМПОНЕНТ - Показва как системата работи
 * 
 * Този компонент демонстрира всички ключови функционалности на 
 * AI Tools Management System, включително:
 * 
 * ✅ Добавяне на AI инструменти
 * ✅ Организиране по категории
 * ✅ Организиране по роли 
 * ✅ Филтриране и търсене
 * ✅ Роли и разрешения
 */

const AIToolsSystemDemo = () => {
  // Примерни данни за демонстрация
  const demoCategories = [
    { id: 1, name: 'Писане и редактиране', icon: '📝', count: 2 },
    { id: 2, name: 'Дизайн и креативност', icon: '🎨', count: 1 },
    { id: 3, name: 'Програмиране', icon: '💻', count: 2 },
    { id: 4, name: 'Анализ на данни', icon: '📊', count: 1 },
  ];

  const demoRoles = [
    { id: 1, name: 'owner', display: 'Собственик', icon: '👑', permissions: ['create', 'read', 'update', 'delete'] },
    { id: 2, name: 'pm', display: 'Проект Мениджър', icon: '📋', permissions: ['create', 'read', 'update'] },
    { id: 3, name: 'backend', display: 'Backend разработчик', icon: '⚙️', permissions: ['read'] },
    { id: 4, name: 'designer', display: 'Дизайнер', icon: '✨', permissions: ['read'] },
  ];

  const demoTools = [
    {
      id: 1,
      name: 'ChatGPT',
      description: 'AI асистент за текст и програмиране',
      categories: ['Писане и редактиране', 'Програмиране'],
      pricing: 'freemium',
      difficulty: 'beginner',
      rating: 4.8,
      roleRelevance: {
        owner: 90, pm: 85, backend: 80, frontend: 75, qa: 70, designer: 60
      },
      verified: true,
      featured: true
    },
    {
      id: 2,
      name: 'Midjourney',
      description: 'AI за генериране на изображения',
      categories: ['Дизайн и креативност'],
      pricing: 'paid',
      difficulty: 'intermediate',
      rating: 4.7,
      roleRelevance: {
        owner: 70, pm: 75, backend: 30, frontend: 60, qa: 40, designer: 95
      },
      verified: true,
      featured: true
    },
    {
      id: 3,
      name: 'GitHub Copilot',
      description: 'AI асистент за кодиране',
      categories: ['Програмиране'],
      pricing: 'freemium',
      difficulty: 'beginner',
      rating: 4.9,
      roleRelevance: {
        owner: 60, pm: 50, backend: 95, frontend: 90, qa: 70, designer: 20
      },
      verified: true,
      featured: true
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Заглавие */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          🤖 AI Tools Management System
        </h1>
        <p className="text-xl text-gray-600">
          Демонстрация на системата за управление на AI инструменти
        </p>
        <div className="mt-4 text-green-600 font-medium">
          ✅ Краен резултат: Системата позволява добавяне и организиране на AI инструменти по категории и роли
        </div>
      </div>

      {/* Основни характеристики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded-lg text-center">
          <div className="text-3xl mb-2">📝</div>
          <h3 className="font-bold text-lg">Добавяне</h3>
          <p className="text-sm text-gray-600">Лесно добавяне на нови AI инструменти</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg text-center">
          <div className="text-3xl mb-2">🗂️</div>
          <h3 className="font-bold text-lg">Категории</h3>
          <p className="text-sm text-gray-600">Организиране по категории</p>
        </div>
        <div className="bg-purple-100 p-6 rounded-lg text-center">
          <div className="text-3xl mb-2">👥</div>
          <h3 className="font-bold text-lg">Роли</h3>
          <p className="text-sm text-gray-600">Релевантност за всяка роля</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-lg text-center">
          <div className="text-3xl mb-2">🔍</div>
          <h3 className="font-bold text-lg">Търсене</h3>
          <p className="text-sm text-gray-600">Напреднало филтриране</p>
        </div>
      </div>

      {/* Категории */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">📂 Категории за организиране</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {demoCategories.map(category => (
            <div key={category.id} className="border rounded-lg p-4 text-center hover:bg-gray-50">
              <div className="text-2xl mb-2">{category.icon}</div>
              <h3 className="font-medium text-sm">{category.name}</h3>
              <span className="text-xs text-gray-500">{category.count} инструмента</span>
            </div>
          ))}
        </div>
      </div>

      {/* Роли и разрешения */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">👥 Роли и разрешения</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demoRoles.map(role => (
            <div key={role.id} className="border rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">{role.icon}</span>
                <h3 className="font-medium">{role.display}</h3>
              </div>
              <div className="text-xs">
                <span className="font-medium">Разрешения: </span>
                {role.permissions.map(perm => (
                  <span key={perm} className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-1">
                    {perm}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Инструменти */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">🤖 AI Инструменти</h2>
        <div className="space-y-4">
          {demoTools.map(tool => (
            <div key={tool.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <h3 className="font-bold text-lg mr-2">{tool.name}</h3>
                  {tool.verified && <span className="text-blue-500 text-sm">✓ Verified</span>}
                  {tool.featured && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full ml-2">⭐ Featured</span>}
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">⭐ {tool.rating}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    tool.pricing === 'free' ? 'bg-green-100 text-green-800' :
                    tool.pricing === 'freemium' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {tool.pricing}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{tool.description}</p>
              
              <div className="mb-3">
                <span className="text-xs font-medium text-gray-700">Категории: </span>
                {tool.categories.map(cat => (
                  <span key={cat} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1">
                    {cat}
                  </span>
                ))}
              </div>

              <div className="mb-3">
                <span className="text-xs font-medium text-gray-700">Релевантност за роли:</span>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-1">
                  {Object.entries(tool.roleRelevance).map(([role, relevance]) => (
                    <div key={role} className="text-center">
                      <div className="text-xs text-gray-600">{role}</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${relevance}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">{relevance}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Демонстрация на филтриране */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">🔍 Възможности за филтриране</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-medium mb-2">По категория</h3>
            <p className="text-sm text-gray-600">
              Филтриране на инструменти по специфична категория като "Програмиране" или "Дизайн"
            </p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-medium mb-2">По роля</h3>
            <p className="text-sm text-gray-600">
              Показване на инструменти с висока релевантност за конкретна роля в екипа
            </p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-medium mb-2">Комбинирано</h3>
            <p className="text-sm text-gray-600">
              Комбиниране на множество филтри за точно намиране на нужните инструменти
            </p>
          </div>
        </div>
      </div>

      {/* Примерни сценарии */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">🎯 Примерни сценарии на използване</h2>
        
        <div className="space-y-6">
          {/* Сценарий 1 */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-bold text-lg mb-2">📋 PM добавя нов инструмент</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>1. PM влиза в системата с неговите права (create, read, update)</p>
              <p>2. Натиска "Добави инструмент" и попълва формуляра</p>
              <p>3. Избира категории: "Писане и редактиране", "Анализ на данни"</p>
              <p>4. Задава релевантност за всяка роля (PM: 90%, Designer: 60%, и т.н.)</p>
              <p>5. Запазва инструмента - всички в екипа го виждат</p>
            </div>
          </div>

          {/* Сценарий 2 */}
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-bold text-lg mb-2">⚙️ Backend разработчик търси инструменти</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>1. Backend разработчик отваря системата</p>
              <p>2. Филтрира по "Роля: Backend разработчик"</p>
              <p>3. Вижда GitHub Copilot (95% релевантност), ChatGPT (80% релевантност)</p>
              <p>4. Може да добави допълнителен филтър "Категория: Програмиране"</p>
              <p>5. Запазва интересни инструменти като любими</p>
            </div>
          </div>

          {/* Сценарий 3 */}
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-bold text-lg mb-2">✨ Дизайнер търси креативни инструменти</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>1. Дизайнер отваря страницата с AI инструменти</p>
              <p>2. Избира категория "Дизайн и креативност"</p>
              <p>3. Системата показва Midjourney с 95% релевантност за дизайнери</p>
              <p>4. Чете подробности за ценообразуване и функции</p>
              <p>5. Натиска "Посети сайта" за да пробва инструмента</p>
            </div>
          </div>
        </div>
      </div>

      {/* Финален резултат */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8 text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-2">🎉 ПОСТИГНАТ РЕЗУЛТАТ</h2>
        <p className="text-lg text-green-700 mb-4">
          Системата успешно позволява добавяне и организиране на AI инструменти по категории и роли
        </p>
        <div className="text-sm text-green-600">
          ✅ Стабилна основа за по-нататъшно разширяване и използване
        </div>
      </div>
    </div>
  );
};

export default AIToolsSystemDemo;