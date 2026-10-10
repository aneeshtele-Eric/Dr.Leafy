import React, { useState } from 'react';
import { User } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'email' | 'mobile'>('email');
  
  // Email form state
  const [email, setEmail] = useState('aneeshtele@gmail.com');
  const [password, setPassword] = useState('••••••••••');
  
  // Mobile form state
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('415-555-8821');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = async () => {
    if (!phoneNumber) {
      setError('Please enter a valid mobile phone number.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'mobile', destination: `${countryCode} ${phoneNumber}` }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setOtpCode(data.demoOtp || '882100');
      } else {
        setError(data.error || 'Failed to send verification SMS.');
      }
    } catch (e: any) {
      // Offline / fallback
      setOtpSent(true);
      setOtpCode('882100');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyMobile = async () => {
    if (!otpCode) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'mobile',
          destination: `${countryCode} ${phoneNumber}`,
          otp: otpCode,
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setError(data.error || 'Invalid code.');
      }
    } catch (e: any) {
      // Fallback
      handleQuickDemoLogin();
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide an email address.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'email',
          destination: email,
          otp: '882100',
          name: email.split('@')[0],
        }),
      });
      const data = await res.json();
      if (data.user) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        handleQuickDemoLogin();
      }
    } catch {
      handleQuickDemoLogin();
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = () => {
    const demoUser: User = {
      id: 'usr_aneesh_botanist',
      name: 'Aneesh (Botanist)',
      email: 'aneeshtele@gmail.com',
      phone: '+1 (415) 555-8821',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDBvQfTJJBjWAZkoIL3H6qVdfjNX8MS1aktaurhzzaqpUY5vLSZ0SXF-DGhgzAwtfkXSxpp7xgPzgzeQsGCzziytJKk9ama4gWInS03dQUkLwAmcK5hgVPmTiedfWoc_HjThGbnrefsSKIPlZl-4rolX-1rzTTXXEqKUbvjyz1ulBOkx2ZkEFxUl6Z8OHPUD4v_Yuzpc6lVP9D8N0nUIHovhJhaXrRznDtzAyeOtOHyUtdvEd9LnGRB4w',
      role: 'Lead Horticulturalist',
      joinedDate: 'October 2026',
      activePatientsCount: 3,
    };
    onLoginSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#144226]/15 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-[#dff2e4] to-[#f3fbf5] border-b border-[#144226]/10 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#414942] hover:text-[#144226] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-lg bg-[#2d5a3c] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">potted_plant</span>
            </span>
            <span className="text-xl font-bold text-[#144226]">Dr. Leafy AI</span>
          </div>
          <h2 className="text-lg font-bold text-[#144226]">Botanist Sign In</h2>
          <p className="text-xs text-[#414942] mt-0.5">
            Log in to manage your conservatory patients, clinical logs, and diagnostic history.
          </p>

          {/* Mode Tabs */}
          <div className="flex p-1 bg-white/80 rounded-xl border border-[#144226]/15 mt-4">
            <button
              onClick={() => {
                setAuthMode('email');
                setError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'email'
                  ? 'bg-[#144226] text-white shadow-xs'
                  : 'text-[#414942] hover:text-[#144226]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">mail</span>
              <span>Email Login</span>
            </button>
            <button
              onClick={() => {
                setAuthMode('mobile');
                setError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'mobile'
                  ? 'bg-[#144226] text-white shadow-xs'
                  : 'text-[#414942] hover:text-[#144226]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">smartphone</span>
              <span>Mobile Login</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 bg-[#FAF0E6] border border-[#D97746]/30 rounded-xl text-xs text-[#D97746] font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span>{error}</span>
            </div>
          )}

          {authMode === 'email' ? (
            <form onSubmit={handleEmailLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#144226] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-[#414942] material-symbols-outlined text-[18px]">
                    mail
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="botanist@conservatory.com"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-[#f7faf8] border border-[#E8ECE9] focus:border-[#376847] focus:ring-1 focus:ring-[#376847] rounded-xl text-sm text-[#161d1a]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-[#144226]">Password</label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Demo password reset link sent to ' + email); }} className="text-[11px] text-[#376847] hover:underline">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-[#414942] material-symbols-outlined text-[18px]">
                    lock
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-3 py-2 bg-[#f7faf8] border border-[#E8ECE9] focus:border-[#376847] focus:ring-1 focus:ring-[#376847] rounded-xl text-sm text-[#161d1a]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 bg-[#2d5a3c] hover:bg-[#144226] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                ) : (
                  <>
                    <span>Continue with Email</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-3.5">
              {!otpSent ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#144226] mb-1">
                      Mobile Phone Number
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="py-2 px-2.5 bg-[#f7faf8] border border-[#E8ECE9] focus:border-[#376847] rounded-xl text-xs font-semibold text-[#161d1a]"
                      >
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+61">🇦🇺 +61</option>
                        <option value="+49">🇩🇪 +49</option>
                        <option value="+33">🇫🇷 +33</option>
                      </select>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-[#414942] material-symbols-outlined text-[18px]">
                          call
                        </span>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="e.g. 415-555-8821"
                          className="w-full pl-9 pr-3 py-2 bg-[#f7faf8] border border-[#E8ECE9] focus:border-[#376847] focus:ring-1 focus:ring-[#376847] rounded-xl text-sm text-[#161d1a]"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-[#414942] mt-1">
                      We'll send an authentication code via SMS to verify your mobile device.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    className="w-full py-2.5 bg-[#2d5a3c] hover:bg-[#144226] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    ) : (
                      <>
                        <span>Send Mobile Verification Code</span>
                        <span className="material-symbols-outlined text-[18px]">sms</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-[#EAF4EE] border border-[#144226]/15 rounded-xl text-xs text-[#144226]">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">SMS code sent to {countryCode} {phoneNumber}</span>
                      <button
                        onClick={() => setOtpSent(false)}
                        className="text-[11px] text-[#376847] hover:underline"
                      >
                        Change
                      </button>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#414942]">
                      <span>Demo test code:</span>
                      <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-[#144226] border border-[#144226]/10">882100</code>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#144226] mb-1">
                      Enter 6-Digit Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="882100"
                      className="w-full text-center text-lg tracking-widest font-mono font-bold py-2.5 bg-[#f7faf8] border border-[#E8ECE9] focus:border-[#376847] rounded-xl text-[#161d1a]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyMobile}
                    disabled={isLoading}
                    className="w-full py-2.5 bg-[#2d5a3c] hover:bg-[#144226] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    ) : (
                      <>
                        <span>Verify & Sign In</span>
                        <span className="material-symbols-outlined text-[18px]">verified_user</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Quick Demo Login Option */}
          <div className="pt-3 border-t border-[#E8ECE9]">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 px-3 bg-[#EAF4EE] hover:bg-[#d6ede0] text-[#144226] border border-[#144226]/20 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#3B8356]">bolt</span>
              <span>1-Click Botanist Demo Login</span>
            </button>
            <p className="text-center text-[10px] text-[#414942] mt-1.5">
              Instantly preview full access without entering passwords or SMS codes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
