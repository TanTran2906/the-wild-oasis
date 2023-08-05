import { useSearchParams } from "react-router-dom";
import Select from "./Select";

function SortBy({ options }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const sortBy = searchParams.get("sortBy") || "";

    function handleChange(e) {
        searchParams.set("sortBy", e.target.value);
        // Cập nhật tham số tìm kiếm sau khi thay đổi
        setSearchParams(searchParams);
    }
    return (
        <Select
            options={options}
            value={sortBy}
            onChange={handleChange}
            type="white"
        />
    );
}

export default SortBy;
