import Hotel from "../models/HotelModel.js";
import { createError } from "../utils/error.js";

export const createHotel = async (req, res) => {
  const newHotel = new Hotel(req.body);
  console.log(req.body);
  try {
    const savedHotel = await newHotel.save();
    res.status(201).json(savedHotel);
  } catch (err) {
    res.status(409).json(err);
  }
};

// ===CREATE ROOMS IN HOTEL===
export const createRoom = async (req, res, next) => {
  try {
    const newRoom = await Hotel.findByIdAndUpdate(req.params.hotelId, {
      $push: { rooms: req.body },
    });

    res.status(200).json(newRoom);
  } catch (err) {
    next(createError(409, "you cant create Room"));
  }
};
export const getHotels = async (req, res, next) => {
  const { min, max, city, type, ...others } = req.query;

  try {
    const searchCity = new RegExp(city, "i");
    const searchType = new RegExp(type, "i");

    const hotels = await Hotel.find({
      ...others,
      city: searchCity,
      type: searchType,
      price: { $gte: min || 0, $lte: max || 1.797693134862316e308 },
    });
    res.status(200).json(hotels);
  } catch (err) {
    next(createError(401, "error making get request", "i hope it works"));
  }
};

// ===GET BY ID====
export const get = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (err) {
    res.status(404).json(err);
    console.log(err);
  }
};

export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");

  try {
    const list = await Promise.all(
      cities.map((p) => Hotel.countDocuments({ city: p }))
    );
    // const ndu = await Promise.all(cities.map((p) => Hotel.find({ city: p })));
    res.status(200).json(list);

    //  ====ANOTHER YOU CAN DO THE ABOVE IF YOU DONT WANT TO MAP D ARRAY

    // const ph = await Hotel.countDocuments({ city: cities[0] });
    // const enugu = await Hotel.countDocuments({ city: cities[1] });
    // const abuja = await Hotel.countDocuments({ city: cities[2] });
    // res.status(200).json(
    //   [
    //     { city: cities[0], count: ph },
    //     { city: cities[1], count: enugu },
    //     { city: cities[2], count: abuja },
    //   ]
    // );
  } catch (err) {
    next(createError(401, "error counting by city"));
  }
};

export const countByType = async (req, res, next) => {
  // const ndu = ["Hotel", "Apartment", "Resort"];

  try {
    // ===YOU CAN DO THIS USING TWO METHODS, using any method depend on your choice

    // =====FIRST METHOD by MAPPING THE ARRAY====
    // const hello = await Promise.all(
    //   ndu.map((p) => Hotel.countDocuments({ type: p }))
    // );

    // res.status(200).json([
    //   { type: "hotel", count: hello[0] },
    //   { type: "apartment", count: hello[1] },
    //   { type: "resort", count: hello[2] },
    // ]);

    // ======SECOND METHOD==========

    const hotelCount = await Hotel.countDocuments({ type: "Hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "Apartment" });
    const resortCount = await Hotel.countDocuments({ type: "Resort" });

    res.status(200).json([
      { type: "Hotel", count: hotelCount },
      { type: "Apartment", count: apartmentCount },
      { type: "Resort", count: resortCount },
    ]);
  } catch (err) {
    next(createError(401, "error counting by type"));
  }
};

export const getRooms = async (req, res, next) => {
  const { id } = req.params;
  console.log(id);

  try {
    const hotel = await Hotel.findById(id);

    const list = await Promise.all(
      hotel.rooms.map((room) => Room.findById(room))
    );
    console.log(list);

    res.status(200).json(list);
  } catch (error) {
    next(createError(401, "error getting room"));
  }
};

export const updateHotel = async (req, res) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedHotel);
  } catch (err) {
    next(createError(405, "error updating Hotel"));
  }
};

export const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);

    res.status(200).json("hotel has been deleted");
  } catch (err) {
    next(createError(401, "sorry you cant delete this"));
  }
};

export const updateRoomAvailability = async (req, res, next) => {
  try {
    await Hotel.updateOne(
      { "rooms._id": req.params.id },
      {
        $push: {
          "rooms.$.unavailableDates": req.body.dates,
        },
      }
    );
    res.status(200).json("Seat booking status has been updated.");
  } catch (err) {
    next(err);
  }
};

export const deleteRoom = async (req, res, next) => {
  const hotelId = req.params.hotelId;

  try {
    await Hotel.findByIdAndUpdate(hotelId, {
      $pull: { rooms: req.params.id },
    });

    res.status(200).json("Room has been deleted");
  } catch (err) {
    next(createError(401, "sorry you cant delete this"));
  }
};
