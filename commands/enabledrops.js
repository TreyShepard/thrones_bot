// Thrones V Enable Drops Command
// Command: !enableDrops
module.exports = {
  name: "enabledrops",
  description: "Enables drops for the clan.",
  execute(message) {
    message.channel.send("Drops have been enabled for the clan! Enjoy your rewards!");
  },
};