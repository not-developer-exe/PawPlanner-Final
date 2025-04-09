import petModel from "../models/petModel.js";

const registerPet = async (req, res) => {
    try {
        // Log the incoming request body
        console.log('Received request body:', req.body);
        
        // Extract userId from auth middleware
        const userId = req.body.userId;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const {
            name,
            species,
            breed,
            age,
            gender,
            weight,
            vaccinations = [], // Default to empty array if not provided
            allergies = []     // Default to empty array if not provided
        } = req.body;

        // Validate required fields
        if (!name || !species || !breed || !age || !gender || !weight) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                missingFields: {
                    name: !name,
                    species: !species,
                    breed: !breed,
                    age: !age,
                    gender: !gender,
                    weight: !weight
                }
            });
        }

        // Create the pet document
        const petData = {
            userId,
            name,
            species,
            breed,
            age: Number(age),
            gender,
            weight: Number(weight),
            vaccinations: vaccinations.map(vac => ({
                name: vac.name,
                date: new Date(vac.date),
                nextDueDate: vac.nextDueDate ? new Date(vac.nextDueDate) : null
            })),
            allergies
        };

        console.log('Creating new pet with data:', petData);

        const newPet = new petModel(petData);
        await newPet.save();

        res.status(201).json({
            success: true,
            message: 'Pet registered successfully',
            pet: newPet
        });

    } catch (error) {
        console.error('Error in registerPet:', error);
        res.status(500).json({
            success: false,
            message: error.message,
            error: error.toString()
        });
    }
};

export { registerPet };
