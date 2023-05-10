import { ACCESS_TOKEN, EXPIRES_IN, TOKEN_TYPE } from "./common";
import { logout } from "./common";
const BASE_API_URL = import.meta.env.VITE_API_BASE_URI;
// const HEADERS = import.meta.env.HEADERS

// logic for - if accessToken is expired, logout, else return accesstoken and tokentype
const getAccessToken = () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  const expiresIn = localStorage.getItem(EXPIRES_IN);
  const tokenType = localStorage.getItem(TOKEN_TYPE);
  if (Date.now() < expiresIn) {
    return { accessToken, tokenType };
  } else {
    logout();
  }
};

// headers:`${tokenType} ${accessToken}`
// logic for consturcting headers with output of getAccessToken if loggedIn
const constructHeadersForAPIConfig = ({ accessToken, tokenType }) => {
  return {
    headers: { Authorization: `${tokenType} ${accessToken}` },
  };
};

export const fetchRequest = async (endPoint) => {
  const url = `${BASE_API_URL}/${endPoint}`;
  console.log("return type of accesstoken:", getAccessToken());
  const result = await fetch(
    url,
    constructHeadersForAPIConfig(getAccessToken())
  );
  return result.json();
};
