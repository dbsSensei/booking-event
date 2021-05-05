import Event from '../../models/event';
import User from '../../models/user';
import { EventType } from '../../types';
import { bindUser } from './bindSchema';

import { CustomReq } from '../../types';

export const events = async (): Promise<EventType> => {
  try {
    const events: any = await Event.find({});
    return events.map((event: { _doc: EventType }) => {
      const results = {
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: bindUser.bind(this, event._doc.creator),
      };

      return results;
    });
  } catch (err) {
    return err;
  }
};

export const createEvent = async (
  {
    eventInput,
  }: {
    [key: string]: EventType;
  },
  req: CustomReq
): Promise<EventType> => {
  try {
    if (!req.isAuth) throw new Error('Unauthenticated!');

    const { title, description, price } = eventInput;

    const fetchedEvent = await Event.findOne({ title });

    if (fetchedEvent) throw new Error('Event already exists!');

    if (title.length < 1 && description.length < 1 && price < 1)
      throw new Error('Please input required field!');

    const event = new Event({
      title,
      description,
      price,
      date: new Date(),
      creator: req.userId,
    });

    const user = await User.findById(req.userId);
    if (!user) throw new Error('User creator not found');

    user.createdEvents.push(event);

    const result = await event.save();
    await user.save();

    return { ...result._doc, date: new Date().toISOString() };
  } catch (err) {
    return err;
  }
};
