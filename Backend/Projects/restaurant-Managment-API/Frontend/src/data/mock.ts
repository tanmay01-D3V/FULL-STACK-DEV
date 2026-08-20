export type OrderStatus = "pending" | "preparing" | "ready" | "served" | "completed";
export type ReservationStatus = "confirmed" | "seated" | "cancelled" | "no-show";
export type MenuCategory = "appetizers" | "mains" | "desserts" | "drinks" | "sides";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  available: boolean;
  image?: string;
}

export interface Order {
  id: string;
  table: number;
  items: { name: string; quantity: number; price: number }[];
  status: OrderStatus;
  total: number;
  createdAt: string;
  guestName?: string;
}

export interface Reservation {
  id: string;
  guestName: string;
  partySize: number;
  date: string;
  time: string;
  status: ReservationStatus;
  phone?: string;
  notes?: string;
}

export interface DashboardStats {
  revenue: number;
  orders: number;
  guests: number;
  avgTicket: number;
  revenueChange: number;
  ordersChange: number;
}

export const menuItems: MenuItem[] = [
  { id: "1", name: "Crispy Calamari", description: "Lightly fried with marinara and lemon aioli", price: 14, category: "appetizers", available: true },
  { id: "2", name: "Burrata & Heirloom Tomato", description: "Fresh burrata, basil, aged balsamic, EVOO", price: 16, category: "appetizers", available: true },
  { id: "3", name: "Tuna Tartare", description: "Sushi-grade tuna, avocado, sesame, wonton crisps", price: 18, category: "appetizers", available: true },
  { id: "4", name: "Grilled Ribeye", description: "12oz prime cut, roasted garlic butter, truffle fries", price: 48, category: "mains", available: true },
  { id: "5", name: "Pan-Seared Salmon", description: "Wild-caught, lemon dill sauce, seasonal vegetables", price: 34, category: "mains", available: true },
  { id: "6", name: "Wild Mushroom Risotto", description: "Arborio rice, porcini, shiitake, parmesan crisp", price: 28, category: "mains", available: true },
  { id: "7", name: "Lamb Shank", description: "Braised in red wine, polenta, gremolata", price: 42, category: "mains", available: true },
  { id: "8", name: "Truffle Fries", description: "Hand-cut, parmesan, truffle oil, herbs", price: 12, category: "sides", available: true },
  { id: "9", name: "Roasted Brussels Sprouts", description: "Balsamic glaze, pancetta, pine nuts", price: 11, category: "sides", available: true },
  { id: "10", name: "Tiramisu", description: "Classic espresso-soaked ladyfingers, mascarpone", price: 14, category: "desserts", available: true },
  { id: "11", name: "Crème Brûlée", description: "Tahitian vanilla bean, caramelized sugar", price: 13, category: "desserts", available: true },
  { id: "12", name: "Espresso Martini", description: "Vodka, Kahlúa, fresh espresso, vanilla", price: 16, category: "drinks", available: true },
  { id: "13", name: "Negroni", description: "Tanqueray, Campari, sweet vermouth, orange peel", price: 15, category: "drinks", available: true },
  { id: "14", name: "House Red", description: "Pinot Noir, Willamette Valley", price: 14, category: "drinks", available: true },
];

