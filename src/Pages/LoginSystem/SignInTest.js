import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import SignIn from "./SignIn";

jest.mock("../../Contexts/axiosConfig", () => ({
  post: jest.fn(),
}));

jest.mock("../../Components/Validators", () => ({
  validateLoginInputs: jest.fn(() => []),
}));

jest.mock("../../Contexts/AuthContext", () => ({
  useAuth: jest.fn(() => ({
    setUser: jest.fn(),
    setFlag: jest.fn(),
    user: {},
  })),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(() => jest.fn()),
  Link: jest.fn(),
}));

describe("SignIn", () => {
  it("should submit the form with the provided username and password", async () => {
    const { getByLabelText, getByRole } = render(<SignIn />);

    fireEvent.change(getByLabelText("Username"), {
      target: { value: "test-user" },
    });

    fireEvent.change(getByLabelText("Password"), {
      target: { value: "test-password" },
    });

    axios.post.mockResolvedValueOnce({
      data: {
        status: "Login Successful",
        users_id: 1234,
        username: "test-user",
        fname: "John",
        lname: "Doe",
        email: "test-user@example.com",
        phonenumber: "555-1234",
        pfp: "",
        bio: "",
        hobbie1: "",
        hobbie2: "",
        hobbie3: "",
        fact1: "",
        fact2: "",
        lie: "",
        accessToken: "test-access-token",
        friendslist: [],
        gender: "Male",
        region: "US",
      },
    });

    fireEvent.submit(getByRole("button"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "/api/login",
        {
          username: "test-user",
          password: "test-password",
          last_login: expect.anything(),
        },
        { withCredentials: true }
      );
    });
  });
});