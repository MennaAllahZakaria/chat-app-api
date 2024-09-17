exports.sanitizeUser=function(user) {
    return {
        _id:user._id,
        username:user.username,
        email:user.email,
    };

};

exports.sanitizeUsers = function(users) {
    return users.map(user => ({
      _id: user._id,
      username: user.username,
      email: user.email
    }));
  };
  
  exports.sanitizeMessages = function(messages) {
    return messages.map(message => ({
      _id: message._id,
      sender:message.userId,
      room: message.roomId,
      content: message.content,
      createdAt: message.createdAt
    }));
  };

  exports.sanitizePrivateMessages = function(messages) {
    return messages.map(message => ({
      _id: message._id,
      sender:message.userId,
      recipient: message.roomId,
      content: message.content,
      createdAt: message.createdAt
    }));
  };
  