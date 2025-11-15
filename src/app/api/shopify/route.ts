import { ShopifyInput } from "@/hooks/useShopify";
import {
  DraftOrderInput,
  OrderInput,
  OrderOptions,
  ProductNode,
} from "@/models/shopify";
import { createAdminApiClient } from "@shopify/admin-api-client";
import { NextRequest, NextResponse } from "next/server";

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

export const GET = async (req: NextRequest) => {
  try {
    const params = req.nextUrl.searchParams;

    // Fetch all products from shopify
    const request = await client.request(`query {
      products(first: 20) {
        edges {
          node {
            id
            variants(first: 10) {
              nodes {
                id
              }
            }
            media(first: 10) {
              nodes {
                alt
                id
                mediaContentType
                mediaErrors {
                  code
                  details
                  message
                }
                mediaWarnings {
                  code
                  message
                }
                preview {
                  image {
                    altText
                    height
                    width
                    id
                    url
                  }
                  status
                }
                status
              } 
            }
            title
            handle
            priceRangeV2 {
              maxVariantPrice {
                amount
                currencyCode
              }
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
          cursor
        }
        pageInfo {
          hasNextPage
        }
      }
    }`);

    if (request.errors) {
      console.log(request.errors?.message, request.errors?.graphQLErrors);
      return NextResponse.json(
        { message: request.errors.message },
        { status: 500 }
      );
    }

    const products = request.data.products.edges as { node: ProductNode }[];
    let filteredProducts = [...products];

    const title = params.get("title");
    const id = params.get("id");

    if (title) {
      filteredProducts = filteredProducts.filter(
        ({ node }) => node.title === title
      );

      if (filteredProducts.length === 0) {
        filteredProducts = filteredProducts.filter(({ node }) =>
          node.title.includes(title)
        );
      }
    }

    if (id) {
      filteredProducts = filteredProducts.filter(({ node }) => node.id === id);
    }

    return NextResponse.json(filteredProducts);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const input = (await req.json()) as ShopifyInput;

    const order: DraftOrderInput = {
      email: input.email,
      phone: input.phone,
      visibleToCustomer: true,
      lineItems: [
        {
          title: input.title,
          quantity: 1,
          variantId: input.id,
        },
      ],
    };

    //Mutation for creating the order in shopify
    const newOrder = await client.request(
      `mutation DraftOrderCreate($input: DraftOrderInput!) {
      draftOrderCreate(input: $input) {
        draftOrder {
          id
        }
      }
    }`,
      {
        variables: {
          input: order,
        },
      }
    );

    if (newOrder.errors) {
      console.error("newOrder errors", newOrder.errors.graphQLErrors);
      throw new Error(
        newOrder.errors.message + ". " + newOrder.errors.graphQLErrors?.at(0)
      );
    }
    console.log(newOrder.data);

    const invoiceRequest = await client.request(
      `mutation draftOrderInvoiceSend($id: ID!) {
      draftOrderInvoiceSend(id: $id) {
        draftOrder {
          id
        }
      }
    }`,
      {
        variables: {
          id: newOrder.data.draftOrderCreate.draftOrder.id,
        },
      }
    );

    if (invoiceRequest.errors) {
      console.error("newOrder errors", invoiceRequest.errors.graphQLErrors);
      throw new Error(
        invoiceRequest.errors.message +
          ". " +
          invoiceRequest.errors.graphQLErrors?.at(0)
      );
    }

    return NextResponse.json({ newOrder, invoiceRequest });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
};
