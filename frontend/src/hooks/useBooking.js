import { useState } from 'react';
import { checkAvailability, createBooking } from '../utils/api';

export const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);

  const fetchAvailability = async (date, serviceId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await checkAvailability(date, serviceId);
      setAvailableSlots(data.available_slots || []);
    } catch (err) {
      setError('Failed to load available slots');
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const submitBooking = async (bookingData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createBooking(bookingData);
      return result;
    } catch (err) {
      setError('Failed to create booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    availableSlots,
    loading,
    error,
    fetchAvailability,
    submitBooking,
  };
};
