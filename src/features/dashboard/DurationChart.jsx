import styled from "styled-components";
import Heading from "../../ui/Heading";
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { useDarkMode } from "../../context/DarkModeContext";

const ChartBox = styled.div`
    /* Box */
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-md);

    padding: 2.4rem 3.2rem;
    grid-column: 3 / span 2;

    & > *:first-child {
        margin-bottom: 1.6rem;
    }

    & .recharts-pie-label-text {
        font-weight: 600;
    }
`;

//TEST
// const startDataLight = [
//     {
//         duration: "1 night",
//         value: 5,
//         color: "#ef4444",
//     },
//     {
//         duration: "2 nights",
//         value: 3,
//         color: "#f97316",
//     },
//     {
//         duration: "3 nights",
//         value: 2,
//         color: "#eab308",
//     },
//     {
//         duration: "4-5 nights",
//         value: 1,
//         color: "#84cc16",
//     },
//     {
//         duration: "6-7 nights",
//         value: 6,
//         color: "#22c55e",
//     },
//     {
//         duration: "8-14 nights",
//         value: 9,
//         color: "#14b8a6",
//     },
//     {
//         duration: "15-21 nights",
//         value: 2,
//         color: "#3b82f6",
//     },
//     {
//         duration: "21+ nights",
//         value: 1,
//         color: "#a855f7",
//     },
// ];

const startDataLight = [
    {
        duration: "1 night",
        value: 0,
        color: "#ef4444",
    },
    {
        duration: "2 nights",
        value: 0,
        color: "#f97316",
    },
    {
        duration: "3 nights",
        value: 0,
        color: "#eab308",
    },
    {
        duration: "4-5 nights",
        value: 0,
        color: "#84cc16",
    },
    {
        duration: "6-7 nights",
        value: 0,
        color: "#22c55e",
    },
    {
        duration: "8-14 nights",
        value: 0,
        color: "#14b8a6",
    },
    {
        duration: "15-21 nights",
        value: 0,
        color: "#3b82f6",
    },
    {
        duration: "21+ nights",
        value: 0,
        color: "#a855f7",
    },
];

const startDataDark = [
    {
        duration: "1 night",
        value: 0,
        color: "#b91c1c",
    },
    {
        duration: "2 nights",
        value: 0,
        color: "#c2410c",
    },
    {
        duration: "3 nights",
        value: 0,
        color: "#a16207",
    },
    {
        duration: "4-5 nights",
        value: 0,
        color: "#4d7c0f",
    },
    {
        duration: "6-7 nights",
        value: 0,
        color: "#15803d",
    },
    {
        duration: "8-14 nights",
        value: 0,
        color: "#0f766e",
    },
    {
        duration: "15-21 nights",
        value: 0,
        color: "#1d4ed8",
    },
    {
        duration: "21+ nights",
        value: 0,
        color: "#7e22ce",
    },
];

// Hàm chuẩn bị dữ liệu cho biểu đồ, nhận dữ liệu ban đầu và thông tin lưu trú
function prepareData(startData, stays) {
    // Hàm tăng giá trị của một trường cụ thể trong một mảng đối tượng.
    function incArrayValue(arr, field) {
        return arr.map((obj) =>
            // Nếu tìm thấy trường cần tăng, tạo một đối tượng mới với giá trị tăng.
            obj.duration === field ? { ...obj, value: obj.value + 1 } : obj
        );
    }

    // Xử lý thông tin từ dữ liệu lưu trú và tăng giá trị tương ứng trong mảng dữ liệu dựa trên số ngày lưu trú.
    const data = stays
        .reduce((arr, cur) => {
            const num = cur.numNights;
            // Dựa vào số ngày lưu trú để tăng giá trị trong mảng dữ liệu.
            if (num === 1) return incArrayValue(arr, "1 night");
            if (num === 2) return incArrayValue(arr, "2 nights");
            if (num === 3) return incArrayValue(arr, "3 nights");
            if ([4, 5].includes(num)) return incArrayValue(arr, "4-5 nights");
            if ([6, 7].includes(num)) return incArrayValue(arr, "6-7 nights");
            if (num >= 8 && num <= 14) return incArrayValue(arr, "8-14 nights");
            if (num >= 15 && num <= 21)
                return incArrayValue(arr, "15-21 nights");
            if (num >= 21) return incArrayValue(arr, "21+ nights");
            return arr; // Trường hợp mặc định, không tăng giá trị.
        }, startData) // Sử dụng startData làm giá trị ban đầu của mảng dữ liệu.
        .filter((obj) => obj.value > 0); // Lọc bỏ các dòng có giá trị = 0.

    return data; // Trả về mảng dữ liệu đã xử lý.
}

function DurationChart({ confirmedStays }) {
    const { isDarkMode } = useDarkMode();
    const starData = isDarkMode ? startDataDark : startDataLight;
    const data = prepareData(starData, confirmedStays);
    return (
        <ChartBox>
            <Heading as="h2">Stay duration summary</Heading>

            {/* Container linh hoạt để làm cho biểu đồ đáp ứng */}
            <ResponsiveContainer width="100%" height={240}>
                {/* PieChart là thành phần chính để vẽ biểu đồ hình bánh */}
                <PieChart>
                    {/* Pie là một phần của PieChart, chứa dữ liệu và cấu hình cho biểu đồ */}
                    <Pie
                        data={data} // Dữ liệu sẽ được truyền vào để vẽ biểu đồ
                        nameKey="duration" // Thuộc tính trong dữ liệu dùng làm nhãn cho mỗi phần của biểu đồ
                        dataKey="value" // Thuộc tính trong dữ liệu dùng để xác định giá trị của mỗi phần
                        innerRadius={85} // Bán kính của lỗ giữa biểu đồ (để tạo hiệu ứng vòng tròn)
                        outerRadius={110} // Bán kính của biểu đồ
                        cx="40%" // Vị trí tâm x của biểu đồ (theo phần trăm)
                        cy="50%" // Vị trí tâm y của biểu đồ (theo phần trăm)
                        paddingAngle={3} // Góc khoảng trắng giữa các phần trong biểu đồ
                    >
                        {/* Tạo các phần trong biểu đồ bằng cách map qua data */}
                        {data.map((entry) => (
                            <Cell
                                fill={entry.color} // Màu cho từng phần của biểu đồ
                                stroke={entry.color} // Màu viền cho từng phần
                                key={entry.duration} // Key để xác định mỗi Cell khi map qua data
                            />
                        ))}
                    </Pie>

                    {/* Tooltip là hộp hiển thị thông tin khi di chuột qua mỗi phần của biểu đồ */}
                    <Tooltip />

                    {/* Legend là hộp chứa các biểu tượng và nhãn cho từng phần của biểu đồ */}
                    <Legend
                        verticalAlign="middle" // Vị trí dọc của Legend (middle, top, bottom)
                        align="right" // Vị trí ngang của Legend (left, center, right)
                        width="30%" // Độ rộng của Legend
                        layout="vertical" // Hướng sắp xếp của Legend (vertical, horizontal)
                        iconSize={15} // Kích thước của biểu tượng trong Legend
                        iconType="circle" // Loại biểu tượng trong Legend
                    />
                </PieChart>
            </ResponsiveContainer>
        </ChartBox>
    );
}

export default DurationChart;
