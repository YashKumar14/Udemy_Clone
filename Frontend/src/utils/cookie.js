export const setAuthCookie = (username, useremail) => {
  console.log("cookie created");
  const expiryDate = new Date();

  expiryDate.setDate(expiryDate.getDate() + 5);

  document.cookie = `last_auth_information=${JSON.stringify({
    username,
    useremail,
  })};expires=${expiryDate.toUTCString()};path=/`;
};

export const removeAuthCookie = () => {
  document.cookie =
    "last_auth_information=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

export const getAuthCookie = () => {
  const name = "last_auth_information=";
  const decodedCookies = decodeURIComponent(document.cookie);
  const cookieArr = decodedCookies.split(";");

  for (let i = 0; i < cookieArr.length; i++) {
    let cookie = cookieArr[i].trim();
    if (cookie.indexOf(name) == 0) {
      return JSON.parse(cookie.substring(name.length));
    }
  }
  return null;
};
