import { OrderInput, OrderOptions } from "@/models/shopify";
import { createAdminApiClient } from "@shopify/admin-api-client";

const key = process.env.SHOPIFY_ACCESS_KEY;
const domain = process.env.SHOPIFY_DOMAIN;

if (!key) {
  throw new Error("Missing .env variable: SHOPIFY_ACCESS_KEY");
}

if (!domain) {
  throw new Error("Missing .env variable: SHOPIFY_DOMAIN");
}

const client = createAdminApiClient({
  storeDomain: domain,
  apiVersion: "2025-10",
  accessToken: key,
});

export default function useShopify() {
  return {
    createOrder: async () => {
      const order: OrderInput = {
        test: true,
        lineItems: [
          {
            priceSet: {
              shopMoney: {
                amount: 10,
                currencyCode: "USD",
              },
              presentmentMoney: {
                amount: 10,
                currencyCode: "USD",
              },
            },
            quantity: 1,
            requiresShipping: true,
            title: "Test item",
          },
        ],
      };

      //Options for order
      const options: OrderOptions = {
        sendFulfillmentReceipt: true,
        sendReceipt: true,
      };

      //Mutation for creating the order in shopify
      const newOrder = await client.request(
        `mutation OrderCreate($order: OrderCreateOrderInput!, $options: OrderCreateOptionsInput) {
      orderCreate(order: $order, options: $options) {
        userErrors {
          field
          message
        }
        order {
          id
          totalTaxSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          lineItems(first: 5) {
            nodes {
              variant {
                id
              }
              id
              title
              quantity
              taxLines {
                title
                rate
                priceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }`,
        {
          variables: {
            order,
            options,
          },
        }
      );

      if (newOrder.errors) {
        throw new Error(
          newOrder.errors.message + ". " + newOrder.errors.graphQLErrors?.at(0)
        );
      }
      console.log(newOrder.data.orderCreate);

      return newOrder;
    },
  };
}
