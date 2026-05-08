"use client";

import useAuthStore from "@/hooks/useAuthStore";
import useShopify from "@/hooks/useShopify";
import { ProductNode } from "@/models/shopify";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import ShopItem from "./ShopItem";

export default function Shop() {
  const [session] = useAuthStore();
  const shopify = useShopify();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<null | { node: ProductNode }[]>();

  useEffect(() => {
    new Promise(async () => {
      setLoading(true);
      const products = await shopify.getProducts();
      setProducts(products);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex justify-center w-full">
      <section className="grid grid-cols-2 md:grid-cols-3 gap-16 xl:gap-26">
        {loading && <ClipLoader color="white" />}
        {products?.map(({ node }) => (
          <ShopItem
            id={node.variants.nodes[0].id}
            key={node.title}
            title={node.title}
            image={node.media.nodes[0].preview.image.url}
            price={node.priceRangeV2?.minVariantPrice?.amount as number}
            stock={node.totalInventory}
            session={session}
          />
        ))}
      </section>
    </div>
  );
}
