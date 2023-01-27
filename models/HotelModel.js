import mongoose from "mongoose";

const hotelSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    type: {
      type: String,
    },
    city: {
      type: String,
    },

    address: {
      type: String,
    },

    photos: {
      type: [String],
    },

    description: {
      type: String,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    rooms: [
      {
        roomNumber: {
          type: Number,
        },
        unavailableDates: { type: [Date] },
        title: {
          type: String,
        },

        price: {
          type: Number,
        },
        maxPeople: {
          type: Number,
        },

        description: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);
const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;

// export default mongoose.model("Hotel", HotelSchema);
