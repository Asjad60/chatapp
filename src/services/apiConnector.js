export const apiConnector = async (apiURL, method, headers, body, ...extra) => {
  let response = await fetch(apiURL, {
    method: method ? method : "GET",
    headers: headers ? headers : {},
    body:
      body instanceof FormData
        ? body
        : body === null
        ? null
        : JSON.stringify(body),
    credentials: "include",
    ...extra,
  });

  return await response.json();
};
