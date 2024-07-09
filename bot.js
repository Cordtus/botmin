require('dotenv').config();
const { Telegraf } = require('telegraf');

// Load bot token from .env file
const botToken = process.env.BOT_TOKEN;

// Check if bot token is provided
if (!botToken) {
    throw new Error('Bot token is missing. Please add it to the .env file.');
}

const bot = new Telegraf(botToken);

// Bot permissions list - Shrimprokkoli, M, Tousuke
const adminUserIds = [1692222985, 6194117745, 1289633285];

// L1 group ID
const groupId = -1001806025111;

// Function to check if a user is an admin
const isAdmin = (userId) => adminUserIds.includes(userId);

bot.on('text', async (ctx) => {
    const message = ctx.message;
    const text = message.text;

    // Check if the message is in the specified group
    if (message.chat.id !== groupId) {
        return;
    }

    // Check if the message is a reply to another message
    if (message.reply_to_message) {
        const repliedToMessage = message.reply_to_message;
        const targetUserId = repliedToMessage.from.id;
        const command = text.trim().split(' ')[0];

        if (isAdmin(message.from.id)) {
            switch (command) {
                case '#s':
                    await ctx.deleteMessage(repliedToMessage.message_id);
                    await ctx.restrictChatMember(targetUserId, { can_send_messages: false });
                    break;

                case '#a':
                    await ctx.restrictChatMember(targetUserId, { can_send_messages: true });
                    break;

                case '#d':
                    await ctx.deleteMessage(repliedToMessage.message_id);
                    break;

                case '#q':
                    await ctx.deleteMessage(repliedToMessage.message_id);
                    await ctx.kickChatMember(targetUserId);
                    break;

                case '#x':
                    await ctx.deleteMessage(repliedToMessage.message_id);
                    await ctx.kickChatMember(targetUserId);
                    break;

                default:
                    // Do nothing if the command is not recognized
                    break;
            }
        } else {
            await ctx.reply('Only admins can use the chat controller');
        }
    }

    // Delete the command message after processing
    await ctx.deleteMessage(message.message_id);
});

bot.launch()
.then(() => console.log('Bot started'))
.catch((err) => console.error('Error starting bot:', err));

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
