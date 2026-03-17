import { expect } from "chai";

import List from "./list";

describe("list command", () => {
  it("has correct flags defined", () => {
    expect(List.flags.all).to.be.an("object");
    expect(List.flags.all.char).to.equal("a");
    expect(List.flags.verbose).to.be.an("object");
    expect(List.flags.verbose.char).to.equal("v");
  });

  it("has correct description", () => {
    expect(List.description).to.equal("List all designs");
  });

  it("has examples", () => {
    expect(List.examples).to.be.an("array");
    expect(List.examples.length).to.be.greaterThan(0);
  });
});
