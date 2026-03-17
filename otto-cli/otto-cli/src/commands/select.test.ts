import { expect } from "chai";

import Select from "./select";

describe("select command", () => {
  it("has correct args defined", () => {
    expect(Select.args.designId).to.be.an("object");
    expect(Select.args.designId.required).to.equal(true);
  });

  it("has verbose flag defined", () => {
    expect(Select.flags.verbose).to.be.an("object");
    expect(Select.flags.verbose.char).to.equal("v");
  });
});
