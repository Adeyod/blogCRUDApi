import jwt from 'jsonwebtoken';

const generateToken = async (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '5h',
  });

  res.cookie('access_token', token, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 5 * 1000,
  });
};

const tokenVerification = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    res.json({
      message: 'You need to login',
      success: false,
    });
    return;
  }
  await jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Token Invalid:', err);
      return;
    }
    req.user = user;
    next();
  });
};

export { generateToken, tokenVerification };
