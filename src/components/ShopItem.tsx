"use client";

import useShopify from "@/hooks/useShopify";
import { Session } from "@supabase/supabase-js";
import { FormEvent, useState } from "react";
import { ClipLoader } from "react-spinners";

type ShopItemProps = {
  id: string;
  title: string;
  image: string;
  price: number;
  session: Session;
};

export default function ShopItem({
  id,
  title,
  image,
  price,
  session,
}: ShopItemProps) {
  const shopify = useShopify();
  const [loading, setLoading] = useState(false);

  async function submitFormHandler(event: FormEvent<HTMLFormElement>) {
    setLoading(true);
    event.preventDefault();

    const formData = Object.fromEntries(
      new FormData(event.currentTarget).entries()
    );

    try {
      const result = await shopify.createOrder({
        id,
        name: session.user.user_metadata.name as string,
        title: formData.title as string,
        email: session.user.email as string,
        image,
        phone: session.user.phone as string,
        price: parseInt(formData.price as string),
        quantity: parseInt(formData.quantity as string),
      });
      alert("Purchase order created successfully!");
      setLoading(false);
      return result;
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  return (
    <form
      className="w-[400px] p-4 bg-[#FFFFFF22] hover:bg-[#FFFFFF55] active:bg-[#FFFFFF44] hover:cursor-pointer rounded-lg"
      key={title}
      onSubmit={submitFormHandler}
    >
      <input className="hidden" defaultValue={title} name="title" />
      <input className="hidden" defaultValue={price} name="price" />
      <input className="hidden" defaultValue={image} name="image" />
      <img
        className="w-full h-[350px] object-cover"
        src={image}
        alt={title}
        width="100"
        height="100"
      ></img>
      <div className="flex flex-col pt-2">
        <p className="font-bold text-center">{title}</p>
        <span className="flex justify-between">
          <p>Price</p>
          <p className="text-right">{price} $</p>
        </span>
        <span className="flex justify-between">
          <p>Quantity</p>
          <input
            className="w-10 bg-[#222222] text-center rounded-sm"
            type="number"
            min="1"
            step="1"
            defaultValue={"1"}
            name="quantity"
          />
        </span>
        {!loading && (
          <button
            className="text-center font-bold text-black w-full bg-white hover:bg-[#FFFFFFDD] cursor-pointer rounded-full p-3 mt-4"
            type="submit"
          >
            Buy
          </button>
        )}
        {loading && (
          <span className="w-full flex justify-center items-center">
            <ClipLoader />
          </span>
        )}
      </div>
    </form>
  );
}
