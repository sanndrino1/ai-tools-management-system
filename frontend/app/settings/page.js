'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    language: 'en',
    autoSave: true
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('ai-tools-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      router.push('/login');
    }

    // Load saved settings
    const savedSettings = localStorage.getItem('ai-tools-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
        console.log('Loaded saved settings:', parsedSettings);
      } catch (error) {
        console.error('Error loading saved settings:', error);
      }
    }
  }, [router]);

  const handleToggle = (setting) => {
    console.log('Toggling:', setting);
    setSettings(prev => {
      const newSettings = {
        ...prev,
        [setting]: !prev[setting]
      };
      console.log('New settings:', newSettings);
      return newSettings;
    });
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    
    // Simulate saving to localStorage
    localStorage.setItem('ai-tools-settings', JSON.stringify(settings));
    
    // Show success message
    alert(`Settings saved successfully!\n\nNotifications: ${settings.notifications ? 'ON' : 'OFF'}\nDark Mode: ${settings.darkMode ? 'ON' : 'OFF'}\nAuto Save: ${settings.autoSave ? 'ON' : 'OFF'}\nLanguage: ${settings.language}`);
  };

  if (!user) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {settings.language === 'bg' ? 'Настройки' : 
                 settings.language === 'de' ? 'Einstellungen' : 
                 settings.language === 'fr' ? 'Paramètres' : 'Settings'}
              </h1>
              <p className="text-sm text-gray-500">
                Language: {settings.language === 'en' ? 'English' : 
                          settings.language === 'bg' ? 'Bulgarian' : 
                          settings.language === 'de' ? 'German' : 'French'}
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
            >
              {settings.language === 'bg' ? 'Назад към Dashboard' : 
               settings.language === 'de' ? 'Zurück zum Dashboard' : 
               settings.language === 'fr' ? 'Retour au tableau de bord' : 'Back to Dashboard'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Profile Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {settings.language === 'bg' ? 'Настройки на профила' : 
               settings.language === 'de' ? 'Profileinstellungen' : 
               settings.language === 'fr' ? 'Paramètres de profil' : 'Profile Settings'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {settings.language === 'bg' ? 'Име' : 
                   settings.language === 'de' ? 'Name' : 
                   settings.language === 'fr' ? 'Nom' : 'Name'}
                </label>
                <input
                  type="text"
                  defaultValue={user.name || 'User'}
                  onChange={(e) => console.log('Name changed to:', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {settings.language === 'bg' ? 'Имейл' : 
                   settings.language === 'de' ? 'E-Mail' : 
                   settings.language === 'fr' ? 'Courriel' : 'Email'}
                </label>
                <input
                  type="email"
                  defaultValue={user.email}
                  onChange={(e) => console.log('Email changed to:', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {settings.language === 'bg' ? 'Роля' : 
                   settings.language === 'de' ? 'Rolle' : 
                   settings.language === 'fr' ? 'Rôle' : 'Role'}
                </label>
                <input
                  type="text"
                  value={user.role || (settings.language === 'bg' ? 'Потребител' : 
                                      settings.language === 'de' ? 'Benutzer' : 
                                      settings.language === 'fr' ? 'Utilisateur' : 'User')}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {settings.language === 'bg' ? 'Ролята може да се променя само от администратори' : 
                   settings.language === 'de' ? 'Die Rolle kann nur von Administratoren geändert werden' : 
                   settings.language === 'fr' ? 'Le rôle ne peut être modifié que par les administrateurs' : 'Role can only be changed by administrators'}
                </p>
              </div>
            </div>
          </div>

          {/* Application Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {settings.language === 'bg' ? 'Настройки на приложението' : 
               settings.language === 'de' ? 'Anwendungseinstellungen' : 
               settings.language === 'fr' ? 'Paramètres de l\'application' : 'Application Settings'}
            </h2>
            <div className="space-y-4">
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {settings.language === 'bg' ? 'Известия' : 
                     settings.language === 'de' ? 'Benachrichtigungen' : 
                     settings.language === 'fr' ? 'Notifications' : 'Notifications'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {settings.language === 'bg' ? 'Получавай имейл известия' : 
                     settings.language === 'de' ? 'E-Mail-Benachrichtigungen erhalten' : 
                     settings.language === 'fr' ? 'Recevoir des notifications par courriel' : 'Receive email notifications'}
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('notifications')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    settings.notifications 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {settings.notifications ? 
                   (settings.language === 'bg' ? 'ВКЛЮЧЕН' : 
                    settings.language === 'de' ? 'EIN' : 
                    settings.language === 'fr' ? 'ACTIVÉ' : 'ON') : 
                   (settings.language === 'bg' ? 'ИЗКЛЮЧЕН' : 
                    settings.language === 'de' ? 'AUS' : 
                    settings.language === 'fr' ? 'DÉSACTIVÉ' : 'OFF')}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {settings.language === 'bg' ? 'Тъмен режим' : 
                     settings.language === 'de' ? 'Dunkler Modus' : 
                     settings.language === 'fr' ? 'Mode sombre' : 'Dark Mode'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {settings.language === 'bg' ? 'Използвай тъмна тема' : 
                     settings.language === 'de' ? 'Dunkles Design verwenden' : 
                     settings.language === 'fr' ? 'Utiliser le thème sombre' : 'Use dark theme'}
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('darkMode')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    settings.darkMode 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {settings.darkMode ? 
                   (settings.language === 'bg' ? 'ВКЛЮЧЕН' : 
                    settings.language === 'de' ? 'EIN' : 
                    settings.language === 'fr' ? 'ACTIVÉ' : 'ON') : 
                   (settings.language === 'bg' ? 'ИЗКЛЮЧЕН' : 
                    settings.language === 'de' ? 'AUS' : 
                    settings.language === 'fr' ? 'DÉSACTIVÉ' : 'OFF')}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {settings.language === 'bg' ? 'Автоматично запазване' : 
                     settings.language === 'de' ? 'Automatisch speichern' : 
                     settings.language === 'fr' ? 'Sauvegarde automatique' : 'Auto Save'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {settings.language === 'bg' ? 'Автоматично запазвай промените' : 
                     settings.language === 'de' ? 'Änderungen automatisch speichern' : 
                     settings.language === 'fr' ? 'Sauvegarder automatiquement les modifications' : 'Automatically save changes'}
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('autoSave')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    settings.autoSave 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {settings.autoSave ? 
                   (settings.language === 'bg' ? 'ВКЛЮЧЕН' : 
                    settings.language === 'de' ? 'EIN' : 
                    settings.language === 'fr' ? 'ACTIVÉ' : 'ON') : 
                   (settings.language === 'bg' ? 'ИЗКЛЮЧЕН' : 
                    settings.language === 'de' ? 'AUS' : 
                    settings.language === 'fr' ? 'DÉSACTIVÉ' : 'OFF')}
                </button>
              </div>

              <div className="p-3 border rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {settings.language === 'bg' ? 'Език' : 
                   settings.language === 'de' ? 'Sprache' : 
                   settings.language === 'fr' ? 'Langue' : 'Language'}
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => {
                    const newLanguage = e.target.value;
                    console.log('Language changed to:', newLanguage);
                    setSettings(prev => {
                      const newSettings = {...prev, language: newLanguage};
                      console.log('Updated settings:', newSettings);
                      return newSettings;
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="bg">Bulgarian (Български)</option>
                  <option value="de">German (Deutsch)</option>
                  <option value="fr">French (Français)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {settings.language === 'bg' ? 'Текущ език:' : 
                   settings.language === 'de' ? 'Aktuelle Sprache:' : 
                   settings.language === 'fr' ? 'Langue actuelle:' : 'Current language:'} <strong>{settings.language === 'en' ? 'English' : settings.language === 'bg' ? 'Bulgarian' : settings.language === 'de' ? 'German' : 'French'}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {settings.language === 'bg' ? 'Сигурност' : 
               settings.language === 'de' ? 'Sicherheit' : 
               settings.language === 'fr' ? 'Sécurité' : 'Security'}
            </h2>
            <div className="space-y-4">
              <button 
                onClick={() => alert(settings.language === 'bg' ? 'Тук ще се отвори форма за смяна на парола. Ще се изисква нова парола.' : 
                                    settings.language === 'de' ? 'Hier würde sich ein Passwort-Änderungs-Formular öffnen. Ein neues Passwort wäre erforderlich.' : 
                                    settings.language === 'fr' ? 'Un formulaire de changement de mot de passe s\'ouvrirait ici. Un nouveau mot de passe serait requis.' : 
                                    'Password change form would open here. New password would be required.')}
                className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900">
                  {settings.language === 'bg' ? 'Смени парола' : 
                   settings.language === 'de' ? 'Passwort ändern' : 
                   settings.language === 'fr' ? 'Changer le mot de passe' : 'Change Password'}
                </div>
                <div className="text-sm text-gray-500">
                  {settings.language === 'bg' ? 'Обнови твоята парола' : 
                   settings.language === 'de' ? 'Aktualisieren Sie Ihr Passwort' : 
                   settings.language === 'fr' ? 'Mettre à jour votre mot de passe' : 'Update your password'}
                </div>
              </button>
              <button 
                onClick={() => alert(settings.language === 'bg' ? 'Тук ще се отвори настройката за 2FA. Ще сканирате QR код с приложение за автентификация.' : 
                                    settings.language === 'de' ? 'Hier würde sich die 2FA-Einrichtung öffnen. Sie würden einen QR-Code mit einer Authenticator-App scannen.' : 
                                    settings.language === 'fr' ? 'La configuration 2FA s\'ouvrirait ici. Vous scanneriez un code QR avec une application d\'authentification.' : 
                                    '2FA setup would open here. You would scan QR code with authenticator app.')}
                className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900">
                  {settings.language === 'bg' ? 'Двуфакторна автентификация' : 
                   settings.language === 'de' ? 'Zwei-Faktor-Authentifizierung' : 
                   settings.language === 'fr' ? 'Authentification à deux facteurs' : 'Two-Factor Authentication'}
                </div>
                <div className="text-sm text-gray-500">
                  {settings.language === 'bg' ? 'Включи 2FA за допълнителна сигурност' : 
                   settings.language === 'de' ? '2FA für zusätzliche Sicherheit aktivieren' : 
                   settings.language === 'fr' ? 'Activer 2FA pour une sécurité supplémentaire' : 'Enable 2FA for extra security'}
                </div>
              </button>
              <button 
                onClick={() => {
                  const confirmMessage = settings.language === 'bg' ? 'Сигурен ли си, че искаш да изтриеш профила си? Това действие не може да бъде отменено!' : 
                                        settings.language === 'de' ? 'Sind Sie sicher, dass Sie Ihr Konto löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden!' : 
                                        settings.language === 'fr' ? 'Êtes-vous sûr de vouloir supprimer votre compte? Cette action ne peut pas être annulée!' : 
                                        'Are you sure you want to delete your account? This action cannot be undone!';
                  const alertMessage = settings.language === 'bg' ? 'Процесът за изтриване на профила ще започне тук. Ще бъде изпратен имейл за потвърждение.' : 
                                       settings.language === 'de' ? 'Der Kontolöschungsprozess würde hier beginnen. Eine Bestätigungs-E-Mail würde gesendet werden.' : 
                                       settings.language === 'fr' ? 'Le processus de suppression de compte commencerait ici. Un courriel de confirmation serait envoyé.' : 
                                       'Account deletion process would start here. Email confirmation would be sent.';
                  if (confirm(confirmMessage)) {
                    alert(alertMessage);
                  }
                }}
                className="w-full text-left px-4 py-3 border border-red-300 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
              >
                <div className="font-medium">
                  {settings.language === 'bg' ? 'Изтрий профил' : 
                   settings.language === 'de' ? 'Konto löschen' : 
                   settings.language === 'fr' ? 'Supprimer le compte' : 'Delete Account'}
                </div>
                <div className="text-sm text-red-500">
                  {settings.language === 'bg' ? 'Перманентно изтрий твоя профил' : 
                   settings.language === 'de' ? 'Ihr Konto dauerhaft löschen' : 
                   settings.language === 'fr' ? 'Supprimer définitivement votre compte' : 'Permanently delete your account'}
                </div>
              </button>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {settings.language === 'bg' ? 'Системна информация' : 
               settings.language === 'de' ? 'Systeminformationen' : 
               settings.language === 'fr' ? 'Informations système' : 'System Information'}
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {settings.language === 'bg' ? 'Версия:' : 
                   settings.language === 'de' ? 'Version:' : 
                   settings.language === 'fr' ? 'Version:' : 'Version:'}
                </span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {settings.language === 'bg' ? 'Последно обновяване:' : 
                   settings.language === 'de' ? 'Zuletzt aktualisiert:' : 
                   settings.language === 'fr' ? 'Dernière mise à jour:' : 'Last Updated:'}
                </span>
                <span className="font-medium">Nov 16, 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {settings.language === 'bg' ? 'Среда:' : 
                   settings.language === 'de' ? 'Umgebung:' : 
                   settings.language === 'fr' ? 'Environnement:' : 'Environment:'}
                </span>
                <span className="font-medium">
                  {settings.language === 'bg' ? 'Разработка' : 
                   settings.language === 'de' ? 'Entwicklung' : 
                   settings.language === 'fr' ? 'Développement' : 'Development'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {settings.language === 'bg' ? 'ID на потребител:' : 
                   settings.language === 'de' ? 'Benutzer-ID:' : 
                   settings.language === 'fr' ? 'ID utilisateur:' : 'User ID:'}
                </span>
                <span className="font-medium">{user.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            {settings.language === 'bg' ? 'Запази настройки' : 
             settings.language === 'de' ? 'Einstellungen speichern' : 
             settings.language === 'fr' ? 'Enregistrer les paramètres' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}