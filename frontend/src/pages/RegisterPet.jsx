import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const RegisterPet = () => {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [petData, setPetData] = useState({
        name: '',
        species: '',
        breed: '',
        age: '',
        gender: 'Male',
        weight: '',
        allergies: [],
        vaccinations: []
    });
    
    const [newVaccination, setNewVaccination] = useState({ 
        name: '', 
        date: '', 
        nextDueDate: '' 
    });
    const [newAllergy, setNewAllergy] = useState('');

    const addVaccination = () => {
        if (newVaccination.name && newVaccination.date) {
            // Create a new vaccination object with proper date formatting
            const formattedVaccination = {
                name: newVaccination.name,
                date: new Date(newVaccination.date).toISOString(),
                nextDueDate: newVaccination.nextDueDate ? 
                    new Date(newVaccination.nextDueDate).toISOString() : null
            };

            setPetData(prevData => ({
                ...prevData,
                vaccinations: [...prevData.vaccinations, formattedVaccination]
            }));
            
            // Reset the form
            setNewVaccination({ name: '', date: '', nextDueDate: '' });
        }
    };

    const removeVaccination = (index) => {
        setPetData(prevData => ({
            ...prevData,
            vaccinations: prevData.vaccinations.filter((_, i) => i !== index)
        }));
    };

    const addAllergy = () => {
        if (newAllergy) {
            setPetData({
                ...petData,
                allergies: [...petData.allergies, newAllergy]
            });
            setNewAllergy('');
        }
    };

    const removeAllergy = (index) => {
        setPetData({
            ...petData,
            allergies: petData.allergies.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');

            // Check if userId exists and is not "undefined"
            if (!userId || userId === "undefined") {
                toast.error('Please login first');
                navigate('/login');
                return;
            }

            // Create the submission data with the userId included
            const submissionData = {
                ...petData,
                userId: userId, // Ensure userId is properly set
                age: Number(petData.age),
                weight: Number(petData.weight),
                vaccinations: petData.vaccinations || [],
                allergies: petData.allergies || []
            };

            // Debug log to verify the data
            console.log('Submitting pet data:', submissionData);
            
            const response = await axios.post(
                `${backendUrl}/api/user/register-pet`,
                submissionData,
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`, // Changed from 'token' to 'Authorization'
                        'Content-Type': 'application/json'
                    } 
                }
            );

            if (response.data.success) {
                toast.success('Pet registered successfully');
                navigate('/my-pets');
            } else {
                toast.error(response.data.message || 'Failed to register pet');
            }
        } catch (error) {
            console.error('Registration error:', error);
            // If the error is due to authentication
            if (error.response?.status === 401) {
                toast.error('Please login again');
                localStorage.clear(); // Clear storage on auth error
                navigate('/login');
                return;
            }
            toast.error(error.response?.data?.message || 'Failed to register pet');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="m-5 w-full max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Register New Pet</h2>
            
            <div className="space-y-4">
                {/* Basic Information */}
                <div className="space-y-4">
                    <div>
                        <label className="block mb-1">Pet Name</label>
                        <input
                            type="text"
                            value={petData.name}
                            onChange={(e) => setPetData({...petData, name: e.target.value})}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Species</label>
                        <input
                            type="text"
                            value={petData.species}
                            onChange={(e) => setPetData({...petData, species: e.target.value})}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Breed</label>
                        <input
                            type="text"
                            value={petData.breed}
                            onChange={(e) => setPetData({...petData, breed: e.target.value})}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block mb-1">Age (years)</label>
                            <input
                                type="number"
                                value={petData.age}
                                onChange={(e) => setPetData({...petData, age: e.target.value})}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1">Gender</label>
                            <select
                                value={petData.gender}
                                onChange={(e) => setPetData({...petData, gender: e.target.value})}
                                className="w-full p-2 border rounded"
                            >
                                <option>Male</option>
                                <option>Female</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1">Weight (kg)</label>
                            <input
                                type="number"
                                value={petData.weight}
                                onChange={(e) => setPetData({...petData, weight: e.target.value})}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Vaccinations Section */}
                <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-3">Vaccinations</h3>
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Vaccination name"
                                value={newVaccination.name}
                                onChange={(e) => setNewVaccination({...newVaccination, name: e.target.value})}
                                className="flex-1 p-2 border rounded"
                            />
                            <input
                                type="date"
                                value={newVaccination.date}
                                onChange={(e) => setNewVaccination({...newVaccination, date: e.target.value})}
                                className="flex-1 p-2 border rounded"
                            />
                            <button
                                type="button"
                                onClick={addVaccination}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Add
                            </button>
                        </div>
                        
                        {petData.vaccinations.map((vac, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <span>{vac.name} - {new Date(vac.date).toLocaleDateString()}</span>
                                <button
                                    type="button"
                                    onClick={() => removeVaccination(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Allergies Section */}
                <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-3">Allergies</h3>
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Add allergy"
                                value={newAllergy}
                                onChange={(e) => setNewAllergy(e.target.value)}
                                className="flex-1 p-2 border rounded"
                            />
                            <button
                                type="button"
                                onClick={addAllergy}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Add
                            </button>
                        </div>
                        
                        {petData.allergies.map((allergy, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <span>{allergy}</span>
                                <button
                                    type="button"
                                    onClick={() => removeAllergy(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                >
                    Register Pet
                </button>
            </div>
        </form>
    );
};

export default RegisterPet;
