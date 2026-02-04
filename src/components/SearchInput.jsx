import React, { useState, useRef, useEffect } from "react";

const SearchInput = ({
  placeholder = "",
  value = "",
  onChange,
  disabled = false,
  required = false,
  suggestions = [], // Pass your array of strings or objects here
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter logic
  useEffect(() => {
    if (value) {
      const filtered = suggestions.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(suggestions);
    }
  }, [value, suggestions]);

  const handleSelect = (item) => {
    // Create a mock event to match standard input onChange patterns
    onChange({ target: { value: item } });
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <input
        type="text"
        placeholder={placeholder}
        className={`bg-slate-900 capitalize text-white px-3 py-2 rounded border w-full border-slate-600 outline-none invalid:text-red-400 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        value={value}
        onChange={onChange}
        onFocus={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        required={required}
      />

      {isOpen && !disabled && filteredSuggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-slate-900 border border-slate-700 rounded-md shadow-xl max-h-60 overflow-auto scrollbar-thin scrollbar-thumb-slate-700">
          {filteredSuggestions.map((item, index) => (
            <li
              key={index}
              className="px-4 py-2 text-slate-300 capitalize hover:bg-blue-600 hover:text-white cursor-pointer transition-colors text-sm"
              onClick={() => handleSelect(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
