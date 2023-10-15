import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import Token from '../models/tokenModel.js';
import { verifyEmail } from '../utils/nodemailerMessages.js';
import { generateToken } from '../utils/verifyToken.js';

// User registration
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, password2 } = req.body;
  if (!firstName || !lastName || !email || !password || !password2) {
    res.json({
      message: 'All fields are required',
      success: false,
      status: 401,
    });
    return;
  }
  if (password.length < 6) {
    res.json({
      message: 'password must be minimum of 6 characters',
      success: false,
      status: 401,
    });
    return;
  }
  if (password !== password2) {
    res.json({
      message: 'Password do not match',
      success: false,
      status: 401,
    });
    return;
  }
  let user = await User.findOne({ email });
  if (user) {
    res.json({
      message: 'This email already exist',
      success: false,
      status: 401,
    });
    return;
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    }).save();

    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString('hex'),
    }).save();

    const link = `${process.env.BACKEND_URL}/auth/confirm/${token.token}/${user._id}`;
    console.log('token:', token.token);

    await verifyEmail(user.email, link);

    res.json({
      message: 'Verification mail sent, check your mail...',
      status: 200,
    });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

// Email verification
const verifyUser = async (req, res) => {
  const { token, id } = req.params;
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      res.json({
        message: 'Invalid Link',
        status: 401,
      });
      return;
    }
    const confirmToken = await Token.findOne({
      userId: user._id,
      token,
    });

    if (!confirmToken) {
      return res.json({
        message: 'Invalid Link',
        status: 401,
      });
    }

    await User.updateOne(
      {
        _id: confirmToken.userId,
      },
      {
        $set: { isVerified: 'true' },
      }
    );

    await Token.findByIdAndRemove(confirmToken);
    return res.json({
      message: 'Email verified successfully, you can now login...',
      status: 200,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// User login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      message: 'All fields are required',
      status: 401,
      success: false,
    });
  }
  if (password.length < 6) {
    return res.json({
      message: 'Password must be minimum of 6 characters',
      status: 401,
      success: false,
    });
  }
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message: 'Email does not exist',
        status: 401,
        success: false,
      });
    }
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.json({
        message: 'Invalid credentials',
        status: 401,
        success: false,
      });
    }

    if (user.isVerified === false) {
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString('hex'),
        }).save();
        const link = `${process.env.BACKEND_URL}/auth/confirm/${token.token}/${user._id}`;
        await verifyEmail(user.email, link);
        return res.json({
          message: 'Please visit your email and verify',
          status: 401,
          success: false,
        });
      }
      return res.json({
        message: 'Verify the mail sent to your email',
        status: 401,
        success: false,
      });
    }

    const { password: hashedPassword, ...others } = user._doc;

    generateToken(res, user._id);
    res.json({
      message: 'Login Successful',
      others,
      status: 201,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// User logout
const userLogout = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.json({
      message: 'Invalid token',
      status: 401,
      success: false,
    });
  }
  res.clearCookie('access_token').json({
    message: 'logout successful',
    success: true,
    status: 201,
  });
  console.log(res.json());
};

// Get user
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.json({
      status: 200,
      others,
    });
  } catch (error) {
    console.log(error);
  }
};

export { getUser, registerUser, verifyUser, loginUser, userLogout };
