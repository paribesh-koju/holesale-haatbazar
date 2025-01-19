import { render, waitFor, screen } from "@testing-library/react";
import HomePage from "./HomePage";
import { MemoryRouter } from "react-router-dom";
import {
  fetchProducts,
  fetchNewArrivals,
  searchProducts,
} from "../../apis/Api";
import productMock from "../../__mock__/productMock";
import newproductMock from "../../__mock__/newproductMock";
import "@testing-library/jest-dom";

jest.mock("../../apis/Api");

//testing perform in homepage fetching all product
describe("Homepage all product", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("All Products should be in home page", async () => {
    const mock_data = productMock;

    fetchProducts.mockResolvedValue({ data: { products: mock_data } });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    waitFor(() => {
      mock_data.forEach((product) => {
        expect(screen.getByText(product.productName)).toBeInTheDocument();
      });
    });
  });
});

describe("Search Product in home page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("All Products should be in home page", async () => {
    const mock_useralldata = productMock;

    searchProducts.mockResolvedValue({
      data: { products: mock_useralldata },
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    waitFor(() => {
      mock_data.forEach((product) => {
        expect(screen.getByText(product.productName)).toBeInTheDocument();
      });
    });
  });
});

describe("New Product arrival in home page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("New product arrival in the home page", async () => {
    const mock_newdata = newproductMock;

    fetchNewArrivals.mockResolvedValue({ data: { products: mock_newdata } });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    waitFor(() => {
      mock_newdata.forEach((product) => {
        expect(screen.getByText(product.storeName)).toBeInTheDocument();
      });
    });
  });
});
