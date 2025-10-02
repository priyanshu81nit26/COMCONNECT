const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const NotificationService = require('../services/notificationService');
const admin = require('../config/firebase.js');

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    // Send notifications to all users in the chat except sender
    const notificationPromises = message.chat.users.map(async (user) => {
      if (user._id.toString() !== req.user._id.toString()) {
        console.log(`🔔 Sending notification to user: ${user._id}`);
        
        // Create FCM message
        const fcmMessage = {
          token: await NotificationService.getFCMToken(user._id),
          notification: {
            title: message.chat.isGroupChat 
              ? `New message in ${message.chat.chatName}`
              : `New message from ${message.sender.name}`,
            body: content,
          },
          webpush: {
            notification: {
              title: message.chat.isGroupChat 
                ? `New message in ${message.chat.chatName}`
                : `New message from ${message.sender.name}`,
              body: content,
              icon: message.sender.pic || '/icon.png',
              badge: '/badge.png',
              vibrate: [200, 100, 200],
              requireInteraction: true,
              tag: `chat-${chatId}`, // Group by chat
              actions: [
                {
                  action: 'open',
                  title: 'Open Chat'
                },
                {
                  action: 'reply',
                  title: 'Reply'
                }
              ]
            },
            fcm_options: {
              link: `/chat/${chatId}`
            }
          },
          data: {
            type: 'new_message',
            chatId: chatId.toString(),
            messageId: message._id.toString(),
            senderId: message.sender._id.toString(),
            senderName: message.sender.name,
            isGroupChat: message.chat.isGroupChat.toString(),
            chatName: message.chat.chatName || '',
            timestamp: new Date().toISOString()
          }
        };

        try {
          console.log(`📤 Sending FCM to user ${user._id}`);
          const response = await admin.messaging().send(fcmMessage);
          console.log(`✅ FCM sent successfully to user ${user._id}:`, response);
        } catch (error) {
          console.error(`❌ FCM failed for user ${user._id}:`, error);
          // If FCM fails, try queuing
          try {
            await NotificationService.queueNotification({
              userId: user._id.toString(),
              title: fcmMessage.notification.title,
              body: fcmMessage.notification.body,
              data: fcmMessage.data
            });
            console.log(`📫 Notification queued for user ${user._id}`);
          } catch (queueError) {
            console.error(`❌ Queue failed for user ${user._id}:`, queueError);
          }
        }
      }
    });

    // Wait for all notifications to be processed
    await Promise.all(notificationPromises);
    console.log('✅ All notifications processed');

    res.json(message);
  } catch (error) {
    console.error('❌ Error in sendMessage:', error);
    res.status(400);
    throw new Error(error.message);
  }
});



const deleteAllMessages = asyncHandler(async (req, res) => {
  try {
    await Message.deleteMany({});
    res.status(200).json({ message: 'All messages have been deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete messages', error: error.message });
  }
});

module.exports = { allMessages, sendMessage, deleteAllMessages };
