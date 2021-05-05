import mongoose from 'mongoose';
import Event from '../../models/event';
import Booking from '../../models/booking';
import { BookingType, CustomReq, EventType } from '../../types';
import { bindSingleEvent, bindUser } from './bindSchema';

export const bookings = async (
  args: {
    [key: string]: string;
  },
  req: CustomReq
): Promise<BookingType> => {
  try {
    if (!req.isAuth) throw new Error('Unauthenticated!');

    const bookings = await Booking.find({
      user: mongoose.Types.ObjectId(req.userId),
    });

    return bookings.map((booking: { _doc: BookingType }) => {
      return {
        ...booking._doc,
        user: bindUser.bind(this, booking._doc.user),
        event: bindSingleEvent.bind(this, booking._doc.event),
        createdAt: new Date(booking._doc.createdAt).toISOString(),
        updatedAt: new Date(booking._doc.updatedAt).toISOString(),
      };
    });
  } catch (err) {
    return err;
  }
};
export const bookEvent = async (
  args: {
    eventId: string;
  },
  req: CustomReq
): Promise<BookingType> => {
  if (!req.isAuth) throw new Error('Unauthenticated!');

  try {
    const { eventId } = args;
    if (!eventId) throw new Error('Please input required field!');

    const fetchedEvent: EventType = await Event.findOne({ _id: eventId });

    const booking = new Booking({
      user: req.userId,
      event: fetchedEvent,
    });

    const result = await booking.save();

    return {
      ...result._doc,
      user: bindUser.bind(this, booking._doc.user),
      event: bindSingleEvent.bind(this, booking._doc.event),
      createdAt: new Date(result._doc.createdAt).toISOString(),
      updatedAt: new Date(result._doc.updatedAt).toISOString(),
    };
  } catch (err) {
    return err;
  }
};
export const cancelBooking = async (
  args: {
    bookingId: string;
  },
  req: CustomReq
): Promise<EventType> => {
  try {
    if (!req.isAuth) throw new Error('Unauthenticated!');

    const { bookingId } = args;
    if (!bookingId) throw new Error('Please input required field!');

    const booking: { event: { _doc: EventType } } = await Booking.findById(
      bookingId
    ).populate('event');
    const event: EventType = {
      ...booking.event._doc,
      creator: bindUser.bind(this, booking.event._doc.creator),
    };

    await Booking.deleteOne({ _id: bookingId });
    return event;
  } catch (err) {
    return err;
  }
};
