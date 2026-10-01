const { PermissionFlagsBits } = require('discord.js');

function getInformationChannelId() {
  return getRequiredChannelId('P4L_INFORMATION_CHANNEL_ID');
}

function getSubmissionsChannelId() {
  return getRequiredChannelId('P4L_SUBMISSIONS_CHANNEL_ID');
}

function getRequiredChannelId(variableName) {
  const channelId = process.env[variableName];
  if (!channelId) throw new Error(`${variableName} is not set in the environment.`);
  return channelId;
}

async function fetchTextChannel(client, channelId, label) {
  const channel = await client.channels.fetch(channelId);
  if (!channel || typeof channel.send !== 'function') {
    throw new Error(`${label} channel is unavailable or cannot receive messages.`);
  }

  if (!channel.guild || typeof channel.permissionsFor !== 'function') {
    throw new Error(`${label} channel must be a server text channel.`);
  }

  const botMember = channel.guild.members.me || await channel.guild.members.fetch(client.user.id);
  const permissions = channel.permissionsFor(botMember);
  const requiredPermissions = [
    [PermissionFlagsBits.ViewChannel, 'View Channel'],
    [PermissionFlagsBits.SendMessages, 'Send Messages'],
  ];
  const missingPermissions = requiredPermissions
    .filter(([permission]) => !permissions?.has(permission))
    .map(([, name]) => name);

  if (missingPermissions.length) {
    const error = new Error(`${label} channel is missing bot permissions: ${missingPermissions.join(', ')}.`);
    error.code = 'P4L_CHANNEL_PERMISSION_ERROR';
    throw error;
  }

  return channel;
}

module.exports = {
  getInformationChannelId,
  getSubmissionsChannelId,
  fetchTextChannel,
};