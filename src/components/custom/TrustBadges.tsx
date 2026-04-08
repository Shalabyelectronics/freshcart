"use client";

import { Truck, RotateCcw, Shield } from "lucide-react";

export default function TrustBadges() {
  const badges = [
    {
      icon: Truck,
      title: "Free Delivery",
      description: "Orders over 550",
    },
    {
      icon: RotateCcw,
      title: "30 Days Return",
      description: "Money back",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% Protected",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 py-4 border-t border-b border-gray-200">
      {badges.map((badge, idx) => {
        const Icon = badge.icon;
        return (
          <div key={idx} className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-50 mb-2">
              <Icon className="text-green-600" size={24} />
            </div>
            <h4 className="text-sm font-semibold text-gray-800">
              {badge.title}
            </h4>
            <p className="text-xs text-gray-500">{badge.description}</p>
          </div>
        );
      })}
    </div>
  );
}
