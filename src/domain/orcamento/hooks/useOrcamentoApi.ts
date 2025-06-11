import useFetchBackground from "../../../utils/use-fetch-background.";
import { BairroWithFeeAndDistance, OrcamentoResponseApi } from "../../types";

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

  console.log({ data });

  if (mockResponse) {
    return {
      data: {
        status: "200",
        message: "Mocked data",
        payload: {
          options: pizzaOptionsMock,
          sizes: sizesMock,
          bairros: bairrosWithFeesMock,
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

const pizzaOptionsMock: Record<string, ToppingWithPrice[]> = {
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

const sizesMock = [
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
    maxToppingsAmount: 1,
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
    maxToppingsAmount: 2,
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
    maxToppingsAmount: 4,
  },
];

export const bairrosWithFeesMock: BairroWithFeeAndDistance[] = [
  {
    id: "bairro-001",
    name: "Centro",
    city: "Pato Branco",
    state: "PR",
    zipCode: "85501-000",
    createdAt: new Date("2023-01-01T12:00:00Z"),
    updatedAt: new Date("2024-01-01T12:00:00Z"),
    deliveryFee: {
      id: "fee-001",
      bairroId: "bairro-001",
      pizzeriaLocationId: "pizzeria-001",
      amount: 5.5,
      createdAt: new Date("2023-01-01T12:00:00Z"),
      updatedAt: new Date("2024-01-01T12:00:00Z"),
    },
    distance: {
      id: "dist-001",
      bairroId: "bairro-001",
      pizzeriaLocationId: "pizzeria-001",
      distanceInKm: 2.8,
      estimatedTimeInMin: 10,
      createdAt: new Date("2023-01-01T12:00:00Z"),
    },
  },
  {
    id: "bairro-002",
    name: "Bairro Industrial",
    city: "Pato Branco",
    state: "PR",
    zipCode: "85502-000",
    createdAt: new Date("2023-02-01T12:00:00Z"),
    updatedAt: new Date("2024-02-01T12:00:00Z"),
    deliveryFee: {
      id: "fee-002",
      bairroId: "bairro-002",
      pizzeriaLocationId: "pizzeria-001",
      amount: 7.0,
      createdAt: new Date("2023-02-01T12:00:00Z"),
      updatedAt: new Date("2024-02-01T12:00:00Z"),
    },
    distance: {
      id: "dist-002",
      bairroId: "bairro-002",
      pizzeriaLocationId: "pizzeria-001",
      distanceInKm: 4.1,
      estimatedTimeInMin: 15,
      createdAt: new Date("2023-02-01T12:00:00Z"),
    },
  },
];
