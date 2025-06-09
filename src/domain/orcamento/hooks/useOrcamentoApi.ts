import useFetchBackground from "../../../utils/use-fetch-background.";
import { OrcamentoResponseApi } from "../../types";

export default function useOrcamentoApi({ mockResponse = false }): {
  data: OrcamentoResponseApi | null;
  loading: boolean;
  error: string | null;
} {
  const { data, loading, error } = useFetchBackground<OrcamentoResponseApi>(
    "FETCH_ORCAMENTO",
    {
      mockResponse,
    }
  );

  if (mockResponse) {
    return {
      data: {
        status: "200",
        message: "Mocked data",
        payload: {
          options: mockPizzaOptions,
          sizes: mockSizes,
          bairros: ["Centro", "Zona Sul", "Zona Norte"],
        },
      },
      loading: false,
      error: null,
    };
  }

  return {
    data,
    loading,
    error,
  };
}

type ToppingWithPrice = {
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

const mockPizzaOptions: Record<string, ToppingWithPrice[]> = {
  "pizza-small": [
    {
      menuItemId: "1",
      name: "Margarita",
      groupName: "Tradicional",
      priceAmount: 25.0,
      previousPriceAmount: 30.0,
      discountPercentage: 16.67,
      profitActualPerc: 20.0,
      profitExpectedPerc: 25.0,
      priceExpectedAmount: 30.0,
    },
    {
      menuItemId: "2",
      name: "Pepperoni",
      groupName: "Tradicional",
      priceAmount: 30.0,
      previousPriceAmount: 35.0,
      discountPercentage: 14.29,
      profitActualPerc: 22.0,
      profitExpectedPerc: 27.0,
      priceExpectedAmount: 35.0,
    },
  ],
  "pizza-medium": [
    {
      menuItemId: "1",
      name: "Margarita",
      groupName: "Tradicional",
      priceAmount: 35.0,
      previousPriceAmount: 40.0,
      discountPercentage: 12.5,
      profitActualPerc: 18.0,
      profitExpectedPerc: 23.0,
      priceExpectedAmount: 40.0,
    },
    {
      menuItemId: "2",
      name: "Pepperoni",
      groupName: "Tradicional",
      priceAmount: 40.0,
      previousPriceAmount: 45.0,
      discountPercentage: 11.11,
      profitActualPerc: 19.0,
      profitExpectedPerc: 24.0,
      priceExpectedAmount: 45.0,
    },
  ],
  "pizza-bigger": [
    {
      menuItemId: "1",
      name: "Margarita",
      groupName: "Tradicional",
      priceAmount: 45.0,
      previousPriceAmount: 50.0,
      discountPercentage: 10.0,
      profitActualPerc: 16.0,
      profitExpectedPerc: 21.0,
      priceExpectedAmount: 50.0,
    },
    {
      menuItemId: "2",
      name: "Pepperoni",
      groupName: "Tradicional",
      priceAmount: 50.0,
      previousPriceAmount: 55.0,
      discountPercentage: 9.09,
      profitActualPerc: 16.0,
      profitExpectedPerc: 21.0,
      priceExpectedAmount: 50.0,
    },
  ],
};

const mockSizes = [
  {
    id: "pizza-small",
    key: "pizza-small",
    name: "Pequena",
    nameAbbreviated: "P",
    description: "Tamanho pequeno de pizza",
    sortOrderIndex: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    pizzaDoughCostAmount: 5.0,
    packagingCostAmount: 2.0,
    visible: true,
  },
  {
    id: "pizza-medium",
    key: "pizza-medium",
    name: "Média",
    nameAbbreviated: "M",
    description: "Tamanho médio de pizza",
    sortOrderIndex: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    pizzaDoughCostAmount: 7.0,
    packagingCostAmount: 2.5,
    visible: true,
  },
  {
    id: "pizza-bigger",
    key: "pizza-bigger",
    name: "Grande",
    nameAbbreviated: "G",
    description: "Tamanho grande de pizza",
    sortOrderIndex: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
    pizzaDoughCostAmount: 9.0,
    packagingCostAmount: 3.0,
    visible: true,
  },
];
