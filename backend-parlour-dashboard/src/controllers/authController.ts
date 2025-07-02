import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../middlewares/auth';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  
  console.log('Login attempt:', { email, password: '***' });
  
  try {
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('User not found for email:', email);
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    
    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );
    
    console.log('JWT token generated successfully');
    
    res.cookie('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });
    
    console.log('Login successful for user:', email);
    
    res.json({ 
      message: 'Login successful',
      user: { 
        _id: user._id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const me = async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({ 
    user: req.user,
    tokenData: {
      userId: req.user?._id,
      role: req.user?.role,
      jwtWorking: true
    }
  });
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('auth-token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.json({ message: 'Logged out successfully' });
}; 