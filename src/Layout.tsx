import { Button } from "@mantine/core";
import { useMemo, useState } from "react";
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
} from "react-beautiful-dnd";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { TbGripVertical } from "react-icons/tb";
import { FaRegFileAlt } from "react-icons/fa";
import { TbBriefcase2 } from "react-icons/tb";

const initialUsers = [
    { id: 1, name: "Sumit", role: "Accountant", city: "Kathmandu" },
    { id: 2, name: "Hari", role: "Project Manager", city: "Kathmandu" },
    { id: 3, name: "Rajan", role: "Cook", city: "Kathmandu" },
    { id: 4, name: "Sham", role: "HR", city: "Lalitpur" },
    { id: 5, name: "John", role: "CEO", city: "Lalitpur" },
    { id: 6, name: "Sever", role: "Accountant", city: "Lalitpur" },
];

type User = {
    id: number;
    name: string;
    role: string;
    city: string;
};

enum City {
    Kathmandu = "Kathmandu",
    Lalitpur = "Lalitpur",
}

function Layout() {
    const [openCity, setOpenCity] = useState<City | "">(City.Kathmandu);
    const [displayedUsers, setDisplayedUsers] = useState<Record<string, User[]>>({
        [City.Kathmandu]: [],
        [City.Lalitpur]: [],
    });

    const toggleCity = (city: City) => {
        setOpenCity(openCity === city ? "" : city);
    };
    const [showJSON, setShowJSON] = useState(false);
    const handleDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!source || !destination) return;

        const sourceCity = source.droppableId;
        const destCity = destination.droppableId;

        const sourceUsers =
            sourceCity === "droppable-1"
                ? availableUsers
                : Array.from(displayedUsers[sourceCity]);
        const destUsers =
            destCity === "droppable-1"
                ? availableUsers
                : Array.from(displayedUsers[destCity]);

        const [movedUser] = sourceUsers.splice(source.index, 1);

        destUsers.splice(destination.index, 0, movedUser);

        if (sourceCity === "droppable-1") {
            setDisplayedUsers((prev) => ({
                ...prev,
                [destCity]: destUsers,
            }));
        } else if (destCity === "droppable-1") {
            setDisplayedUsers((prev) => ({
                ...prev,
                [sourceCity]: sourceUsers,
            }));
        } else {
            setDisplayedUsers((prev) => ({
                ...prev,
                [sourceCity]: sourceUsers,
                [destCity]: destUsers,
            }));
        }
    };

    const getUsersByCity = (city: string) => displayedUsers[city];

    const availableUsers = useMemo(() => {
        const allUsersInCities = Object.values(displayedUsers).flat();
        const available = initialUsers.filter(
            (user) => !allUsersInCities.some((u) => u.id === user.id)
        );
        if (openCity) {
            return available.filter((user) => user.city === openCity || user.city === "");
        }
        return available;
    }, [displayedUsers, openCity]);

    const handleDeleteUser = (userId: number, city: string) => {
        setDisplayedUsers((prev) => {
            const updatedCityUsers = prev[city].filter((user) => user.id !== userId);
            return {
                ...prev,
                [city]: updatedCityUsers,
            };
        });
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex flex-col md:flex-row gap-4 p-4">
                <div className="rounded-md shadow-custom p-4 w-full md:w-2/3">
                    <h2 className=" text-left text-xl font-bold text-gray-800 mb-4">
                        Create User By City
                    </h2>

                    {[City.Kathmandu, City.Lalitpur].map((city) => (
                        <div className="border rounded-md p-4 mb-4" key={city}>
                            <div
                                className="flex justify-between items-center mb-2 cursor-pointer"
                                onClick={() => toggleCity(city)}
                            >
                                <span className="font-semibold">City: {city}</span>
                                <div className="flex items-center">
                                    <FaRegFileAlt className="mr-4" />
                                    <span className="text-sm pr-4">
                                        {getUsersByCity(city).length} Users
                                    </span>
                                    {openCity === city ? <FiChevronUp /> : <FiChevronDown />}
                                </div>
                            </div>
                            {openCity === city && (
                                <>
                                    {getUsersByCity(city).map((user) => (
                                        <div
                                            className="flex items-center p-2 border rounded-md mb-2"
                                            key={user.id}
                                        >
                                            <div className="flex flex-col items-start pl-4">
                                                <p className="font-semibold text-customTextColor">{user.name}</p>
                                                <div className="flex flex-row items-center gap-2">
                                                    <TbBriefcase2 />
                                                    <p className="text-sm text-gray-500">{user.role}</p>
                                                </div>
                                            </div>
                                            <MdDelete
                                                className="ml-auto cursor-pointer"
                                                onClick={() => handleDeleteUser(user.id, city)}
                                            />
                                        </div>
                                    ))}
                                    <Droppable droppableId={city}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                className="border-dashed border-2 border-custom p-4 text-center text-gray-500 mb-4"
                                                {...provided.droppableProps}
                                            >
                                                Drag Items from the User list here
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>

                                </>
                            )}
                        </div>
                    ))}

                    <Button onClick={() => setShowJSON((prev) => !prev)} className="w-full h-8 bg-customBg text-white">
                        Create user by city
                    </Button>
                    {showJSON && (
                        <pre className="mt-4 bg-gray-100 p-2 rounded-md">
                            {JSON.stringify(displayedUsers, null, 2)}
                        </pre>
                    )}
                </div>
                <div className="w-full md:w-1/3">
                    <h3 className="text-left text-lg font-bold mb-4">User List</h3>

                    <Droppable droppableId="droppable-1">
                        {(provided) => (
                            <div
                                className="space-y-4"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {availableUsers.map((user, index) => (
                                    <Draggable
                                        key={user.id}
                                        draggableId={user.id.toString()}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <div
                                                className="flex items-center rounded-lg p-2 gap-4 bg-white"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <TbGripVertical />
                                                <div className="flex flex-col items-start pl-4">
                                                    <p className="font-semibold text-customTextColor">{user.name}</p>
                                                    <div className="flex flex-row items-center gap-2">
                                                        <TbBriefcase2 />
                                                        <p className="text-sm text-gray-500">{user.role}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            </div>
        </DragDropContext>
    );
}

export default Layout;
