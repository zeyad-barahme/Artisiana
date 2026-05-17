import { render, screen } from "@testing-library/react-native";
import HomeSectionHeader from "../home/HomeSectionHeader";

describe("HomeSectionHeader", () => {
  it("renders title correctly", () => {
    render(<HomeSectionHeader title="Trending Now" />);

    expect(screen.getByText("Trending Now")).toBeTruthy();
  });

  it("renders different titles", () => {
    render(<HomeSectionHeader title="Special Offers" />);

    expect(screen.getByText("Special Offers")).toBeTruthy();
  });
  it("renders without crashing", () => {
  const { toJSON } = render(
    <HomeSectionHeader title="Categories" />
  );

  expect(toJSON()).toBeTruthy();
});
});