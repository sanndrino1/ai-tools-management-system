'use client';

import { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { 
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  QrCodeIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { LoadingButton } from './Loading';

const TwoFactorVerification = ({ 
  user, 
  authMethod, 
  onSuccess, 
  onCancel,
  sessionToken 
}) => {
  const { showSuccess, showError } = useToast();
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [requestingCode, setRequestingCode] = useState(false);

  const getMethodIcon = () => {
    switch (authMethod) {
      case 'email':
        return <EnvelopeIcon className="h-8 w-8 text-blue-600" />;
      case 'telegram':
        return <DevicePhoneMobileIcon className="h-8 w-8 text-blue-600" />;
      case 'google_authenticator':
        return <QrCodeIcon className="h-8 w-8 text-blue-600" />;
      default:
        return <ShieldCheckIcon className="h-8 w-8 text-blue-600" />;
    }
  };

  const getMethodName = () => {
    switch (authMethod) {
      case 'email':
        return 'Email';
      case 'telegram':
        return 'Telegram';
      case 'google_authenticator':
        return 'Google Authenticator';
      default:
        return '2FA';
    }
  };

  const getInstructions = () => {
    switch (authMethod) {
      case 'email':
        return `We've sent a verification code to your email address (${user?.email}). Please enter the code below.`;
      case 'telegram':
        return 'Check your Telegram messages for a verification code from our bot.';
      case 'google_authenticator':
        return 'Open your Google Authenticator app and enter the 6-digit code for this account.';
      default:
        return 'Please enter your 2FA verification code.';
    }
  };

  const requestNewCode = async () => {
    if (authMethod === 'google_authenticator') {
      showError('Not Available', 'Google Authenticator codes are time-based and cannot be resent.');
      return;
    }

    setRequestingCode(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/2fa/send-code`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        showSuccess('Code Sent', `A new verification code has been sent via ${getMethodName()}.`);
      } else {
        showError('Send Failed', data.message);
      }
    } catch (error) {
      showError('Error', 'Failed to send verification code');
    } finally {
      setRequestingCode(false);
    }
  };

  const verifyCode = async () => {
    if (!verificationCode.trim()) {
      showError('Invalid Input', 'Please enter the verification code');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/2fa/verify-code`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: verificationCode })
      });
      
      const data = await response.json();
      if (data.success) {
        showSuccess('Verification Successful', 'You have been logged in successfully.');
        onSuccess(data.data);
      } else {
        showError('Verification Failed', data.message);
        setVerificationCode('');
      }
    } catch (error) {
      showError('Error', 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      verifyCode();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 bg-blue-100 rounded-full mb-4">
            {getMethodIcon()}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Two-Factor Authentication
          </h2>
          <p className="text-gray-600">
            Verify your identity to continue
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {getMethodName()} Verification
            </h3>
            <p className="text-sm text-gray-600">
              {getInstructions()}
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="verificationCode" className="ai-label">
                Verification Code
              </label>
              <input
                id="verificationCode"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyPress={handleKeyPress}
                placeholder="Enter 6-digit code"
                maxLength="6"
                className="ai-input text-center text-lg font-mono tracking-wider"
                autoComplete="one-time-code"
                autoFocus
              />
            </div>

            <div className="space-y-3">
              <LoadingButton
                loading={loading}
                onClick={verifyCode}
                className="w-full ai-btn ai-btn-primary"
                disabled={verificationCode.length < 6}
              >
                Verify Code
              </LoadingButton>

              {authMethod !== 'google_authenticator' && (
                <LoadingButton
                  loading={requestingCode}
                  onClick={requestNewCode}
                  className="w-full ai-btn ai-btn-outline"
                >
                  Send New Code
                </LoadingButton>
              )}

              <button
                onClick={onCancel}
                className="w-full ai-btn ai-btn-ghost flex items-center justify-center"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Login
              </button>
            </div>
          </div>

          {/* Backup Codes Option */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-3">
              Can't access your {getMethodName()}?
            </p>
            <button
              onClick={() => {
                const backupCode = prompt('Enter one of your backup codes:');
                if (backupCode) {
                  setVerificationCode(backupCode);
                  verifyCode();
                }
              }}
              className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Use Backup Code Instead
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">🔒 Security Notice</p>
            <p>This verification step helps protect your account from unauthorized access.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorVerification;