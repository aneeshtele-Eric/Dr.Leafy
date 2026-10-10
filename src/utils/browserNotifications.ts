export type NotificationPermissionState = 'default' | 'granted' | 'denied' | 'unsupported';

export interface ActiveWateringToast {
  id: string;
  patientId: string;
  title: string;
  message: string;
  waterType: string;
  time: string;
}

/**
 * Checks if the browser supports native Notification API.
 */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Gets current notification permission state.
 */
export function getNotificationPermission(): NotificationPermissionState {
  if (!isNotificationSupported()) return 'unsupported';
  return window.Notification.permission as NotificationPermissionState;
}

/**
 * Requests native browser notification permission.
 */
export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    const permission = await window.Notification.requestPermission();
    return permission as NotificationPermissionState;
  } catch (err) {
    console.warn('Error requesting notification permission:', err);
    return getNotificationPermission();
  }
}

/**
 * Fires a native browser notification (with fallback support).
 */
export function triggerNativeNotification(
  title: string,
  options: {
    body: string;
    icon?: string;
    tag?: string;
  }
): boolean {
  if (!isNotificationSupported()) return false;

  if (window.Notification.permission === 'granted') {
    try {
      const n = new window.Notification(title, {
        body: options.body,
        icon: options.icon || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBvQfTJJBjWAZkoIL3H6qVdfjNX8MS1aktaurhzzaqpUY5vLSZ0SXF-DGhgzAwtfkXSxpp7xgPzgzeQsGCzziytJKk9ama4gWInS03dQUkLwAmcK5hgVPmTiedfWoc_HjThGbnrefsSKIPlZl-4rolX-1rzTTXXEqKUbvjyz1ulBOkx2ZkEFxUl6Z8OHPUD4v_Yuzpc6lVP9D8N0nUIHovhJhaXrRznDtzAyeOtOHyUtdvEd9LnGRB4w',
        tag: options.tag || 'dr-leafy-water-alert',
        badge: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBvQfTJJBjWAZkoIL3H6qVdfjNX8MS1aktaurhzzaqpUY5vLSZ0SXF-DGhgzAwtfkXSxpp7xgPzgzeQsGCzziytJKk9ama4gWInS03dQUkLwAmcK5hgVPmTiedfWoc_HjThGbnrefsSKIPlZl-4rolX-1rzTTXXEqKUbvjyz1ulBOkx2ZkEFxUl6Z8OHPUD4v_Yuzpc6lVP9D8N0nUIHovhJhaXrRznDtzAyeOtOHyUtdvEd9LnGRB4w',
      });

      // Automatically close after 12 seconds
      setTimeout(() => {
        try {
          n.close();
        } catch {}
      }, 12000);

      return true;
    } catch (err) {
      console.warn('Could not display native notification:', err);
      return false;
    }
  }

  return false;
}
