console.log("Running background.js")

typeof chrome !== 'undefined' && typeof chrome.runtime !== 'undefined'

const REST_API_BASE_URL = "http://localhost:3000/api";
const FETCH_ORCAMENTO_MOCK_RESPONSE = false

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received message in background.js:", request);

  if (request.type === "FETCH_ORCAMENTO") {

    if (FETCH_ORCAMENTO_MOCK_RESPONSE === true) {

      const data = {
        status: "200",
        message: "Mocked data",
        payload: {
          options: pizzaOptionsMock,
          sizes: sizesMock,
          bairros: bairrosWithFeesMock,
        }
      }

      Promise.resolve(data).then(data => sendResponse({ data }));
    }

    fetch(`${REST_API_BASE_URL}/orcamento`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "3PjN!u9g@r5XzE1fQw7H", // Use the API key from the request
      },
    })
      .then(res => {

        console.log("Response received from server:", res);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status} ${res.statusText} - body: ${JSON.stringify(res.body)}`);
        }
        return res;
      }
      )
      .then(res => res.json())
      .then(data => sendResponse({ data }))
      .catch(error => {
        console.error("Error fetching orcamento:", error);
        sendResponse({ error: error.message });
      });

    return true;
  }
});


const pizzaOptionsMock = {
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

const bairrosWithFeesMock = [
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