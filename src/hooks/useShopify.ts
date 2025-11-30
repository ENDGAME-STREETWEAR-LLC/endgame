import { ProductNode } from "@/models/shopify";

export type ShopifyInput = {
  id: string
  name: string;
  email: string;
  phone: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
};

export type ProductSearchParams = {
  id?: string;
  title?: string;
};

export default function useShopify() {
  return {
    createOrder: async (input: ShopifyInput) => {
      try {
        const response = await fetch("/api/shopify", {
          method: "POST",
          body: JSON.stringify(input),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    getProducts: async (query?: ProductSearchParams) => {
      try {
        const params = new URLSearchParams();

        if (query?.title) {
          params.set("title", query.title);
        }

        if (query?.id) {
          params.set("id", query.id);
        }

        const url = "/api/shopify?" + params.toString();

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        return data as { node: ProductNode }[];
      } catch (error) {
        throw error;
      }
    },
  };
}
