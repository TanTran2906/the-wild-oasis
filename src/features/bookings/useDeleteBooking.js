import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBooking } from "../../services/apiBookings";
import { toast } from "react-hot-toast";

function useDeleteBooking() {
    const queryClient = useQueryClient();

    const { isLoading: isDeleting, mutate: deleteBookingMutate } = useMutation({
        mutationFn: deleteBooking,
        onSuccess: () => {
            toast.success("Booking successfully deleted");

            queryClient.invalidateQueries({
                queryKey: ["bookings"],
            });
        },
        onError: (err) => toast.error(err.message),
    });
    return { isDeleting, deleteBookingMutate }
}

export default useDeleteBooking
