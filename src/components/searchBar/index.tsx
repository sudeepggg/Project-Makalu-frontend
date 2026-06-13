import { Search } from "lucide-react";

interface Props {
  value: string;
  onClick: React.ChangeEventHandler<HTMLInputElement>;
  placeHolder: string;
}

const SearchBar = ({ value, onClick, placeHolder }: Props) => {
  return (
    <div className="relative flex-1">
      <Search
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
      />
      <input
        value={value}
        onChange={onClick}
        placeholder={placeHolder}
        className="form-field pl-9 py-1.5 text-sm"
      />
    </div>
  );
};

export default SearchBar;
