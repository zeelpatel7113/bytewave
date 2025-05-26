import { submitServiceRequest } from '@/utils/services-api';
import { getCurrentDateTime, getCurrentUser } from '@/lib/utils';

class FormSession {
  constructor() {
    this.data = new Map();
    this.timer = null;
    this.SUBMIT_DELAY = 15000; // 15 seconds
  }

  updateData(serviceId, formData) {
    this.data.set(serviceId, {
      ...formData,
      statusHistory: [{
        status: 'partial',
        note: 'Partial form submission',
        updatedAt: new Date(),
        updatedBy: getCurrentUser()
      }]
    });

    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.submitData();
    }, this.SUBMIT_DELAY);
  }

  async submitData() {
    if (this.data.size === 0) return;

    const entries = Array.from(this.data.entries());
    this.data.clear();

    try {
      await Promise.all(
        entries.map(([serviceId, formData]) =>
          submitServiceRequest({
            ...formData,
            serviceId
          })
        )
      );
    } catch (error) {
      console.warn('Error submitting form session data:', error);
    }
  }

  clearSession(serviceId) {
    this.data.delete(serviceId);
  }

  clearAllSessions() {
    this.data.clear();
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

export const formSession = new FormSession();