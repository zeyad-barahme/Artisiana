import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render } from "@testing-library/react-native";
import CheckoutButton from "../components/checkout/CheckoutButton";

describe("CheckoutButton", () => {
  it("renders the button title", () => {
    const onPress = jest.fn();

    const { getByText } = render(
      <CheckoutButton title="Submit" onPress={onPress} />,
    );

    expect(getByText("Submit")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();

    const { getByText } = render(
      <CheckoutButton title="Pay" onPress={onPress} />,
    );

    fireEvent.press(getByText("Pay"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