export const orders: Order[] = [
  {
    id: "ORD-001",
    table: 12,
    items: [
      { name: "Grilled Ribeye", quantity: 2, price: 48 },
      { name: "Truffle Fries", quantity: 1, price: 12 },
      { name: "House Red", quantity: 2, price: 14 },
    ],
    status: "preparing",
    total: 136,
    createdAt: "2026-08-20T18:30:00",
    guestName: "Martinez",
  },
  {
    id: "ORD-002",
    table: 7,
    items: [
      { name: "Pan-Seared Salmon", quantity: 1, price: 34 },
      { name: "Burrata & Heirloom Tomato", quantity: 1, price: 16 },
      { name: "Negroni", quantity: 2, price: 15 },
    ],
    status: "ready",
    total: 80,
    createdAt: "2026-08-20T18:45:00",
    guestName: "Chen",
  },
  {
    id: "ORD-003",
    table: 3,
    items: [
      { name: "Wild Mushroom Risotto", quantity: 2, price: 28 },
      { name: "Roasted Brussels Sprouts", quantity: 1, price: 11 },
    ],
    status: "served",
    total: 67,
    createdAt: "2026-08-20T19:00:00",
    guestName: "Patel",
  },
  {
    id: "ORD-004",
    table: 15,
    items: [
      { name: "Lamb Shank", quantity: 1, price: 42 },
      { name: "Espresso Martini", quantity: 1, price: 16 },
      { name: "Tiramisu", quantity: 1, price: 14 },
    ],
    status: "pending",
    total: 72,
    createdAt: "2026-08-20T19:15:00",
    guestName: "Okafor",
  },
  {
    id: "ORD-005",
    table: 9,
    items: [
      { name: "Crispy Calamari", quantity: 1, price: 14 },
      { name: "Grilled Ribeye", quantity: 1, price: 48 },
      { name: "House Red", quantity: 1, price: 14 },
    ],
    status: "completed",
    total: 76,
    createdAt: "2026-08-20T17:30:00",
    guestName: "Andersen",
  },
  {
    id: "ORD-006",
    table: 4,
    items: [
      { name: "Tuna Tartare", quantity: 2, price: 18 },
      { name: "Crème Brûlée", quantity: 2, price: 13 },
    ],
    status: "pending",
    total: 62,
    createdAt: "2026-08-20T19:20:00",
    guestName: "Kim",
  },
];

export const reservations: Reservation[] = [
  { id: "RES-001", guestName: "Williams", partySize: 4, date: "2026-08-20", time: "19:00", status: "confirmed", phone: "(555) 123-4567" },
  { id: "RES-002", guestName: "Nakamura", partySize: 2, date: "2026-08-20", time: "19:30", status: "seated", phone: "(555) 234-5678" },
  { id: "RES-003", guestName: "Gupta", partySize: 6, date: "2026-08-20", time: "20:00", status: "confirmed", phone: "(555) 345-6789", notes: "Birthday celebration" },
  { id: "RES-004", guestName: "Rossi", partySize: 2, date: "2026-08-20", time: "20:30", status: "confirmed", phone: "(555) 456-7890" },
  { id: "RES-005", guestName: "Thompson", partySize: 8, date: "2026-08-20", time: "18:00", status: "cancelled", phone: "(555) 567-8901" },
  { id: "RES-006", guestName: "Lee", partySize: 3, date: "2026-08-20", time: "21:00", status: "confirmed", phone: "(555) 678-9012" },
  { id: "RES-007", guestName: "Dubois", partySize: 4, date: "2026-08-20", time: "20:00", status: "no-show", phone: "(555) 789-0123" },
];

export const dashboardStats: DashboardStats = {
  revenue: 4280,
  orders: 47,
  guests: 82,
  avgTicket: 91.06,
  revenueChange: 12.4,
  ordersChange: 8.2,
};

export const revenueByHour = [
  { hour: "5PM", revenue: 320 },
  { hour: "6PM", revenue: 890 },
  { hour: "7PM", revenue: 1240 },
  { hour: "8PM", revenue: 1080 },
  { hour: "9PM", revenue: 560 },
  { hour: "10PM", revenue: 190 },
];

export const popularItems = [
  { name: "Grilled Ribeye", orders: 18, revenue: 864 },
  { name: "Pan-Seared Salmon", orders: 14, revenue: 476 },
  { name: "Wild Mushroom Risotto", orders: 12, revenue: 336 },
  { name: "Tiramisu", orders: 11, revenue: 154 },
  { name: "Espresso Martini", orders: 10, revenue: 160 },
];
