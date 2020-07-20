import * as React from "react";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { act } from "react-dom/test-utils";
import { App } from "./App";
import * as useFieldCollector from "./hooks/useFieldCollector";

import Setup from "./test/helpers/setup";

configure({ adapter: new Adapter() });

describe("<App />", () => {
  let wrapper;
  let chromeStub = Setup.createChromeStub();

  beforeEach(() => {
    jest.spyOn(useFieldCollector, "default")
    .mockImplementation(() => {});
    wrapper = mount(<App />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    expect(wrapper.html()).toBe(null)
  });


  it("visible when badged is clicked", () => {
    expect(wrapper.html()).toBe(null)

    act(() => {
      chromeStub.dispatchMessage("on_badge_click")
    })
    wrapper.update()

    const AppHTML = '<div id="ext-wrapper"><div class="sidebar-wrapper"><iframe></iframe></div></div>'
    expect(wrapper.html()).toBe(AppHTML)
  });
});