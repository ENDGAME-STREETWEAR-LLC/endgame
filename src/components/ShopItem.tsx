"use client";

import { useLocalization } from "@/hooks/useLocalization";
import useShopify from "@/hooks/useShopify";
import { Session } from "@supabase/supabase-js";
import { FormEvent, useState } from "react";
import { ClipLoader } from "react-spinners";
import Modal from "./Modal";

type ShopItemProps = {
  id: string;
  title: string;
  image: string;
  price: number;
  stock: number;
  session: Session;
};

export default function ShopItem({
  id,
  title,
  image,
  price,
  stock,
  session,
}: ShopItemProps) {
  const shopify = useShopify();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { localization: t } = useLocalization();

  async function submitFormHandler(event: FormEvent<HTMLFormElement>) {
    setLoading(true);
    event.preventDefault();

    if (stock <= 0) {
      throw new Error("Product is out of stock.");
    }

    const formData = Object.fromEntries(
      new FormData(event.currentTarget).entries()
    );

    if (parseInt(formData.quantity as string) > stock) {
      throw new Error("Product stock exceeded.");
    }

    console.log("formData", formData);
    console.log("quantity", parseInt(formData.quantity as string));

    try {
      const result = await shopify.createOrder({
        id,
        name: session.user.user_metadata.name as string,
        title,
        email: session.user.email as string,
        image,
        phone: session.user.phone as string,
        price,
        quantity: parseInt(formData.quantity as string),
      });
      setShowSuccess(true);
      setLoading(false);
      return result;
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  return (
    <form
      className="xl:w-[400px] lg:w-[300px] w-[200px] p-4 bg-[#FFFFFF22] hover:bg-[#FFFFFF55] active:bg-[#FFFFFF44] hover:cursor-pointer rounded-lg"
      key={title}
      onSubmit={submitFormHandler}
    >
      <Modal open={showSuccess}>
        <div className="mt-2 flex flex-col gap-3 text-center items-center w-full p-4">
          <p>{t.shop.success}</p>
          <p className="my-4 font-bold">{session.user.email}</p>
          <button
            onClick={() => setShowSuccess(false)}
            className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          >
            {t.close}
          </button>
        </div>
      </Modal>
      <input className="hidden" defaultValue={title} name="title" />
      <input className="hidden" defaultValue={price} name="price" />
      <input className="hidden" defaultValue={image} name="image" />
      <img
        className={`w-full xl:h-[350px] lg:h-[250px] h-[150px] object-cover ${
          stock <= 0 && "blur-[3px]"
        }`}
        src={image}
        alt={title}
        width="100"
        height="100"
      ></img>
      <div className="flex flex-col pt-2">
        <p className="font-bold text-center">
          {t.products?.[title as keyof typeof t.products] || title}
        </p>
        <span className="flex justify-between">
          <p>{t.shop.price}</p>
          <p className="text-right">{price} $</p>
        </span>
        <span className="flex justify-between">
          <p>{t.shop.available}</p>
          <p className="text-right">{stock}</p>
        </span>
        <span className={`flex justify-between ${stock <= 0 && "opacity-0"}`}>
          <p>{t.shop.quantity}</p>
          <input
            disabled={stock <= 0}
            className="w-10 bg-[#222222] text-center rounded-sm"
            type="number"
            min="1"
            max={stock}
            step="1"
            defaultValue={"1"}
            name="quantity"
          />
        </span>
        {!loading && (
          <button
            disabled={stock <= 0}
            className="text-center font-bold text-black w-full bg-white disabled:bg-[#FFFFFF44] hover:bg-[#FFFFFFDD] cursor-pointer rounded-full p-3 mt-4"
            type="submit"
          >
            {t.shop.buy}
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
