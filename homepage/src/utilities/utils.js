import camelcaseKeys from "camelcase-keys";
import querystring from "query-string";
import snakecaseKeys from "snakecase-keys";

const API_BASE = process.env.REACT_APP_API_URL

export async function getPage(path, params, options) {
  params = params || {};
  let relativePath = path;
  if (relativePath.indexOf("/") !== 0) {
    relativePath = `/${relativePath}`;
  }
  let k;
  try{
     k=  await getRequest(`${API_BASE}${relativePath}`, params, options);
     console.log(k,"hihi")
  }catch(error){
    return null
  }
  // let k=  await getRequest(`${API_BASE}${relativePath}`, params, options);

  return k
}

export async function postContact(jsonData) {

  let headers = {
    "Content-Type": "application/json",

  };
  const res = await fetch('https://www.metadrob.com/wagtail/api/v1/cms/messages/', {
    method: "POST",
    headers,
    body: JSON.stringify(jsonData),
  });

  const data = await res.json();
  console.log(data,"subbb")
  return data
}

export async function postSubscription(jsonData) {

  let headers = {
    "Content-Type": "application/json",

  };
  const res = await fetch('https://www.metadrob.com/wagtail/api/v1/cms/subscription/', {
    method: "POST",
    headers,
    body: JSON.stringify(jsonData),
  });

  const data = await res.json();
  console.log(data,"subbb")
  return data
}
export async function getPagePreview(contentType, token, params, options) {
  params = params || {};
  params = {
    contentType,
    token,
    ...params,
  };

  return await getRequest(
    `${API_BASE}/api/v1/cms/page_preview/`,
    params,
    options
  );
}

export async function getRequest(url, params, options) {
  params = params || {};
  params = snakecaseKeys(params, { deep: true });

  let headers = options?.headers || {};
  headers = {
    "Content-Type": "application/json",
    ...headers,
  };
  const queryString = querystring.stringify(params);
  const res = await fetch(`${url}?${queryString}`, { headers });

  const data = await res.json();
  return camelcaseKeys(data, { deep: true });
}

export async function postRequest(url, params, options) {
  params = params || {};
  params = snakecaseKeys(params, { deep: true });

  let headers = options?.headers || {};
  headers = {
    "Content-Type": "application/json",
    ...headers,
  };
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(params),
  });

  const data = await res.json();
  return camelcaseKeys(data, { deep: true });
}

export function convertWagtailUrlToRelative(url){
  return url.replace(API_BASE, '')
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
