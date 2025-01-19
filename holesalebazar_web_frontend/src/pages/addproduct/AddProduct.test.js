import React from "react";
import {
  render,
  waitFor,
  screen,
  fireEvent,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { createProduct } from "../../apis/Api";
import { MemoryRouter } from "react-router-dom";
import AddProduct from "./AddProductDetails";
import { toast } from "react-toastify";
import productByIdMock from "../../__mock__/productByIdMock"; // Import your mock data

jest.mock("../../apis/Api");
jest.mock("react-toastify");

global.URL.createObjectURL = jest.fn();

describe("AddProduct", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new product and display it", async () => {
    const mock_product = productByIdMock;

    createProduct.mockResolvedValue({
      status: 201,
      data: { message: "Product created successfully!", data: mock_product },
    });

    const onProductAdded = jest.fn();

    render(
      <MemoryRouter>
        <AddProduct onProductAdded={onProductAdded} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Store Name/i), {
      target: { value: mock_product.storeName },
    });
    fireEvent.change(screen.getByLabelText(/Product Name/i), {
      target: { value: mock_product.productName },
    });
    fireEvent.change(screen.getByLabelText(/Product Price/i), {
      target: { value: mock_product.productPrice },
    });
    fireEvent.change(screen.getByLabelText(/Product Category/i), {
      target: { value: mock_product.productCategory },
    });
    fireEvent.change(screen.getByLabelText(/Product Description/i), {
      target: { value: mock_product.productDescription },
    });
    fireEvent.change(screen.getByLabelText(/Product Availability/i), {
      target: { value: mock_product.productAvailability },
    });

    // Simulate image upload
    const file = new File(["image"], "product.jpg", { type: "image/jpeg" });
    fireEvent.change(screen.getByLabelText(/Product Image/i), {
      target: { files: [file] },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /add/i }));
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Product created successfully!"
      );
      expect(onProductAdded).toHaveBeenCalledWith(mock_product);
    });

    // Check if the new product is displayed (based on your implementation)
    // If you are displaying the new product in the component, you can add assertions to check its presence in the DOM.
  });
});
