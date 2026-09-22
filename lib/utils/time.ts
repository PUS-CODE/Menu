export interface OpenStatus {
  isOpen: boolean;
  statusText: string;
  detailText: string;
}

/**
 * Calculates whether a restaurant is currently open based on its opening hours string.
 * Example input: "11:00 AM - 11:30 PM (Mon-Sun)"
 */
export function getRestaurantOpenStatus(openingHours: string): OpenStatus {
  if (!openingHours) {
    return {
      isOpen: true,
      statusText: 'Open Now',
      detailText: 'Open today',
    };
  }

  try {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Regex to match times like "11:00 AM - 11:30 PM"
    const match = openingHours.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i);

    if (match) {
      let [, startH, startM, startAmpm, endH, endM, endAmpm] = match;

      let startHour = parseInt(startH, 10);
      if (startAmpm.toUpperCase() === 'PM' && startHour < 12) startHour += 12;
      if (startAmpm.toUpperCase() === 'AM' && startHour === 12) startHour = 0;
      const startTotalMinutes = startHour * 60 + parseInt(startM, 10);

      let endHour = parseInt(endH, 10);
      if (endAmpm.toUpperCase() === 'PM' && endHour < 12) endHour += 12;
      if (endAmpm.toUpperCase() === 'AM' && endHour === 12) endHour = 0;
      let endTotalMinutes = endHour * 60 + parseInt(endM, 10);

      // Handle late night closing (e.g., 11:00 PM to 2:00 AM)
      if (endTotalMinutes <= startTotalMinutes) {
        endTotalMinutes += 24 * 60;
      }

      const isOpen = currentMinutes >= startTotalMinutes && currentMinutes <= endTotalMinutes;

      if (isOpen) {
        return {
          isOpen: true,
          statusText: 'Open Now',
          detailText: `Open until ${endH}:${endM} ${endAmpm.toUpperCase()}`,
        };
      } else {
        return {
          isOpen: false,
          statusText: 'Closed',
          detailText: `Opens today at ${startH}:${startM} ${startAmpm.toUpperCase()}`,
        };
      }
    }
  } catch (e) {
    console.warn('Could not parse opening hours:', e);
  }

  return {
    isOpen: true,
    statusText: 'Open Now',
    detailText: openingHours,
  };
}
