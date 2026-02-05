"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/store";

export default function Menu() {
  const [menu, setMenu] = useState<any[]>([]);
  const add = useCart((s) => s.add);

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then(setMenu);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      {menu.map((item) => (
        <div
          key={item.id}
          className="max-w-sm rounded overflow-hidden shadow-lg bg-white"
        >
          <img alt={item.name} src={item.image} className="w-full" />
          <div className="px-6 py-4">
            <h3 className="font-bold text-xl mb-2">{item.name}</h3>
            <p className="text-gray-700 text-base">{item.description}</p>
          </div>
          <div className="px-6 pt-4 pb-2">
            <button
              onClick={() => add(item)}
              className="bg-gray-200 hover:bg-blue-500 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 hover:text-white mr-2 mb-2 cursor-pointer"
            >
              Add €{item.price}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
