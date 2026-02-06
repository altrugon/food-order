"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/store";
import ProductType from "@/models/product";

export default function Menu() {
  const [menu, setMenu] = useState<ProductType[]>([]);
  const { add, remove } = useCart((s: any) => s);

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
            <p>€{item.price}</p>
          </div>
          <div className="px-6 pt-4 pb-2 inline-flex gap-2">
            <button
              value="Remove"
              onClick={() => remove(item)}
              className="bg-gray-200 hover:bg-blue-500 rounded px-3 py-1 text-sm font-semibold text-gray-700 hover:text-white mr-2 mb-2 cursor-pointer"
            >
              <Image src="/remove.svg" alt="remove" width={20} height={20} />
            </button>
            <button
              value="Add"
              onClick={() => add(item)}
              className="bg-gray-200 hover:bg-blue-500 rounded px-3 py-1 text-sm font-semibold text-gray-700 hover:text-white mr-2 mb-2 cursor-pointer"
            >
              <Image src="/add.svg" alt="add" width={20} height={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
