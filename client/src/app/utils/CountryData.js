import { Country, State, City } from "country-state-city";

export const getCountries = () => {
  return Country.getAllCountries().map((country) => ({
    name: country.name,
    isoCode: country.isoCode,
    phoneCode: `+${country.phonecode}`,
  }));
};

export const getStates = (countryCode) => {
  return State.getStatesOfCountry(countryCode).map((state) => ({
    name: state.name,
    isoCode: state.isoCode,
  }));
};

export const getCities = (countryCode, stateCode) => {
  return City.getCitiesOfState(countryCode, stateCode).map((city) => city.name);
};
