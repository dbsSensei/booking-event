import DataLoader from 'dataloader';
import Event from '../../models/event';
import User from '../../models/user';
import { EventType, UserType } from '../../types';

const eventLoader = new DataLoader<any, any, any>((eventIds) => {
  return bindEvents(eventIds);
});

const userLoader = new DataLoader<any, any, any>((userIds) => {
  return User.find({ _id: { $in: userIds } });
});

export const bindEvents = async (eventsIds: any) => {
  try {
    if (!eventsIds) throw new Error('Please input required fields');

    const events = await Event.find({
      _id: { $in: eventsIds },
    });

    events.sort(
      (a: any, b: any) =>
        eventsIds.indexOf(a._id.toString()) -
        eventsIds.indexOf(b._id.toString())
    );

    return events.map((event: { _doc: EventType }) => {
      return {
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: userLoader.load.bind(this, event._doc.creator),
      };
    });
  } catch (err) {
    return err;
  }
};

export const bindSingleEvent = async (eventId: any) => {
  try {
    const event: { _doc: EventType } = await eventLoader.load(
      eventId.toString()
    );

    return event;
  } catch (err) {
    return err;
  }
};

export const bindUser = async (userId: any) => {
  try {
    const userResult: { _doc: UserType } = await userLoader.load(
      userId.toString()
    );

    return {
      ...userResult._doc,
      password: '',
      createdEvents: () => eventLoader.loadMany(userResult._doc.createdEvents),
    };
  } catch (err) {
    return err;
  }
};
