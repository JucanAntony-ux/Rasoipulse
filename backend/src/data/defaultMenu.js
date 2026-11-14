export const defaultMenuItems = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    user_id: null,
    item_name: "Paneer Tikka Roll",
    category: "hot_snack",
    base_prep: 60,
    wasted_yesterday: 14,
    cost_price: 55,
    sell_price: 130,
    is_perishable: true
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    user_id: null,
    item_name: "Masala Chai (Flasks)",
    category: "hot_drink",
    base_prep: 80,
    wasted_yesterday: 10,
    cost_price: 12,
    sell_price: 35,
    is_perishable: true
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    user_id: null,
    item_name: "Samosa & Pakora Plate",
    category: "hot_snack",
    base_prep: 70,
    wasted_yesterday: 18,
    cost_price: 18,
    sell_price: 50,
    is_perishable: true
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    user_id: null,
    item_name: "Cold Coffee",
    category: "cold_drink",
    base_prep: 50,
    wasted_yesterday: 16,
    cost_price: 35,
    sell_price: 110,
    is_perishable: true
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    user_id: null,
    item_name: "Fresh Lime Soda",
    category: "cold_drink",
    base_prep: 45,
    wasted_yesterday: 5,
    cost_price: 15,
    sell_price: 60,
    is_perishable: false
  },
  {
    id: "00000000-0000-0000-0000-000000000006",
    user_id: null,
    item_name: "Chicken Biryani Box",
    category: "meal",
    base_prep: 55,
    wasted_yesterday: 12,
    cost_price: 85,
    sell_price: 190,
    is_perishable: true
  }
];

export const getDefaultMenuClone = () => JSON.parse(JSON.stringify(defaultMenuItems));
