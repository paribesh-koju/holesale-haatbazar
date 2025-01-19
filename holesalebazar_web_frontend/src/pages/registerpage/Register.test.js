import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../../apis/Api";
import RegisterPage from "./RegisterPage";

jest.mock("../../apis/Api");

jest.mock("react-toastify", () => ({
  __esModule: true,
  toast: {
    error: jest.fn(),
  },
}));

//done for the register testing
describe("Register Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should display error message on register fail", async () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    const mockResponse = {
      userData: {
        success: false,
        message: "Registration failed. Please try again.",
      },
    };

    registerUser.mockResolvedValue(mockResponse);

    toast.error = jest.fn();

    const username = await screen.findByPlaceholderText("Username");
    const email = await screen.findByPlaceholderText("Email");
    const password = await screen.findByPlaceholderText("Password");
    const confirmPassword = await screen.findByPlaceholderText(
      "Confirm Password"
    );
    const registerBtn = screen.getByText("Register", { selector: "button" });

    fireEvent.change(username, { target: { value: "elon" } });
    fireEvent.change(email, { target: { value: "elon@gmail.com" } });
    fireEvent.change(password, { target: { value: "elon" } });
    fireEvent.change(confirmPassword, { target: { value: "elon" } });
    fireEvent.click(registerBtn);

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith({
        username: "elon",
        email: "elon@gmail.com",
        password: "elon",
        confirmPassword: "elon",
      });

      expect(toast.error).toHaveBeenCalledWith(
        "Registration failed. Please try again."
      );
    });
  });
});
