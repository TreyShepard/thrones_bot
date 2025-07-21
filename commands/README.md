# Commands Directory

This directory contains all the bot commands that users can execute. Each command is defined in its own JavaScript file and follows a standardized structure.

## Directory Structure

Each command file should export an object with the following properties:

```javascript
module.exports = {
  name: 'commandname',        // The command name (what users type after the prefix)
  description: 'Description', // Optional: Brief description of what the command does
  usage: 'usage example',     // Optional: How to use the command
  execute(message, args) {
    // Command logic goes here
    // message: The Discord message object
    // args: Array of arguments passed with the command
  }
};
```

## Best Practices

- **Error Handling**: Always include try-catch blocks for complex operations
- **Input Validation**: Check if required arguments are provided
- **Permissions**: Verify user permissions before executing sensitive commands
- **Rate Limiting**: Consider implementing cooldowns for resource-intensive commands
- **Documentation**: Include `description` and `usage` properties for help commands
- **Consistent Naming**: Use clear, descriptive command names
- **Modular Design**: Keep commands focused on a single purpose


## Future Enhancements

This structure supports various advanced features:

- **Aliases**: Add an `aliases` array property for alternative command names
- **Permissions**: Add a `permissions` property to restrict command usage
- **Cooldowns**: Add cooldown timers to prevent spam
- **Categories**: Group related commands together
- **Sub-commands**: Implement command hierarchies (e.g., `.music play`, `.music stop`)
- **Help Integration**: Automatic help generation from command properties
