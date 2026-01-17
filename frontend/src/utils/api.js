const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Fetch all services
export const getServices = async () => {
  try {
    const response = await fetch(`${API_URL}/api/services`);
    if (!response.ok) throw new Error('Failed to fetch services');
    return await response.json();
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
};

// Check availability
export const checkAvailability = async (date, serviceId) => {
  try {
    const response = await fetch(
      `${API_URL}/api/availability?date=${date}&service_id=${serviceId}`
    );
    if (!response.ok) throw new Error('Failed to check availability');
    return await response.json();
  } catch (error) {
    console.error('Error checking availability:', error);
    return { available_slots: [] };
  }
};

// Create booking
export const createBooking = async (bookingData) => {
  try {
    const response = await fetch(`${API_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    if (!response.ok) throw new Error('Failed to create booking');
    return await response.json();
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};
