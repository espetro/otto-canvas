import { expect } from "chai";

import Refine from "./refine";

describe("refine command", () => {
  it("has correct args defined", () => {
    expect(Refine.args.designId).to.be.an("object");
    expect(Refine.args.designId.required).to.equal(true);
    expect(Refine.args.feedback).to.be.an("object");
    expect(Refine.args.feedback.required).to.equal(true);
  });

  it("has verbose flag defined", () => {
    expect(Refine.flags.verbose).to.be.an("object");
    expect(Refine.flags.verbose.char).to.equal("v");
  });
});
