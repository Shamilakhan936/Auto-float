import { 
  Home, Zap, Phone, Shield, Wifi, Baby, Car, Receipt, 
  CreditCard, ShoppingCart, Heart, Building2, Droplets, 
  Trash2, Lock, Sprout, Bug, Hammer, CreditCard as CardIcon
} from "lucide-react";

export const categoryIcons: Record<string, typeof Home> = {
  rent: Home,
  utilities: Zap,
  phone: Phone,
  insurance: Shield,
  internet: Wifi,
  childcare: Baby,
  daycare: Baby,
  auto: Car,
  tolls: Receipt,
  parking: Receipt,
  beauty: Heart,
  groceries: ShoppingCart,
  medical: Heart,
  subscriptions: CreditCard,
  home_maintenance: Hammer,
  pest_control: Bug,
  lawn_care: Sprout,
  security: Lock,
  hoa: Building2,
  trash: Trash2,
  water: Droplets,
  other: CardIcon,
};


