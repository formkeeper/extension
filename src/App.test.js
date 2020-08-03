import * as React from "react";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { act } from "react-dom/test-utils";

import Setup from "./test/helpers/setup";

jest.mock("./components/page/Page", () => () => null);

configure({ adapter: new Adapter() });

describe("<App />", () => {
  let wrapper;
  let chromeStub = Setup.createChromeStub();

  beforeEach(() => {
    const { App } = require("./App");
    wrapper = mount(<App />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const nonVisibleExtension = "<div class=\"ext-wrapper\" style=\"display: none;\"><iframe></iframe></div>";
  const visibleExtension = "<div class=\"ext-wrapper\" style=\"display: block;\"><iframe></iframe></div>";

  it("renders without crashing", () => {
    expect(wrapper.html()).toBe(nonVisibleExtension);
  });


  it("visible when badged is clicked", () => {
    expect(wrapper.html()).toBe(nonVisibleExtension);

    act(() => {
      chromeStub.dispatchMessage("on_badge_click");
    });
    wrapper.update();

    expect(wrapper.html()).toBe(visibleExtension);
  });
});