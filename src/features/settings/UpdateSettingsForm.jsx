import Form from "../../ui/Form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Spinner from "../../ui/Spinner";
import { getSettings, updateSetting } from "../../services/apiSettings";
import { toast } from "react-hot-toast";

function UpdateSettingsForm() {
    const {
        isLoading,
        data: settings = {},
        // error,
    } = useQuery({
        queryKey: ["settings"],
        queryFn: getSettings,
    });

    const queryClient = useQueryClient();

    const { mutate, isLoading: isUpdating } = useMutation({
        mutationFn: updateSetting,
        onSuccess: () => {
            toast.success("Setting successfully edited");

            queryClient.invalidateQueries({ queryKey: ["settings"] });
        },
        onError: (err) => toast.error(err.message),
    });

    const {
        minBookingLength,
        maxBookingLength,
        maxGuestsPerBooking,
        breakfastPrice,
    } = settings;

    if (isLoading) return <Spinner />;

    function handleUpdate(e, field) {
        const { value } = e.target;

        if (!value) return;

        mutate({ [field]: value });
    }

    return (
        <Form>
            <FormRow label="Minimum nights/booking">
                <Input
                    type="number"
                    id="min-nights"
                    defaultValue={minBookingLength}
                    disabled={isUpdating}
                    onBlur={(e) => handleUpdate(e, "minBookingLength")}
                />
            </FormRow>
            <FormRow label="Maximum nights/booking">
                <Input
                    type="number"
                    id="max-nights"
                    defaultValue={maxBookingLength}
                    disabled={isUpdating}
                    onBlur={(e) => handleUpdate(e, "maxBookingLength")}
                />
            </FormRow>
            <FormRow label="Maximum guests/booking">
                <Input
                    type="number"
                    id="max-guests"
                    defaultValue={maxGuestsPerBooking}
                    disabled={isUpdating}
                    onBlur={(e) => handleUpdate(e, "maxGuestsPerBooking")}
                />
            </FormRow>
            <FormRow label="Breakfast price">
                <Input
                    type="number"
                    id="breakfast-price"
                    defaultValue={breakfastPrice}
                    disabled={isUpdating}
                    onBlur={(e) => handleUpdate(e, "breakfastPrice")}
                />
            </FormRow>
        </Form>
    );
}

export default UpdateSettingsForm;
