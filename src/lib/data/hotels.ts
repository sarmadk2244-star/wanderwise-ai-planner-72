import hunza from "@/assets/dest-hunza.jpg";
import lahore from "@/assets/dest-lahore.jpg";
import islamabad from "@/assets/dest-islamabad.jpg";
import dubai from "@/assets/dest-dubai.jpg";
import turkey from "@/assets/dest-turkey.jpg";
import thailand from "@/assets/dest-thailand.jpg";

export type Hotel = {
  id: string;
  name: string;
  city: string;
  image: string;
  rating: number;
  reviews: number;
  pricePerNight: number; // USD
  rooms: string;
  perks: string[];
};

export const hotels: Hotel[] = [
  { id: "1", name: "Serena Inn Hunza", city: "Hunza, PK", image: hunza, rating: 4.8, reviews: 1284, pricePerNight: 180, rooms: "Deluxe Mountain View", perks: ["Free breakfast", "Mountain view", "Spa"] },
  { id: "2", name: "Pearl Continental Lahore", city: "Lahore, PK", image: lahore, rating: 4.6, reviews: 2103, pricePerNight: 140, rooms: "Executive Suite", perks: ["Pool", "Gym", "Concierge"] },
  { id: "3", name: "Serena Islamabad", city: "Islamabad, PK", image: islamabad, rating: 4.9, reviews: 1740, pricePerNight: 220, rooms: "Premier Room", perks: ["Garden view", "Spa", "Fine dining"] },
  { id: "4", name: "Atlantis The Palm", city: "Dubai, UAE", image: dubai, rating: 4.7, reviews: 9821, pricePerNight: 540, rooms: "Ocean Suite", perks: ["Aquaventure", "Beach access", "12 restaurants"] },
  { id: "5", name: "Museum Hotel Cappadocia", city: "Cappadocia, TR", image: turkey, rating: 4.9, reviews: 3412, pricePerNight: 410, rooms: "Cave Suite", perks: ["Balloon view", "Heated pool", "Antique decor"] },
  { id: "6", name: "Keemala Phuket", city: "Phuket, TH", image: thailand, rating: 4.8, reviews: 2876, pricePerNight: 380, rooms: "Tent Pool Villa", perks: ["Private pool", "Jungle setting", "Spa"] },
  { id: "7", name: "Luxus Hunza", city: "Hunza, PK", image: hunza, rating: 4.5, reviews: 642, pricePerNight: 120, rooms: "Valley Suite", perks: ["Bonfire nights", "Local cuisine"] },
  { id: "8", name: "Avari Lahore", city: "Lahore, PK", image: lahore, rating: 4.3, reviews: 1450, pricePerNight: 95, rooms: "Classic Room", perks: ["Central location", "Pool"] },
];
