import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "./LoginPage";
import { toast } from "react-toastify";
import { loginUser } from "../../apis/Api";

jest.mock("../../apis/Api");

describe("Login Credintails", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should diasply error toast message on login fail with incorrect password", async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const mockResponse = {
      userData: {
        success: false,
        message: "Login failed. Please check your credentials.",
      },
    };

    loginUser.mockResolvedValue(mockResponse);

    toast.error = jest.fn();

    const email = await screen.findByPlaceholderText("Email");
    const password = await screen.findByPlaceholderText("Password");
    const loginBtn = screen.getByText("Login");

    fireEvent.change(email, { target: { value: "ram@gmail.com" } });
    fireEvent.change(password, { target: { value: "ram123" } });
    fireEvent.click(loginBtn);

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: "ram@gmail.com",
        password: "ram123",
      });

      expect(toast.error).toHaveBeenCalledWith(
        "Login failed. Please check your credentials."
      );
    });
  });
});
