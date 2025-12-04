// Office location data for TAS Trading Corporation

export interface Contact {
  name: string;
  phone: string;
  isPrimary?: boolean;
}

export interface Office {
  id: string;
  name: string;
  contacts: Contact[];
  mapsUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Primary contact for the company
export const PRIMARY_CONTACT = {
  name: "Moiz Unjhawala",
  phone: "9052772942",
  whatsapp: "919052772942", // With country code for WhatsApp
};

export const offices: Office[] = [
  {
    id: "head-office",
    name: "Head Office",
    contacts: [
      { name: "Murtuza Unjhawala", phone: "9391057437" },
      { name: "Moiz Unjhawala", phone: "9052772942", isPrimary: true },
    ],
    mapsUrl: "https://maps.app.goo.gl/eWVC9xUoYo17j8HL8",
    coordinates: {
      lat: 17.4335236,
      lng: 78.490871,
    },
  },
  {
    id: "branch-office",
    name: "Branch Office",
    contacts: [
      { name: "Huzefa Unjhawala", phone: "8008252786" },
      { name: "Aliasgar Unjhawala", phone: "9908391519" },
    ],
    mapsUrl: "https://maps.app.goo.gl/tuQPjqZohQ7sn3jB7",
    coordinates: {
      lat: 17.4348928,
      lng: 78.4905214,
    },
  },
  {
    id: "balanagar-branch",
    name: "Balanagar Branch Office",
    contacts: [{ name: "Mustafa Unjhawala", phone: "9885216310" }],
    mapsUrl: "https://maps.app.goo.gl/cVYi6AGswHJCkjTC6",
    coordinates: {
      lat: 17.4653467,
      lng: 78.4486868,
    },
  },
];

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find nearest office based on user coordinates
export function findNearestOffice(
  userLat: number,
  userLng: number
): Office | null {
  if (offices.length === 0) return null;

  let nearestOffice = offices[0];
  let minDistance = calculateDistance(
    userLat,
    userLng,
    offices[0].coordinates.lat,
    offices[0].coordinates.lng
  );

  for (const office of offices) {
    const distance = calculateDistance(
      userLat,
      userLng,
      office.coordinates.lat,
      office.coordinates.lng
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearestOffice = office;
    }
  }

  return nearestOffice;
}

// Format phone for WhatsApp link
export function getWhatsAppLink(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  const phoneWithCountry = cleanPhone.startsWith("91")
    ? cleanPhone
    : `91${cleanPhone}`;
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${phoneWithCountry}${encodedMessage}`;
}
