import { render, waitFor, screen } from "@testing-library/react";
import AdminDashboard from "./AdminDashboard";
import "@testing-library/jest-dom";
import { deleteProduct } from "../../apis/Api";
import { MemoryRouter } from "react-router-dom";
import productByIdMock from "../../__mock__/productByIdMock";

jest.mock("../../apis/Api");

//admin test done by updating the product form id
describe("Product updated by single id product", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("All Products should be in home page", async () => {
    const mock_userdata = productByIdMock;

    deleteProducts.mockResolvedValue({ data: { products: mock_userdata } });

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );
    waitFor(() => {
      mock_data.forEach((product) => {
        expect(screen.getByText(product.productPrice)).toBeInTheDocument();
      });
    });
  });
});
