import React, { useState } from 'react';
import { Patient } from '../types';
import {
  getNotificationPermission,
  requestNotificationPermission,
  triggerNativeNotification,
  NotificationPermissionState,
} from '../utils/browserNotifications';
import { calculateWateringPlan, PlantWateringPlan } from '../utils/wateringScheduler';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToPatient: (patientId: string) => void;
  patients: Record<string, Patient>;
  onTriggerInAppToast?: (plan: PlantWateringPlan) => void;
  isRecurringEnabled: boolean;
  onToggleRecurring: (enabled: boolean) => void;
  recurringInterval: string;
  onChangeRecurringInterval: (interval: string) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  onNavigateToPatient,
  patients,
  onTriggerInAppToast,
  isRecurringEnabled,
  onToggleRecurring,
  recurringInterval,
  onChangeRecurringInterval,
}) => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'watering'>('watering');
  const [permissionState, setPermissionState] = useState<NotificationPermissionState>(
    getNotificationPermission()
  );
  const [testingPlantId, setTestingPlantId] = useState<string | null>(null);
  const [testSentMessage, setTestSentMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const state = await requestNotificationPermission();
    setPermissionState(state);
  };

  const handleTriggerTestReminder = (patient: Patient) => {
    const plan = calculateWateringPlan(patient);
    setTestingPlantId(patient.id);

    // 1. Native browser notification
    const nativeShown = triggerNativeNotification(plan.notificationTitle, {
      body: `${plan.notificationMessage}\n* Recommended Water: ${plan.waterType}`,
    });

    // 2. In-app toast callback
    if (onTriggerInAppToast) {
      onTriggerInAppToast(plan);
    }

    setTestSentMessage(
      nativeShown
        ? `🔔 Native browser notification dispatched for ${patient.name}!`
        : `🔔 Reminder triggered for ${patient.name}! (Enable browser permissions to see system banners)`
    );

    setTimeout(() => {
      setTestingPlantId(null);
      setTestSentMessage(null);
    }, 4500);
  };

  const patientList = Object.values(patients);
  const wateringPlans = patientList.map((p) => calculateWateringPlan(p));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-[#144226]/15 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-[#144226] to-[#2d5a3c] text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <span className="material-symbols-outlined text-[22px]">notifications_active</span>
            </div>
            <div>
              <h2 className="text-base font-bold">Conservatory Notifications & Hydration Alerts</h2>
              <p className="text-xs text-white/80">
                Automated browser watering reminders grounded in species taxonomy & care notes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-[#E8ECE9] bg-[#f7faf8] px-5 pt-2">
          <button
            onClick={() => setActiveTab('watering')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'watering'
                ? 'border-[#144226] text-[#144226]'
                : 'border-transparent text-[#414942] hover:text-[#144226]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">water_drop</span>
            <span>Recurring Watering Reminders ({wateringPlans.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'alerts'
                ? 'border-[#144226] text-[#144226]'
                : 'border-transparent text-[#414942] hover:text-[#144226]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">medical_services</span>
            <span>Clinical Care Queue (3)</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-[#161d1a] bg-[#f7faf8]">
          {testSentMessage && (
            <div className="p-3 bg-[#EAF4EE] border border-[#3B8356]/40 text-[#144226] font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
              <span className="material-symbols-outlined text-[18px] text-[#3B8356]">notifications_active</span>
              <span>{testSentMessage}</span>
            </div>
          )}

          {activeTab === 'watering' ? (
            <div className="space-y-4">
              {/* Browser Permission Card */}
              <div className="p-4 bg-white rounded-xl border border-[#E8ECE9] shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-[#376847]">
                      {permissionState === 'granted' ? 'notifications_active' : 'notifications_paused'}
                    </span>
                    <div>
                      <h4 className="font-bold text-[#144226]">System Browser Notifications</h4>
                      <p className="text-[11px] text-[#414942]">
                        Receive desktop & mobile alerts even when working in other tabs
                      </p>
                    </div>
                  </div>

                  {permissionState === 'granted' ? (
                    <span className="px-2.5 py-1 bg-[#EAF4EE] text-[#3B8356] font-extrabold text-[11px] rounded-full border border-[#3B8356]/20 flex items-center gap-1 self-start sm:self-auto">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                      <span>Permission Granted</span>
                    </span>
                  ) : (
                    <button
                      onClick={handleRequestPermission}
                      className="px-3 py-1.5 bg-[#2d5a3c] hover:bg-[#144226] text-white font-bold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">campaign</span>
                      <span>Enable Browser Alerts</span>
                    </button>
                  )}
                </div>

                {/* Automation Cadence Controls */}
                <div className="pt-2 border-t border-[#E8ECE9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isRecurringEnabled}
                        onChange={(e) => onToggleRecurring(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-[#dce4de] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#3B8356]"></div>
                    </label>
                    <span className="font-semibold text-[#144226]">
                      {isRecurringEnabled ? 'Recurring Alerts Active' : 'Recurring Alerts Paused'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#414942]">Cadence:</span>
                    <select
                      value={recurringInterval}
                      onChange={(e) => onChangeRecurringInterval(e.target.value)}
                      className="px-2.5 py-1 bg-[#f7faf8] border border-[#E8ECE9] rounded-lg text-xs font-semibold text-[#144226] focus:border-[#376847]"
                    >
                      <option value="smart">🌿 Smart Species Cadence (Care Notes)</option>
                      <option value="daily">Daily Morning Check (24h)</option>
                      <option value="3days">Every 3 Days</option>
                      <option value="weekly">Weekly Inspection</option>
                      <option value="demo">⚡ Demo Mode (Every 25 seconds)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Per-Plant Tailored Watering Reminders List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#144226] text-xs">
                    Tailored Watering Plans by Plant & Care Notes:
                  </h4>
                  <span className="text-[10px] text-[#414942]">
                    Updates dynamically with new notes
                  </span>
                </div>

                {wateringPlans.map((plan) => {
                  const patient = patients[plan.patientId];
                  return (
                    <div
                      key={plan.patientId}
                      className="p-3.5 bg-white rounded-xl border border-[#E8ECE9] hover:border-[#376847] transition-all shadow-xs space-y-2.5"
                    >
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-[#e8f0e9] flex items-center justify-center text-lg shadow-inner">
                            {patient?.id === 'DL-8822' ? '🪴' : patient?.id === 'DL-8823' ? '🌱' : '🌿'}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h5 className="font-bold text-[#144226] text-xs">{plan.plantName}</h5>
                              <span className="text-[10px] font-bold text-[#376847] bg-[#EAF4EE] px-1.5 py-0.2 rounded border border-[#144226]/10">
                                #{plan.patientId}
                              </span>
                            </div>
                            <span className="text-[10px] text-[#414942] italic">
                              {plan.speciesCategory}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              plan.dueStatus === 'urgent'
                                ? 'bg-[#FAF0E6] text-[#D97746] border-[#D97746]/25'
                                : 'bg-[#EAF4EE] text-[#3B8356] border-[#3B8356]/20'
                            }`}
                          >
                            Due: {plan.nextWateringDate}
                          </span>
                        </div>
                      </div>

                      {/* Care notes reasoning excerpt */}
                      <p className="text-[11px] text-[#161d1a] leading-relaxed bg-[#f7faf8] p-2 rounded-lg border border-[#E8ECE9]">
                        <strong>Care Notes Diagnosis:</strong> {plan.reasoning}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#E8ECE9]">
                        <div className="flex items-center gap-1 text-[11px] text-[#376847]">
                          <span className="material-symbols-outlined text-[14px]">opacity</span>
                          <span className="font-semibold">{plan.waterType}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              onNavigateToPatient(plan.patientId);
                              onClose();
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold text-[#144226] hover:bg-[#EDF4F7] rounded-lg transition-colors cursor-pointer"
                          >
                            View Case →
                          </button>

                          <button
                            onClick={() => handleTriggerTestReminder(patient)}
                            disabled={testingPlantId === plan.patientId}
                            className="px-3 py-1 bg-[#EAF4EE] hover:bg-[#b6edc2] text-[#144226] font-bold text-[11px] rounded-lg border border-[#144226]/20 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            title="Fire a test watering reminder immediately"
                          >
                            <span className="material-symbols-outlined text-[13px] text-[#3B8356]">
                              notifications
                            </span>
                            <span>Test Reminder</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Tab 2: Existing Clinical Care Queue */
            <div className="space-y-2.5">
              {[
                {
                  id: 'n1',
                  patientId: 'DL-8821',
                  title: 'Monstera Bottom Soak Due',
                  message: 'Petiole turgor indicates urgent bottom-watering soak (45 mins) is needed.',
                  time: '10 mins ago',
                  urgent: true,
                },
                {
                  id: 'n2',
                  patientId: 'DL-8822',
                  title: 'Fiddle Leaf Fig Neem Repellent',
                  message: 'Second contact neem spray scheduled in 2 days to stop spider mite nymphs.',
                  time: '2 hours ago',
                  urgent: false,
                },
                {
                  id: 'n3',
                  patientId: 'DL-8823',
                  title: 'Calathea Prayer Leaf Check',
                  message: 'Evening nyctinastic leaf fold observed. High turgor recovery confirmed!',
                  time: 'Yesterday',
                  urgent: false,
                },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onNavigateToPatient(item.patientId);
                    onClose();
                  }}
                  className="p-3.5 rounded-xl bg-white border border-[#E8ECE9] hover:border-[#376847] hover:bg-[#f7faf8] transition-all cursor-pointer space-y-1 shadow-xs"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#144226] flex items-center gap-1.5">
                      {item.urgent && (
                        <span className="w-2 h-2 rounded-full bg-[#D97746] animate-pulse"></span>
                      )}
                      <span>{item.title}</span>
                    </span>
                    <span className="text-[10px] text-[#414942]">{item.time}</span>
                  </div>
                  <p className="text-xs text-[#414942] leading-relaxed">{item.message}</p>
                  <div className="pt-1 flex justify-between items-center text-[10px]">
                    <span className="text-[#376847] font-semibold">Patient #{item.patientId}</span>
                    <span className="text-[#144226] font-bold flex items-center gap-0.5">
                      View Case →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-[#E8ECE9] flex justify-between items-center">
          <span className="text-[11px] text-[#414942] flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#3B8356]"></span>
            <span>Dr. Leafy Botanical Hydration Engine</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-[#2d5a3c] text-white hover:bg-[#144226] rounded-xl cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
