import { useState } from "react";
import ReservationsList from "../components/reservations-list";
import AddReservation from "../components/add-reservation";
import { useReservations } from "../components/useReservations";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DashboardPage = () => {
  const {
    reservations,
    isLoading,
    error,
    addReservation,
    removeReservation
  } = useReservations();
  
  // State for delete-specific error handling
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id) => {
    try {
      setDeleteError(null);
      await removeReservation(id);
    } catch (err) {
      setDeleteError(`Failed to delete reservation: ${err.message}`);
    }
  };

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {deleteError && (
        <Alert variant="destructive" className="md:col-span-2">
          <AlertDescription>{deleteError}</AlertDescription>
        </Alert>
      )}
      
      <ReservationsList
        reservations={reservations}
        isLoading={isLoading}
        error={error}
        onDelete={handleDelete}
      />
      
      <AddReservation
        onSubmit={addReservation}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DashboardPage;