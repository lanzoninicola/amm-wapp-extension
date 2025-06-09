export type MenuItemPriceSummary = {
  menuItemId: string;
  name: string;
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
  key: string | null;
  name: string;
  nameAbbreviated: string | null;
  description: string | null;
  sortOrderIndex: number;
  createdAt: Date;
  updatedAt: Date;
  pizzaDoughCostAmount: number;
  packagingCostAmount: number;
  visible: boolean;
};

export type PizzaOptionsBySize = Record<string, MenuItemPriceSummary[]>;

export type OrcamentoResponseApi = ApiResponse<{
  options: PizzaOptionsBySize;
  sizes: PizzaSize[];
  bairros: string[];
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
