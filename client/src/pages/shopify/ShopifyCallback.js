import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import createApp from "@shopify/app-bridge";
import { Redirect } from "@shopify/app-bridge/actions";
import { addSession } from "../../api/shopify.api";
import { useReady } from "../../utils/hooks";
import { getSessionToken } from "@shopify/app-bridge/utilities";

const ShopifyCallBack = () => {
  const search = new URLSearchParams(window.location.search);
  const host = search.get("host");
  const shop = search.get("shop");
  const code = search.get("code");
  const embedded = search.get("embedded");
  const navigate = useNavigate();

  useReady(() => {
    if (!shop || !host || !code) {
      return navigate("not-found");
    }

    window.shopifyHost = host
    window.shopifyShop = shop

    let redirectUrl = `https://admin.shopify.com/store/${shop.replace(
      ".myshopify.com",
      ""
    )}/apps/${process.env.REACT_APP_SHOPIFY_API_KEY}`;

    addSession({
      shop,
      host,
      code,
    })
      .then(async (rs) => {
        console.log("insert session", rs);

        if (!embedded || embedded != 1) {
          window.location = redirectUrl;
        } else {
          const app = createApp({
            apiKey: process.env.REACT_APP_SHOPIFY_API_KEY,
            host: host,
            forceRedirect: true,
          });
          const redirect = Redirect.create(app);
          redirect.dispatch(Redirect.Action.REMOTE, redirectUrl);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  });

  return <div>Redirecting...</div>;
};
export default ShopifyCallBack