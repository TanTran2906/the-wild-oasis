import { useQuery } from "@tanstack/react-query";
// import styled from "styled-components";
import { getCabins } from "../../services/apiCabins";
import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow-v2";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useSearchParams } from "react-router-dom";
import Empty from "../../ui/Empty";

// const Table = styled.div`
//     border: 1px solid var(--color-grey-200);

//     font-size: 1.4rem;
//     background-color: var(--color-grey-0);
//     border-radius: 7px;
//     overflow: hidden;
// `;

// const TableHeader = styled.header`
//     display: grid;
//     grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
//     column-gap: 2.4rem;
//     align-items: center;

//     background-color: var(--color-grey-50);
//     border-bottom: 1px solid var(--color-grey-100);
//     text-transform: uppercase;
//     letter-spacing: 0.4px;
//     font-weight: 600;
//     color: var(--color-grey-600);
//     padding: 1.6rem 2.4rem;
// `;

function CabinTable() {
    const {
        isLoading,
        data: cabins,
        // error,
    } = useQuery({
        queryKey: ["cabins"],
        queryFn: getCabins,
    });
    // console.log(cabins);
    const [searchParams] = useSearchParams();

    if (isLoading) return <Spinner />;
    if (!cabins.length) return <Empty resourceName="cabins" />;

    //1)FILTER
    const filterValue = searchParams.get("discount") || "all";
    let filteredCabins;

    if (filterValue === "all") filteredCabins = cabins;
    if (filterValue === "no-discount")
        filteredCabins = cabins.filter((cabin) => cabin.discount === 0);
    if (filterValue === "with-discount")
        filteredCabins = cabins.filter((cabin) => cabin.discount > 0);

    //2)SORT
    const sortBy = searchParams.get("sortBy") || "startDate-asc";
    const [field, direction] = sortBy.split("-");
    const modifier = direction === "asc" ? 1 : -1;
    const sortedCabins = filteredCabins.sort(
        (a, b) => (a[field] - b[field]) * modifier
    );

    return (
        <Menus>
            <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
                <Table.Header>
                    <div></div>
                    <div>Cabin</div>
                    <div>Capacity</div>
                    <div>Price</div>
                    <div>Discount</div>
                    <div></div>
                </Table.Header>

                <Table.Body>
                    {sortedCabins.map((cabin) => (
                        <CabinRow cabin={cabin} key={cabin.id} />
                    ))}
                </Table.Body>

                {/* Render props pattern - tham khảo */}
                {/* <Table.Body
                data={cabins}
                render={(cabin) => <CabinRow cabin={cabin} key={cabin.id} />}
            /> */}
            </Table>
        </Menus>
    );
}

export default CabinTable;
