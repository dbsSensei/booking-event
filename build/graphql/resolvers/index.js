"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bookingController_1 = require("./bookingController");
const eventController_1 = require("./eventController");
const userController_1 = require("./userController");
exports.default = {
    bookings: bookingController_1.bookings,
    bookEvent: bookingController_1.bookEvent,
    cancelBooking: bookingController_1.cancelBooking,
    events: eventController_1.events,
    createEvent: eventController_1.createEvent,
    users: userController_1.users,
    createUser: userController_1.createUser,
    login: userController_1.login,
};
