import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const MyPets = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/user/pets`,
                { headers: { token: localStorage.getItem('token') } }
            );

            if (data.success) {
                setPets(data.pets);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to fetch pets');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Pets</h1>
                <Link 
                    to="/register-pet"
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Register New Pet
                </Link>
            </div>

            {pets.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500">No pets registered yet.</p>
                    <Link 
                        to="/register-pet"
                        className="text-primary hover:underline"
                    >
                        Register your first pet
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pets.map((pet) => (
                        <div 
                            key={pet._id}
                            className="bg-white p-6 rounded-lg shadow-md"
                        >
                            <h2 className="text-xl font-semibold mb-2">{pet.name}</h2>
                            <div className="space-y-2 text-gray-600">
                                <p>Species: {pet.species}</p>
                                <p>Breed: {pet.breed}</p>
                                <p>Age: {pet.age} years</p>
                                <p>Gender: {pet.gender}</p>
                                <p>Weight: {pet.weight} kg</p>
                            </div>
                            
                            {pet.vaccinations.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="font-semibold">Vaccinations</h3>
                                    <ul className="list-disc list-inside">
                                        {pet.vaccinations.map((vac, index) => (
                                            <li key={index}>
                                                {vac.name} - {new Date(vac.date).toLocaleDateString()}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            
                            {pet.allergies.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="font-semibold">Allergies</h3>
                                    <ul className="list-disc list-inside">
                                        {pet.allergies.map((allergy, index) => (
                                            <li key={index}>{allergy}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPets;