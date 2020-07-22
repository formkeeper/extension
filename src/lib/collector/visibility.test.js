import isHidden from "./visibility";

describe("collector: isHidden()", () => {
  let input;
  beforeEach(() => {
    input = document.createElement("input");
    document.body.appendChild(input);
  });

  afterEach(() => {
    input.remove();
    input = null;
  });

  it("hidden attr", () => {
    expect(isHidden(input)).toBe(false);
    input.setAttribute("hidden", "");
    expect(isHidden(input)).toBe(true);
  });

  it("hidden='false'", () => {
    expect(isHidden(input)).toBe(false);
    input.setAttribute("hidden", "false");
    expect(isHidden(input)).toBe(false);
  });

  it("hidden='true'", () => {
    expect(isHidden(input)).toBe(false);
    input.setAttribute("hidden", "true");
    expect(isHidden(input)).toBe(true);
  });

  it("display: none", () => {
    expect(isHidden(input)).toBe(false);
    input.style.display = "none";
    expect(isHidden(input)).toBe(true);
  });

  it("display: block", () => {
    expect(isHidden(input)).toBe(false);
    input.style.display = "block";
    expect(isHidden(input)).toBe(false);
  });

  it("visibility: hidden", () => {
    expect(isHidden(input)).toBe(false);
    input.style.visibility = "hidden";
    expect(isHidden(input)).toBe(true);
  });

  it("visibility: collapse", () => {
    expect(isHidden(input)).toBe(false);
    input.style.visibility = "collapse";
    expect(isHidden(input)).toBe(false);
  });

  it("opacity: 0", () => {
    expect(isHidden(input)).toBe(false);
    input.style.opacity = "0";
    expect(isHidden(input)).toBe(true);
  });

  it("opacity: 0.5", () => {
    expect(isHidden(input)).toBe(false);
    input.style.opacity = "0.5";
    expect(isHidden(input)).toBe(false);
  });

  it("opacity: 1", () => {
    expect(isHidden(input)).toBe(false);
    input.style.opacity = "1";
    expect(isHidden(input)).toBe(false);
  });

  it("filter: opacity(0)", () => {
    expect(isHidden(input)).toBe(false);
    input.style.filter = "opacity(0)";
    expect(isHidden(input)).toBe(true);
  });

  it("filter: opacity(0.1)", () => {
    expect(isHidden(input)).toBe(false);
    input.style.filter = "opacity(0.1)";
    expect(isHidden(input)).toBe(false);
  });

  it("filter: opacity(0%)", () => {
    expect(isHidden(input)).toBe(false);
    input.style.filter = "opacity(0%)";
    expect(isHidden(input)).toBe(true);
  });

  it("filter: opacity(50%)", () => {
    expect(isHidden(input)).toBe(false);
    input.style.filter = "opacity(50%)";
    expect(isHidden(input)).toBe(false);
  });

  it("transform: scale(0)", () => {
    expect(isHidden(input)).toBe(false);
    input.style.transform = "scale(0)";
    expect(isHidden(input)).toBe(true);
  });

  it("transform: scale(2)", () => {
    expect(isHidden(input)).toBe(false);
    input.style.transform = "scale(2)";
    expect(isHidden(input)).toBe(false);
  });
});