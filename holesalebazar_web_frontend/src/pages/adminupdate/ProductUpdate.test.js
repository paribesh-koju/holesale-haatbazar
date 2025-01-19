import { render, waitFor, screen } from "@testing-library/react";
import UpdateProduct from "./ProductUpdate";
import "@testing-library/jest-dom";
import { updateProduct } from "../../apis/Api";
import { MemoryRouter } from "react-router-dom";
import productByIdMock from "../../__mock__/productByIdMock";

jest.mock("../../apis/Api");

//product testing by passing sigle product id

describe("Product updated by single id product", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("All Products should be in home page", async () => {
    const mock_userdata = productByIdMock;

    updateProduct.mockResolvedValue({ data: { products: mock_userdata } });

    //render the page accounding to the specific page
    render(
      <MemoryRouter>
        <UpdateProduct />
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
