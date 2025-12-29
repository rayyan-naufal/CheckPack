export interface Item {
  id: string;
  category: string;
  name: string;
  location: string;
  note: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color?: string;
}

export interface Location {
  id: string;
  name: string;
  icon: string;
  color?: string;
}

export interface AppState {
  items: Item[];
  categories: Category[];
  locations: Location[];
}
