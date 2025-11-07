'use client';

import { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { 
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  QrCodeIcon,
  KeyIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { LoadingButton } from './Loading';

const TwoFactorSetup = () => {
  const { showSuccess, showError, showInfo } = useToast();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [setupMethod, setSetupMethod] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [backupCodes, setBackupCodes] = useState([]);
  const [telegramChatId, setTelegramChatId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/2fa/status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setStatus(data.data);
      }
    } catch (error) {
      showError('Error', 'Failed to fetch 2FA status');
    }
  };

  const setupEmail2FA = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/2fa/setup/email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setBackupCodes(data.data.backup_codes);
        showSuccess('2FA Enabled', 'Email 2FA has been enabled successfully');
        fetchStatus();
      } else {
        showError('Setup Failed', data.message);
      }
    } catch (error) {
      showError('Error', 'Failed to setup email 2FA');
    } finally {
      setLoading(false);
    }
  };

  const setupTelegram2FA = async () => {
    if (!telegramChatId.trim()) {
      showError('Invalid Input', 'Please enter your Telegram Chat ID');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/2fa/setup/telegram`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ chat_id: telegramChatId })
      });
      
      const data = await response.json();
      if (data.success) {
        setBackupCodes(data.data.backup_codes);
        showSuccess('2FA Enabled', 'Telegram 2FA has been enabled successfully');
        fetchStatus();
        setSetupMethod(null);
      } else {
        showError('Setup Failed', data.message);
      }
    } catch (error) {
      showError('Error', 'Failed to setup Telegram 2FA');
    } finally {
      setLoading(false);
    }
  };

  const setupGoogle2FA = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/2fa/setup/google-authenticator`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setQrCodeUrl(data.data.qr_code_url);
        setBackupCodes(data.data.backup_codes);
        setSetupMethod('google');
        showInfo('Scan QR Code', 'Scan the QR code with your Google Authenticator app');
      } else {
        showError('Setup Failed', data.message);
      }
    } catch (error) {
      showError('Error', 'Failed to setup Google Authenticator 2FA');
    } finally {
      setLoading(false);
    }
  };

  const verifySetup = async () => {
    if (!verificationCode.trim()) {
      showError('Invalid Input', 'Please enter the verification code');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/2fa/verify-code`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: verificationCode })
      });
      
      const data = await response.json();
      if (data.success) {
        showSuccess('2FA Verified', 'Google Authenticator 2FA has been enabled successfully');
        setSetupMethod(null);
        setQrCodeUrl(null);
        setVerificationCode('');
        fetchStatus();
      } else {
        showError('Verification Failed', data.message);
      }
    } catch (error) {
      showError('Error', 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  const disable2FA = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/2fa/disable`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        showSuccess('2FA Disabled', '2FA has been disabled successfully');
        fetchStatus();
        setBackupCodes([]);
      } else {
        showError('Disable Failed', data.message);
      }
    } catch (error) {
      showError('Error', 'Failed to disable 2FA');
    } finally {
      setLoading(false);
    }
  };

  const regenerateBackupCodes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/2fa/backup-codes/regenerate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setBackupCodes(data.data.backup_codes);
        showSuccess('Backup Codes Regenerated', 'New backup codes have been generated');
      } else {
        showError('Regeneration Failed', data.message);
      }
    } catch (error) {
      showError('Error', 'Failed to regenerate backup codes');
    } finally {
      setLoading(false);
    }
  };

  if (!status) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <ShieldCheckIcon className={`h-8 w-8 ${status.enabled ? 'text-green-600' : 'text-gray-400'}`} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600">
                {status.enabled ? `Enabled via ${status.method.replace('_', ' ')}` : 'Not enabled'}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            status.enabled 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {status.enabled ? 'Enabled' : 'Disabled'}
          </div>
        </div>

        {status.enabled && (
          <div className="flex space-x-3">
            <button
              onClick={regenerateBackupCodes}
              disabled={loading}
              className="ai-btn ai-btn-secondary"
            >
              <KeyIcon className="h-4 w-4 mr-2" />
              Regenerate Backup Codes
            </button>
            <button
              onClick={disable2FA}
              disabled={loading}
              className="ai-btn ai-btn-danger"
            >
              Disable 2FA
            </button>
          </div>
        )}
      </div>

      {/* Setup Methods */}
      {!status.enabled && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Choose 2FA Method</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Email 2FA */}
            <button
              onClick={setupEmail2FA}
              disabled={loading}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <EnvelopeIcon className="h-8 w-8 text-blue-600 mb-2" />
              <h5 className="font-medium text-gray-900">Email</h5>
              <p className="text-sm text-gray-600">Receive codes via email</p>
            </button>

            {/* Telegram 2FA */}
            <button
              onClick={() => setSetupMethod('telegram')}
              disabled={loading}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <DevicePhoneMobileIcon className="h-8 w-8 text-blue-600 mb-2" />
              <h5 className="font-medium text-gray-900">Telegram</h5>
              <p className="text-sm text-gray-600">Receive codes via Telegram bot</p>
            </button>

            {/* Google Authenticator 2FA */}
            <button
              onClick={setupGoogle2FA}
              disabled={loading}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <QrCodeIcon className="h-8 w-8 text-blue-600 mb-2" />
              <h5 className="font-medium text-gray-900">Google Authenticator</h5>
              <p className="text-sm text-gray-600">Use authenticator app</p>
            </button>
          </div>
        </div>
      )}

      {/* Telegram Setup */}
      {setupMethod === 'telegram' && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Setup Telegram 2FA</h4>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              To get your Telegram Chat ID, message our bot and it will reply with your ID.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
              <p className="text-sm text-blue-800">
                📱 Step 1: Start a chat with <code className="bg-blue-100 px-1 rounded">@ai_tools_bot</code><br/>
                📱 Step 2: Send any message to get your Chat ID<br/>
                📱 Step 3: Copy and paste your Chat ID below
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="ai-label">Telegram Chat ID</label>
              <input
                type="text"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                placeholder="Enter your Telegram Chat ID"
                className="ai-input"
              />
            </div>
            
            <div className="flex space-x-3">
              <LoadingButton
                loading={loading}
                onClick={setupTelegram2FA}
                className="ai-btn ai-btn-primary"
              >
                Enable Telegram 2FA
              </LoadingButton>
              <button
                onClick={() => setSetupMethod(null)}
                className="ai-btn ai-btn-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Authenticator Setup */}
      {setupMethod === 'google' && qrCodeUrl && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Setup Google Authenticator</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Scan QR Code</h5>
              <div className="bg-white p-4 border rounded-lg text-center">
                <img src={qrCodeUrl} alt="QR Code" className="mx-auto" />
              </div>
            </div>
            
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Enter Verification Code</h5>
              <p className="text-sm text-gray-600 mb-4">
                After scanning the QR code, enter the 6-digit code from your authenticator app to verify the setup.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="ai-label">Verification Code</label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="000000"
                    maxLength="6"
                    className="ai-input"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <LoadingButton
                    loading={loading}
                    onClick={verifySetup}
                    className="ai-btn ai-btn-primary"
                  >
                    Verify & Enable
                  </LoadingButton>
                  <button
                    onClick={() => {
                      setSetupMethod(null);
                      setQrCodeUrl(null);
                      setVerificationCode('');
                    }}
                    className="ai-btn ai-btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backup Codes */}
      {backupCodes.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-amber-900 mb-2">Backup Codes</h4>
              <p className="text-sm text-amber-800 mb-4">
                Save these backup codes in a secure location. You can use them to access your account if you lose your 2FA device.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                {backupCodes.map((code, index) => (
                  <div key={index} className="bg-white p-2 rounded border font-mono text-sm text-center">
                    {code}
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => setBackupCodes([])}
                className="text-sm text-amber-800 hover:text-amber-900 font-medium"
              >
                I've saved these codes safely
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TwoFactorSetup;