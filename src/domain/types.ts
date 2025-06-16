export type ToppingWithPrice = {
  menuItemId: string;
  name: string;
  ingredients: string;
  groupName?: string;
  priceAmount: number;
  previousPriceAmount: number;
  discountPercentage: number;
  profitActualPerc: number;
  profitExpectedPerc: number;
  priceExpectedAmount: number;
};

export type PizzaSize = {
  id: string;
  key: string;
  name: string;
  nameAbbreviated: string | null;
  description: string | null;
  sortOrderIndex: number;
  createdAt: Date;
  updatedAt: Date;
  pizzaDoughCostAmount: number;
  packagingCostAmount: number;
  visible: boolean;
  maxToppingsAmount: number;
};

export interface BairroWithFeeAndDistance {
  id: string;
  name: string;
  city: string;
  state: string;
  zipCode: string | null;
  createdAt: Date;
  updatedAt: Date;
  deliveryFee: {
    id: string;
    bairroId: string;
    pizzeriaLocationId: string;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
  };
  distance: {
    id: string;
    bairroId: string;
    pizzeriaLocationId: string;
    distanceInKm: number;
    estimatedTimeInMin: number | null;
    createdAt: Date;
  };
}

export type PizzaOptionsBySize = Record<string, ToppingWithPrice[]>;

export type OrcamentoResponseApi = ApiResponse<{
  options: PizzaOptionsBySize;
  sizes: PizzaSize[];
  bairros: BairroWithFeeAndDistance[];
}>;

export type SaborSelecionado = {
  id: string;
  quantidade: number;
};

type ApiResponse<T> = {
  status: string;
  message: string;
  payload: T;
};
