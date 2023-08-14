import styled from "styled-components";
import DashboardBox from "./DashboardBox";
import { useDarkMode } from "../../context/DarkModeContext";
import Heading from "../../ui/Heading";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";

// const fakeData = [
//     { label: "Jan 09", totalSales: 480, extrasSales: 20 },
//     { label: "Jan 10", totalSales: 580, extrasSales: 100 },
//     { label: "Jan 11", totalSales: 550, extrasSales: 150 },
//     { label: "Jan 12", totalSales: 600, extrasSales: 50 },
//     { label: "Jan 13", totalSales: 700, extrasSales: 150 },
//     { label: "Jan 14", totalSales: 800, extrasSales: 150 },
//     { label: "Jan 15", totalSales: 700, extrasSales: 200 },
//     { label: "Jan 16", totalSales: 650, extrasSales: 200 },
//     { label: "Jan 17", totalSales: 600, extrasSales: 300 },
//     { label: "Jan 18", totalSales: 550, extrasSales: 100 },
//     { label: "Jan 19", totalSales: 700, extrasSales: 100 },
//     { label: "Jan 20", totalSales: 800, extrasSales: 200 },
//     { label: "Jan 21", totalSales: 700, extrasSales: 100 },
//     { label: "Jan 22", totalSales: 810, extrasSales: 50 },
//     { label: "Jan 23", totalSales: 950, extrasSales: 250 },
//     { label: "Jan 24", totalSales: 970, extrasSales: 100 },
//     { label: "Jan 25", totalSales: 900, extrasSales: 200 },
//     { label: "Jan 26", totalSales: 950, extrasSales: 300 },
//     { label: "Jan 27", totalSales: 850, extrasSales: 200 },
//     { label: "Jan 28", totalSales: 900, extrasSales: 100 },
//     { label: "Jan 29", totalSales: 800, extrasSales: 300 },
//     { label: "Jan 30", totalSales: 950, extrasSales: 200 },
//     { label: "Jan 31", totalSales: 1100, extrasSales: 300 },
//     { label: "Feb 01", totalSales: 1200, extrasSales: 400 },
//     { label: "Feb 02", totalSales: 1250, extrasSales: 300 },
//     { label: "Feb 03", totalSales: 1400, extrasSales: 450 },
//     { label: "Feb 04", totalSales: 1500, extrasSales: 500 },
//     { label: "Feb 05", totalSales: 1400, extrasSales: 600 },
//     { label: "Feb 06", totalSales: 1450, extrasSales: 400 },
// ];

const StyledSalesChart = styled(DashboardBox)`
    grid-column: 1 / -1;

    /* Mẹo để thay đổi màu của các đường lưới trên biểu đồ */
    & .recharts-cartesian-grid-horizontal line,
    & .recharts-cartesian-grid-vertical line {
        stroke: var(--color-grey-300);
    }
`;

function SalesChart({ bookings, numDays }) {
    const { isDarkMode } = useDarkMode();

    // Tạo mảng chứa tất cả các ngày trong khoảng thời gian cần hiển thị
    const allDates = eachDayOfInterval({
        start: subDays(new Date(), numDays - 1),
        end: new Date(),
    });

    // Tạo dữ liệu cho biểu đồ dựa trên thông tin đặt phòng và ngày
    const data = allDates.map((date) => {
        return {
            // Định dạng ngày thành "Tháng Ngày" (VD: "Aug 01")
            label: format(date, "MMM dd"),
            // Tổng doanh số bookings có cùng ngày (ngày booking trùng với date trong mảng allDates)
            totalSales: bookings
                .filter((booking) =>
                    isSameDay(date, new Date(booking.created_at))
                )
                .reduce((acc, cur) => acc + cur.totalPrice, 0),
            extrasSales: bookings
                .filter((booking) =>
                    isSameDay(date, new Date(booking.created_at))
                )
                .reduce((acc, cur) => acc + cur.extrasPrice, 0),
        };
    });

    // console.log(data);

    const colors = isDarkMode
        ? {
              totalSales: { stroke: "#4f46e5", fill: "#4f46e5" },
              extrasSales: { stroke: "#22c55e", fill: "#22c55e" },
              text: "#e5e7eb",
              background: "#18212f",
          }
        : {
              totalSales: { stroke: "#4f46e5", fill: "#c7d2fe" },
              extrasSales: { stroke: "#16a34a", fill: "#dcfce7" },
              text: "#374151",
              background: "#fff",
          };
    return (
        <StyledSalesChart>
            <Heading as="h2">
                Sales from {format(allDates.at(0), "MMM dd yyyy")} &mdash;{" "}
                {format(allDates.at(-1), "MMM dd yyyy")}
            </Heading>

            {/* Tạo vùng hiển thị biểu đồ tự động điều chỉnh */}
            <ResponsiveContainer height={300} width="100%">
                <AreaChart data={data}>
                    {/* Trục X (ngang) */}
                    <XAxis
                        dataKey="label"
                        tick={{ fill: colors.text }} // Màu của dấu tick
                        tickLine={{ stroke: colors.text }} // Màu của đường tick
                    />

                    {/* Trục Y (dọc) */}
                    <YAxis
                        unit="$" // Đơn vị cho trục Y
                        tick={{ fill: colors.text }} // Màu của dấu tick
                        tickLine={{ stroke: colors.text }} // Màu của đường tick
                    />

                    {/* Đường lưới Cartesian */}
                    <CartesianGrid strokeDasharray="4" />

                    {/* Tooltip (Popup Chú thích khi hover) */}
                    <Tooltip
                        contentStyle={{ backgroundColor: colors.background }}
                    />

                    {/* Dữ liệu Total sales */}
                    <Area
                        dataKey="totalSales"
                        type="monotone" // Loại dữ liệu của biểu đồ
                        stroke={colors.totalSales.stroke} // Màu của đường
                        fill={colors.totalSales.fill} // Màu của diện tích dưới đường
                        strokeWidth={2} // Độ dày của đường
                        name="Total sales" // Tên hiển thị trong tooltip
                        unit="$" // Đơn vị
                    />

                    {/* Dữ liệu Extras sales */}
                    <Area
                        dataKey="extrasSales"
                        type="monotone"
                        stroke={colors.extrasSales.stroke}
                        fill={colors.extrasSales.fill}
                        strokeWidth={2}
                        name="Extras sales"
                        unit="$"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </StyledSalesChart>
    );
}

export default SalesChart;
