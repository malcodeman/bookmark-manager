import { render } from "@testing-library/react";

import Signup from "../signup";

it("renders Signup unchanged", () => {
  const { container } = render(<Signup />);
  expect(container).toMatchSnapshot();
});
