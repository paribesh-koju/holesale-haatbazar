import { render, waitFor, screen } from "@testing-library/react";
import StoreDetails from "./StoreDetails";
import "@testing-library/jest-dom";
import { fetchProductsByStore, searchProductsInStore } from "../../apis/Api";
import { MemoryRouter } from "react-router-dom";
import productbyMock from "../../__mock__/productbyMock";

jest.mock("../../apis/Api");

describe("Store details product by store", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  //all product testing which should fetch on the home page
  it("All Products should be in home page", async () => {
    const mock_userdata = productbyMock;

    fetchProductsByStore.mockResolvedValue({
      data: { products: mock_userdata },
    });

    render(
      <MemoryRouter>
        <StoreDetails />
      </MemoryRouter>
    );
    waitFor(() => {
      mock_data.forEach((product) => {
        expect(
          screen.getByText(product.productDescription)
        ).toBeInTheDocument();
      });
    });
  });
});

//implementation of testing in store product by store
describe("Store details product by store", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("All Products should be in home page", async () => {
    const mock_userstoredata = productbyMock;

    searchProductsInStore.mockResolvedValue({
      data: { products: mock_userstoredata },
    });

    render(
      <MemoryRouter>
        <StoreDetails />
      </MemoryRouter>
    );
    waitFor(() => {
      mock_data.forEach((product) => {
        expect(screen.getByText(product.storeName)).toBeInTheDocument();
      });
    });
  });
});
