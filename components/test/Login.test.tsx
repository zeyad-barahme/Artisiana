import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import Login from "../../app/login";

jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

jest.mock("@/api/firebase", () => ({
  auth: {},
}));

describe("Login", () => {
  it("renders login screen title", () => {
    render(<Login />);

    expect(screen.getByText("Welcome back 👋")).toBeTruthy();
    expect(screen.getByText("Login to your account")).toBeTruthy();
  });

  it("renders email and password inputs", () => {
    render(<Login />);

    expect(screen.getByPlaceholderText("Email")).toBeTruthy();
    expect(screen.getByPlaceholderText("Password")).toBeTruthy();
  });

  it("shows validation errors when login is pressed with empty fields", async () => {
    render(<Login />);

    fireEvent.press(screen.getByText("Log in"));

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeTruthy();
      expect(screen.getByText("Password is required")).toBeTruthy();
    });
  });
});