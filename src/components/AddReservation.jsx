// components/AddReservationForm.js
import React, {useState} from "react";
import {addReservation} from "../scripts/api";

export default function AddReservationForm() {
  const [chargerId, setChargerId] = useState("");
  const [timeBlock, setTimeBlock] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await addReservation(Number(chargerId), timeBlock);
      const result = await response.json();
      if (response.ok) {
        setMessage("Reservation added successfully!");
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-w-max">
      <div className="flex flex-col items-center space-y-6 p-6 bg-white shadow-lg rounded-lg max-w-md w-full mx-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Add Reservation
        </h2>
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="flex flex-col">
            <label htmlFor="chargerId" className="text-gray-700 font-medium">
              Charger ID:
            </label>
            <input
              type="number"
              id="chargerId"
              value={chargerId}
              onChange={(e) => setChargerId(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="timeBlock" className="text-gray-700 font-medium">
              Time Block:
            </label>
            <input
              type="text"
              id="timeBlock"
              value={timeBlock}
              onChange={(e) => setTimeBlock(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300">
            Add Reservation
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center font-medium ${response.ok ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}