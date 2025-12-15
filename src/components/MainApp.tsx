import ShopItem from "./ShopItem";
import useShopify from "@/hooks/useShopify";
import { ProductNode } from "@/models/shopify";
import { useEffect, useState } from "react";
import useAuthStore from "@/hooks/useAuthStore";
import Modal from "./Modal";

export default function MainApp() {
  const [session] = useAuthStore();
  const shopify = useShopify();
  const [products, setProducts] = useState<null | { node: ProductNode }[]>();

  useEffect(() => {
    new Promise(async () => {
      const products = await shopify.getProducts();
      setProducts(products);
    });
  }, []);

  return (
    <div className="flex justify-center w-full">
      <section className="grid grid-cols-3 gap-5">
        {products?.map(({ node }) => (
          <ShopItem
            id={node.variants.nodes[0].id}
            key={node.title}
            title={node.title}
            image={node.media.nodes[0].preview.image.url}
            price={node.priceRangeV2?.minVariantPrice?.amount as number}
            session={session}
          />
        ))}
      </section>
    </div>
  );
}
