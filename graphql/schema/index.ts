import { buildSchema } from 'graphql';

export default buildSchema(`
  type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: User!
  }

  input EventInput {
    _id: ID
    title: String!
    description: String!
    price: Float!
    date: String
    creator: ID
  }

  type User {
    _id: ID!
    email: String
    password: String
    createdEvents: [Event]
  }

  input UserInput {
    email: String!
    password: String!
    createdEvents: ID
  }

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }

  type RootQuery {
    events: [Event!]!
    users: [User!]!
    bookings: [Booking!]!
    login(email: String!, password: String!): AuthData!
  }

  type RootMutation{
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
  `);
