/* eslint-disable  @typescript-eslint/no-explicit-any */

export interface MoneyInput {
  amount: number;
  currencyCode: string;
}

export interface MoneyBagInput {
  presentmentMoney?: MoneyInput;
  shopMoney: MoneyInput;
}

export interface MailingAddress {
  address1?: string;
  address2?: string;
  city?: string;
  countryCode?: string;
  company?: string;
  provinceCode?: string;
  zip?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface DraftOrderInput {
  visibleToCustomer: boolean;
  customerId?: string;
  note?: string;
  billingAddress?: MailingAddress;
  shippingAddress?: MailingAddress;
  taxExempt?: boolean;
  tags?: string[];
  email?: string;
  shippingLine?: {
    title?: string;
    price?: number;
  };
  lineItems: {
    variantId?: string;
    title: string;
    originalUnitPriceWithCurrency?: MoneyInput;
    originalUnitPrice?: number;
    weight?: {
      value?: number;
      unit?: string;
    };
    customAttributes?: { key: string; value: string }[];
    requiresShipping?: boolean;
    quantity: number;
    appliedDiscount?: {
      description: string;
      value: number;
      amount: number;
      valueType: string;
      title: string;
    };
  }[];
  customAttributes?: { key: string; value: string }[];
  phone?: string;
}

export interface OrderTaxLineInput {
  channelLiable?: boolean;
  priceSet?: MoneyBagInput;
  rate: number;
  title: string;
}

export interface OrderOptions {
  inventoryBehaviour?: string;
  sendFulfillmentReceipt?: boolean;
  sendReceipt?: boolean;
}

export interface OrderInput {
  shippingAddress?: MailingAddress;
  billingAddress?: MailingAddress;
  buyerAcceptsMarketing?: boolean;
  closedAt?: string;
  companyLocationId?: string;
  currency?: string;
  customAttributes?: { key: string; value: string }[];
  customerId?: string;
  email?: string;
  financialStatus?: string;
  fulfillment?: {
    locationId: string;
    notifyCustomer?: boolean;
    originAddress?: Omit<MailingAddress, "firstName" | "lastName" | "phone">;
    shipmentStatus?: string;
    trackingCompany?: string;
    trackingNumber?: string;
  };
  fulfillmentStatus?: string;
  lineItems?: {
    fulfillmentService?: string;
    giftCard?: boolean;
    priceSet?: MoneyBagInput;
    productId?: string;
    properties?: { name: string; value: string };
    quantity: number;
    requiresShipping?: boolean;
    sku?: string;
    taxLines?: OrderTaxLineInput;
    taxable?: boolean;
    title?: string;
    variantId?: string;
    variantTitle?: string;
    vendor?: string;
  }[];
  metafields?: {
    id?: string;
    key?: string;
    namespace?: string;
    type?: string;
    value?: string;
  }[];
  name?: string;
  note?: string;
  phone?: string;
  poNumber?: string;
  presentmentCurrency?: string;
  processedAt?: string;
  referringSite?: string;
  shippingLines?: {
    code?: string;
    priceSet: MoneyBagInput;
    source?: string;
    taxLines?: OrderTaxLineInput;
    title: string;
  }[];
  sourceIdentifier?: string;
  sourceName?: string;
  sourceUrl?: string;
  tags?: string[];
  taxLines?: {
    channelLiable?: boolean;
    priceSet?: MoneyBagInput;
    rate: number;
    title: string;
  };
  taxesIncluded?: boolean;
  test?: boolean;
  transactions?: {
    amountSet: MoneyBagInput;
    authorizationCode?: string;
    deviceId?: string;
    gateway?: string;
    giftCardId?: string;
    kind?: string;
    locationId?: string;
    processedAt?: string;
    receiptJson?: string;
    status?: string;
    test?: boolean;
    userId?: string;
  }[];
  userId?: string;
}

export interface ProductNode {
  id: string;
  title: string;
  handle: string;
  cursor: string;
  priceRangeV2?: {
    minVariantPrice?: MoneyInput;
    maxVariantPrice: MoneyInput;
  };
  variants: {
    nodes: {
      id: string;
    }[];
  };
  media: {
    nodes: {
      alt: string;
      id: string;
      mediaContentType: string;
      mediaErrors: any;
      mediaWarnings: any;
      status: string;
      preview: {
        status: string;
        image: {
          altText: string;
          width: number;
          height: number;
          id: string;
          url: string;
        };
      };
    }[];
  };
}
