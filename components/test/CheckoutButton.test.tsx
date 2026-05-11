import { fireEvent, render, screen } from "@testing-library/react-native";
import CheckoutButton from "../shared/CheckoutButton";

describe("CheckoutButton", () => {
  const defaultProps = {
    title: "Checkout",
    onPress: jest.fn(),
  };

  it("renders button title", () => {
    render(<CheckoutButton {...defaultProps} />);

    expect(screen.getByText("Checkout")).toBeTruthy();
  });

  it("calls onPress when button is pressed", () => {
    const onPress = jest.fn();

    render(<CheckoutButton title="Pay" onPress={onPress} />);

    fireEvent.press(screen.getByText("Pay"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
