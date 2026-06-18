import { ShoppingCart, Smartphone } from 'lucide-react';

const iconConfig = {
  cart: { icon: ShoppingCart, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
  mobile: { icon: Smartphone, iconBg: 'bg-orange-50', iconColor: 'text-orange-500' },
};

export function ProjectIcon({ iconType, size = 18 }) {
  const config = iconConfig[iconType] || iconConfig.cart;
  const Icon = config.icon;
  return (
    <div
      className={`w-10 h-10 rounded-lg ${config.iconBg} flex items-center justify-center shrink-0`}
    >
      <Icon size={size} className={config.iconColor} />
    </div>
  );
}

export { iconConfig };
