import styled from "styled-components";
import BookingDataBox from "../../features/bookings/BookingDataBox";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Checkbox from "../../ui/Checkbox";

import { useMoveBack } from "../../hooks/useMoveBack";
import {useQuery } from "@tanstack/react-query";
import { getBooking } from "../../services/apiBookings";
import Spinner from "../../ui/Spinner";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { formatCurrency } from "../../utils/helpers";
import useCheckin from "./useCheckin";
// import { toast } from "react-hot-toast";
import { getSettings } from "../../services/apiSettings";
import { useEffect } from "react";

const Box = styled.div`
    /* Box */
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-md);
    padding: 2.4rem 4rem;
`;

function CheckinBooking() {
    const [confirmedPaid, setConfirmedPaid] = useState(false);
    const [addBreakfast, setAddBreakfast] = useState(false);
    const { checkin, isCheckingIn } = useCheckin(); //custom hook
    const moveBack = useMoveBack(); //custom hook

    const { bookingId } = useParams();
    const {
        isLoading,
        data: booking = {},
        // error,
    } = useQuery({
        queryKey: ["booking", bookingId],
        queryFn: () => getBooking(bookingId),
    });

    //Tự động checked nếu đã thanh toán rồi
    useEffect(() => setConfirmedPaid(booking?.isPaid ?? false), [booking]);

    //Load data settings
    const {
        isLoading: isLoadingSettings,
        data: settings = {},
        // error: errorSettings,
    } = useQuery({
        queryKey: ["settings"],
        queryFn: getSettings,
    });

    const { id, guests, totalPrice, numGuests, hasBreakfast, numNights } =
        booking;

    const optionalBreakfastPrice =
        settings.breakfastPrice * numNights * numGuests;

    if (isLoading || isLoadingSettings) return <Spinner />;

    function handleCheckin() {
        if (!confirmedPaid) return;

        if (addBreakfast) {
            checkin({
                bookingId,
                breakfast: {
                    hasBreakfast: true,
                    extrasPrice: optionalBreakfastPrice,
                    totalPrice: totalPrice + optionalBreakfastPrice,
                },
            });
        } else {
            checkin({ bookingId, breakfast: {} });
        }
    }

    return (
        <>
            <Row type="horizontal">
                <Heading as="h1">Check in booking #{id}</Heading>
                <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
            </Row>

            <BookingDataBox booking={booking} />

            {!hasBreakfast && (
                <Box>
                    <Checkbox
                        checked={addBreakfast}
                        onChange={() => setAddBreakfast((add) => !add)}
                        id="breakfast"
                    >
                        Want to add breakfast for{" "}
                        {!addBreakfast
                            ? formatCurrency(totalPrice)
                            : `${formatCurrency(
                                  totalPrice + optionalBreakfastPrice
                              )} (${formatCurrency(
                                  totalPrice
                              )}) + ${formatCurrency(optionalBreakfastPrice)}`}
                        ?
                    </Checkbox>
                </Box>
            )}

            <Box>
                <Checkbox
                    checked={confirmedPaid}
                    disabled={confirmedPaid || isCheckingIn}
                    onChange={() => setConfirmedPaid((confirm) => !confirm)}
                    id="confirm"
                >
                    I confirm that {guests.fullName} has paid the total amount
                    of {formatCurrency(totalPrice)}
                </Checkbox>
            </Box>

            <ButtonGroup>
                <Button
                    onClick={handleCheckin}
                    disabled={!confirmedPaid || isCheckingIn}
                >
                    Check in booking #{id}
                </Button>
                <Button variation="secondary" onClick={moveBack}>
                    Back
                </Button>
            </ButtonGroup>
        </>
    );
}

export default CheckinBooking;
