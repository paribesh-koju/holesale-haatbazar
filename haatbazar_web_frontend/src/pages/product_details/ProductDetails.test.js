import { render, waitFor, screen } from "@testing-library/react";
import ProductDetails from "./ProductDetails";
import "@testing-library/jest-dom";
import { fetchProductById } from "../../apis/Api";
import { MemoryRouter } from "react-router-dom";
import productByIdMock from "../../__mock__/productByIdMock";

jest.mock("../../apis/Api");

//testing perform for the product details
describe("Product details by single id product", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("All Products should be in home page", async () => {
    const mock_data = productByIdMock;

    fetchProductById.mockResolvedValue({ data: { products: mock_data } });

    render(
      <MemoryRouter>
        <ProductDetails />
      </MemoryRouter>
    );
    waitFor(() => {
      mock_data.forEach((product) => {
        expect(screen.getByText(product.productName)).toBeInTheDocument();
      });
    });
  });
});
