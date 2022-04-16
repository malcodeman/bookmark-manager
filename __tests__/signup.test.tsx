import { render } from "@testing-library/react";

import Signup from "../pages/signup";

it("renders Signup unchanged", () => {
  const { container } = render(<Signup />);
  expect(container).toMatchSnapshot();
});
