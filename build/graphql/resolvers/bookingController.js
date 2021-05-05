"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelBooking = exports.bookEvent = exports.bookings = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const event_1 = __importDefault(require("../../models/event"));
const booking_1 = __importDefault(require("../../models/booking"));
const bindSchema_1 = require("./bindSchema");
const bookings = (args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.isAuth)
            throw new Error('Unauthenticated!');
        const bookings = yield booking_1.default.find({
            user: mongoose_1.default.Types.ObjectId(req.userId),
        });
        return bookings.map((booking) => {
            return Object.assign(Object.assign({}, booking._doc), { user: bindSchema_1.bindUser.bind(this, booking._doc.user), event: bindSchema_1.bindSingleEvent.bind(this, booking._doc.event), createdAt: new Date(booking._doc.createdAt).toISOString(), updatedAt: new Date(booking._doc.updatedAt).toISOString() });
        });
    }
    catch (err) {
        return err;
    }
});
exports.bookings = bookings;
const bookEvent = (args, req) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAuth)
        throw new Error('Unauthenticated!');
    try {
        const { eventId } = args;
        if (!eventId)
            throw new Error('Please input required field!');
        const fetchedEvent = yield event_1.default.findOne({ _id: eventId });
        const booking = new booking_1.default({
            user: req.userId,
            event: fetchedEvent,
        });
        const result = yield booking.save();
        return Object.assign(Object.assign({}, result._doc), { user: bindSchema_1.bindUser.bind(this, booking._doc.user), event: bindSchema_1.bindSingleEvent.bind(this, booking._doc.event), createdAt: new Date(result._doc.createdAt).toISOString(), updatedAt: new Date(result._doc.updatedAt).toISOString() });
    }
    catch (err) {
        return err;
    }
});
exports.bookEvent = bookEvent;
const cancelBooking = (args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.isAuth)
            throw new Error('Unauthenticated!');
        const { bookingId } = args;
        if (!bookingId)
            throw new Error('Please input required field!');
        const booking = yield booking_1.default.findById(bookingId).populate('event');
        const event = Object.assign(Object.assign({}, booking.event._doc), { creator: bindSchema_1.bindUser.bind(this, booking.event._doc.creator) });
        yield booking_1.default.deleteOne({ _id: bookingId });
        return event;
    }
    catch (err) {
        return err;
    }
});
exports.cancelBooking = cancelBooking;
