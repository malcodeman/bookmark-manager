import { render } from "@testing-library/react";

import CollectionDetails from "../[id]";

jest.mock("next/router", () => ({
  useRouter() {
    return {
      query: "",
    };
  },
}));

it("renders Collection details unchanged", () => {
  const { container } = render(<CollectionDetails />);
  expect(container).toMatchSnapshot();
});
