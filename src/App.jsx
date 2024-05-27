import React, { useState } from "react";
import icon from "../public/assets/icon-arrow.svg";
import { useDispatch, useSelector } from "react-redux";
import { setDays, setMonths, setYears, calculateAge } from "./components/ageSlice";
import { FaArrowRight } from "react-icons/fa"; // FaArrowRight ni qo'shdik

const isLeapYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

const getDaysInMonth = (year, month) => {
  return month === 2
    ? isLeapYear(year)
      ? 29
      : 28
    : [4, 6, 9, 11].includes(month)
    ? 30
    : 31;
};

const backgrounds = ["url(https://source.unsplash.com/1600x900/?nature,forest)"];

const AgeCalculator = () => {
  const dispatch = useDispatch();
  const calculatedYears = useSelector((state) => state.age.calculatedYears);
  const calculatedMonths = useSelector((state) => state.age.calculatedMonths);
  const calculatedDays = useSelector((state) => state.age.calculatedDays);
  const years = useSelector((state) => state.age.years);
  const months = useSelector((state) => state.age.months);
  const days = useSelector((state) => state.age.days);

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'years') {
      dispatch(setYears(value));
    } else if (name === 'months') {
      dispatch(setMonths(value));
    } else if (name === 'days') {
      dispatch(setDays(value));
    }
  };

  const validateInputs = () => {
    const newErrors = {};

    const currentDate = new Date();
    const inputDate = new Date(years, months - 1, days);

    if (!years || years === '--') {
      newErrors.years = "This field is required";
    } else if (years < 0) {
      newErrors.years = "Invalid year";
    }

    if (!months || months === '--') {
      newErrors.months = "This field is required";
    } else if (months < 1 || months > 12) {
      newErrors.months = "Must be a valid month";
    }

    if (!days || days === '--') {
      newErrors.days = "This field is required";
    } else if (days < 1 || days > 31) {
      newErrors.days = "Must be a valid day";
    } else if (months && days > getDaysInMonth(years, months)) {
      newErrors.days = `Invalid day for the given month`;
    }

    if (years !== '--' && months !== '--' && days !== '--' && inputDate > currentDate) {
      newErrors.date = "Must be in the past";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateInputs()) {
      dispatch(calculateAge());
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center" style={{ backgroundImage: backgrounds[0], backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="border bg-white max-w-[780px] age-calculator-container w-full rounded-br-[25%] rounded-2xl p-12 shadow-lg transition-transform duration-300 ease-in-out hover:scale-105">
        <form className="flex relative gap-6 pb-10 border-b mb-14" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1 text-gray-500">
            <label htmlFor="days" className="text-[14px] font-semibold">DAY</label>
            <input
              className="border text-black outline-none text-[24px] focus:border-purple-600 rounded-lg w-[150px] p-3 font-semibold appearance-none transition-all duration-300 ease-in-out hover:border-purple-400"
              type="number"
              id="days"
              name="days"
              placeholder="DD"
              value={days === '--' ? '' : days}
              onChange={handleInputChange}
            />
            {errors.days && <p className="text-red-500 text-xs">{errors.days}</p>}
          </div>
          <div className="flex flex-col gap-1 text-gray-500">
            <label htmlFor="months" className="text-[14px] font-semibold">MONTH</label>
            <input
              className="border text-black outline-none text-[24px] focus:border-purple-600 rounded-lg w-[150px] p-3 font-semibold appearance-none transition-all duration-300 ease-in-out hover:border-purple-400"
              type="number"
              id="months"
              name="months"
              placeholder="MM"
              value={months === '--' ? '' : months}
              onChange={handleInputChange}
            />
            {errors.months && <p className="text-red-500 text-xs">{errors.months}</p>}
          </div>
          <div className="flex flex-col gap-1 text-gray-500">
            <label htmlFor="years" className="text-[14px] font-semibold">YEAR</label>
            <input
              className="border text-black outline-none text-[24px] focus:border-purple-600 rounded-lg w-[150px] p-3 font-semibold appearance-none transition-all duration-300 ease-in-out hover:border-purple-400"
              type="number"
              id="years"
              name="years"
              placeholder="YYYY"
              value={years === '--' ? '' : years}
              onChange={handleInputChange}
            />
            {errors.years && <p className="text-red-500 text-xs">{errors.years}</p>}
            {errors.date && <p className="text-red-500 text-xs mb-4">{errors.date}</p>}
          </div>
          <button
            type="submit"
            className="border absolute right-0 bottom-[-40px] p-5 rounded-full bg-purple-600 hover:bg-purple-700 transition-all duration-300 ease-in-out"
          >
            <FaArrowRight />
          </button>
        </form>

        <div>
          <div className="flex gap-2">
            <p className="text-[70px] font-extrabold text-purple-600">{calculatedYears}</p>
            <p className="text-[70px] font-extrabold text-black">years</p>
          </div>

          <div className="flex gap-2">
            <p className="text-[70px] font-extrabold text-purple-600">{calculatedMonths}</p>
            <p className="text-[70px] font-extrabold text-black">months</p>
          </div>

          <div className="flex gap-2">
            <p className="text-[70px] font-extrabold text-purple-600">{calculatedDays}</p>
            <p className="text-[70px] font-extrabold text-black">days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgeCalculator;
