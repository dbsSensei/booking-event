import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../../models/user';
import { EventType, UserType, LoginInput } from '../../types';
import { bindEvents } from './bindSchema';

export const users = async (): Promise<void | EventType> => {
  try {
    const users: any = await User.find({});
    return users.map((user: { _doc: UserType }) => {
      return {
        ...user._doc,
        password: '',
        createdEvents: bindEvents.bind(this, user._doc.createdEvents),
      };
    });
  } catch (err) {
    return err;
  }
};
export const createUser = async ({
  userInput,
}: {
  [key: string]: UserType;
}): Promise<UserType> => {
  try {
    const { email, password } = userInput;

    const fetchedUser = await User.findOne({ email });

    if (fetchedUser) throw new Error('User already exists!');

    const hashedPassword = await bcrypt.hash(password, 12);

    if (email.length < 1 && password.length < 1)
      throw new Error('Please input required fields!');
    const user = new User({
      email,
      password: hashedPassword,
    });

    const result = await user.save();

    return { ...result._doc, password: '' };
  } catch (err) {
    return err;
  }
};

export const login = async ({ email, password }: LoginInput) => {
  try {
    const user: UserType = await User.findOne({ email });
    if (!user) {
      throw new Error('Data is invalid!');
    }

    const isEqualPassword = await bcrypt.compare(password, user.password);
    if (!isEqualPassword) {
      throw new Error('Data is invalid!');
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      'supersecretkey',
      {
        expiresIn: '1h',
      }
    );

    return { userId: user._id, token, tokenExpiration: 1 };
  } catch (err) {
    return err;
  }
};
