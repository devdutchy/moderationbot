const { Command } = require("../structures/Discord");
const util = require("util");
const snekfetch = require("snekfetch");
const { js_beautify: beautify } = require("js-beautify");

module.exports = class EvalCommand extends Command {
  constructor(client) {
    super(client, {
      name: "eval",
      aliases: ["evaluate"],
      group: "util",
      description: "Executes arbitrary JavaScript code. (Owner-only command)"
    });
    /**
     * Level to inspect
     * @private
     * @type {number}
     */
    this.inspectLevel = 0;
  }
  async run(msg, args) {
    if (!this.client.isOwner(msg.author.id)) return msg.reply("you do not have permission to run this command.");
    // Make a bunch of helpers
    /* eslint-disable no-unused-vars, prefer-destructuring, camelcase */
    const message = msg;
    const client = msg.client;
    let code = args.join(" ");
    if (!code) return msg.reply("no code provided to evaluate.");
    const evalstart = await msg.channel.send("Evaluating...");
    const startTime = process.hrtime();
    try {
      let result = eval(code);
      if (result instanceof Promise) result = await result;
      const typeofEvaled = result === null ? "null" : result && result.constructor ? result.constructor.name : typeof evaled;
      if (typeof result !== "string") {
        result = util.inspect(result, { depth: this.inspectLevel });
      }
      let output = `${result}`;
      const diff = process.hrtime(startTime);
      const diffString = diff[0] > 0 ? `\`${diff[0]}\`s` : `\`${diff[1] / 1e6}\`ms`;
      if (output.length > 1899) {
        const res = await snekfetch.post("https://www.hastebin.com/documents")
          .send(beautify(output.trim(), { indent_size: 2 }));
        return evalstart.edit(`
Type: ${typeofEvaled}
Success: https://www.hastebin.com/${res.body.key}.js
Time taken: ${diffString}
        `);
      }
      return evalstart.edit(`
Type: ${typeofEvaled}
Success: \`\`\`js
${beautify(output, { indent_size: 2 })}
\`\`\` Time taken: ${diffString}
      `);
    } catch (err) {
      let error = `${err}`;
      const diff = process.hrtime(startTime);
      const diffString = diff[0] > 0 ? `\`${diff[0]}\`s` : `\`${diff[1] / 1e6}\`ms`;
      if (error.length > 1899) {
        const res = await snekfetch.post("https://www.hastebin.com/documents")
          .send(beautify(error.trim(), { indent_size: 2 }));
        return evalstart.edit(`
ERROR: https://www.hastebin.com/${res.body.key}.js
Time taken: ${diffString}
        `);
      }
      return evalstart.edit(`
ERROR: \`\`\`js
${beautify(error, { indent_size: 2 })}
\`\`\` Time taken: ${diffString}
      `);
    }
  }
};