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
  