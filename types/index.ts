import { NextFunction, Request, Response } from 'express';

export interface CustomReq extends Request {
  body: { [key: string]: string | undefined };
  isAuth: boolean;
  userId: string;
}
export interface Res extends Response {}
export interface NextFunc extends NextFunction {}

export type BookingType = {
  _id: string;
  event: {
    _doc: EventType | Promise<EventType> | any;
  };
  user: {
    _doc: UserType | Promise<UserType> | any;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type EventType = {
  _id: string;
  title: string;
  description: string;
  price: number;
  date: Date;
  creator: UserType | Promise<UserType> | any;
};

export type UserType = {
  _id: string;
  email: string;
  password: string;
  createdEvents: EventType | Promise<EventType> | any;
};

export type LoginInput = {
  email: string;
  password: string;
};
