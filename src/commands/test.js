const { Command } = require("../structures/Discord");

module.exports = class TestCommand extends Command {
  constructor(client) {
    super(client, {
      name: "test",
      description: "Test command for testing purposes (owner-only).",
      group: "util"
    });
  }
  async run(msg) {
    await msg.edit("hehe");
  }
};