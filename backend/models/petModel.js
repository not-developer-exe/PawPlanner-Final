import mongoose from "mongoose";

const vaccinationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    nextDueDate: { type: Date }
});

const petSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        required: true,
        index: true // Add index for better query performance
    },
    name: { 
        type: String, 
        required: true,
        trim: true
    },
    species: { 
        type: String, 
        required: true,
        trim: true
    },
    breed: { 
        type: String, 
        required: true,
        trim: true
    },
    age: { 
        type: Number, 
        required: true,
        min: 0
    },
    gender: { 
        type: String, 
        required: true,
        enum: ['Male', 'Female']
    },
    weight: { 
        type: Number, 
        required: true,
        min: 0
    },
    vaccinations: [vaccinationSchema],
    allergies: [String],
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

const Pet = mongoose.models.pet || mongoose.model("pet", petSchema);

export default Pet;
