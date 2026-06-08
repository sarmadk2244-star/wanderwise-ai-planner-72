import serenaHunza from "@/assets/hotel-serena-hunza.jpg";
import pcLahore from "@/assets/hotel-pc-lahore.jpg";
import serenaIslamabad from "@/assets/hotel-serena-islamabad.jpg";
import atlantisDubai from "@/assets/hotel-atlantis-dubai.jpg";
import museumCappadocia from "@/assets/hotel-museum-cappadocia.jpg";
import keemalaPhuket from "@/assets/hotel-keemala-phuket.jpg";
import luxusHunza from "@/assets/hotel-luxus-hunza.jpg";
import avariLahore from "@/assets/hotel-avari-lahore.jpg";

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
  { id: "1", name: "Serena Inn Hunza", city: "Hunza, PK", image: serenaHunza, rating: 4.8, reviews: 1284, pricePerNight: 180, rooms: "Deluxe Mountain View", perks: ["Free breakfast", "Mountain view", "Spa"] },
  { id: "2", name: "Pearl Continental Lahore", city: "Lahore, PK", image: pcLahore, rating: 4.6, reviews: 2103, pricePerNight: 140, rooms: "Executive Suite", perks: ["Pool", "Gym", "Concierge"] },
  { id: "3", name: "Serena Islamabad", city: "Islamabad, PK", image: serenaIslamabad, rating: 4.9, reviews: 1740, pricePerNight: 220, rooms: "Premier Room", perks: ["Garden view", "Spa", "Fine dining"] },
  { id: "4", name: "Atlantis The Palm", city: "Dubai, UAE", image: atlantisDubai, rating: 4.7, reviews: 9821, pricePerNight: 540, rooms: "Ocean Suite", perks: ["Aquaventure", "Beach access", "12 restaurants"] },
  { id: "5", name: "Museum Hotel Cappadocia", city: "Cappadocia, TR", image: museumCappadocia, rating: 4.9, reviews: 3412, pricePerNight: 410, rooms: "Cave Suite", perks: ["Balloon view", "Heated pool", "Antique decor"] },
  { id: "6", name: "Keemala Phuket", city: "Phuket, TH", image: keemalaPhuket, rating: 4.8, reviews: 2876, pricePerNight: 380, rooms: "Tent Pool Villa", perks: ["Private pool", "Jungle setting", "Spa"] },
  { id: "7", name: "Luxus Hunza", city: "Hunza, PK", image: luxusHunza, rating: 4.5, reviews: 642, pricePerNight: 120, rooms: "Valley Suite", perks: ["Bonfire nights", "Local cuisine"] },
  { id: "8", name: "Avari Lahore", city: "Lahore, PK", image: avariLahore, rating: 4.3, reviews: 1450, pricePerNight: 95, rooms: "Classic Room", perks: ["Central location", "Pool"] },
];
