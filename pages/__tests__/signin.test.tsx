import { render } from "@testing-library/react";

import Signin from "../signin";

it("renders Signin unchanged", () => {
  const { container } = render(<Signin />);
  expect(container).toMatchSnapshot();
});
