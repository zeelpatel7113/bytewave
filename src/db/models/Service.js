import mongoose from "mongoose";

const benefitSchema = new mongoose.Schema(
  {
    point: {
      type: String,
      required: [true, "Benefit point is required"],
      trim: true,
    },
  },
  { _id: false }
);

const serviceSchema = new mongoose.Schema(
  {
    serviceId: {
      // Added for easy service lookup
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      unique: true,
    },
    overview: {
      type: String,
      required: [true, "Overview is required"],
      trim: true,
    },
    keyBenefits: {
      type: [benefitSchema],
      validate: {
        validator: function (benefits) {
          return benefits.length > 0 && benefits.length <= 4;
        },
        message: "Key benefits must have between 1 and 4 points",
      },
    },
    approach: {
      type: String,
      required: [true, "Approach is required"],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
    },
    serviceType: {
      type: String,
      default: "Service",
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
      required: true,
      default: "Bytewave Admin",
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add slug virtual
serviceSchema.virtual("slug").get(function () {
  return this.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
});

// Ensure virtual fields are included when converting to JSON
serviceSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    ret._id = ret._id.toString(); // Convert ObjectId to string but don't delete it
    return ret;
  }
});

const Service =
  mongoose.models.Service || mongoose.model("Service", serviceSchema);

export default Service;
