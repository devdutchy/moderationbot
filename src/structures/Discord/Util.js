const fs = require("fs");

const loadCommands = Client => { // eslint-disable-line arrow-body-style
  return new Promise((resolve, reject) => {
    fs.readdir(`../../commands`, (err, files) => {
      if (err) reject(err);
      files.forEach(file => {
        let Command = require(`../../commands/${file}`);
        let Module = new Command(Client);
        Client.commands.set(Module.name, Module);
        Client.log.debug(`Loading Command: ${Module.name}.`);
        Module.aliases.forEach(alias => { // eslint-disable-line max-nested-callbacks                        
          Client.aliases.set(alias, Module.name);
        });
      });
    });
    resolve();
  });
};


module.exports = { loadCommands };