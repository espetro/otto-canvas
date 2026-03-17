import { expect } from "chai";

import Generate from "./generate";

describe("generate command", () => {
  it("has correct args defined", () => {
    expect(Generate.args.prompt).to.be.an("object");
    expect(Generate.args.prompt.required).to.equal(true);
  });

  it("has correct flags defined", () => {
    expect(Generate.flags.iterations).to.be.an("object");
    expect(Generate.flags.iterations.char).to.equal("i");
    expect(Generate.flags.style).to.be.an("object");
    expect(Generate.flags.style.char).to.equal("s");
    expect(Generate.flags.verbose).to.be.an("object");
    expect(Generate.flags.verbose.char).to.equal("v");
  });

  it("has correct description", () => {
    expect(Generate.description).to.equal("Generate a design using AI");
  });
});
