/**
 * Guild Member Add Event Handler
 * This function is triggered whenever a new member joins the server
 * It sends a private welcome message with instructions about setting their RSN
 */
module.exports = (client, member) => {
  try {
    // Send a direct message to the new member
    // This message is only visible to them and provides helpful server guidelines
    member.send('Reminder! Set your RSN as your Discord name in this server. It helps staff with bingo & helps people know who you are.');
  } catch (error) {
    console.error(`Could not send welcome message to ${member.user.tag}:`, error);
  }
};
