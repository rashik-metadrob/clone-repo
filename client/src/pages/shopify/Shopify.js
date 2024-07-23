import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import createApp from "@shopify/app-bridge";
import { Redirect } from "@shopify/app-bridge/actions";
import { getSession } from "../../api/shopify.api";
import { useReady } from "../../utils/hooks";
import axios from "../../api/base.api";
import { getSessionToken } from "@shopify/app-bridge/utilities";

const Shopify = () => {
  const navigate = useNavigate();
  const search = new URLSearchParams(window.location.search);
  const host = search.get("host");
  const shop = search.get("shop");
  const embedded = search.get("embedded");


  // useReady(() => {
  //   const queryParams = new URLSearchParams({
  //     shop: 'metadrob-new-store.myshopify.com',
  //     host: 'YWRtaW4uc2hvcGlmeS5jb20vc3RvcmUvbWV0YWRyb2ItbmV3LXN0b3Jl'
  //   });

  //   axios.get(`/shopify/get-session?${queryParams.toString()}`).then((rs) => {
  //     console.log('getsession', rs.data);
      
  //   });
  // })

  useReady(() => {
    if (!shop || !host) {
      return navigate("not-found");
    }

    getSession({host, shop}).then(async (rs) => {
      console.log("test result", rs.data);
      console.log("env", process.env);
      window.shopifyHost = host
      window.shopifyShop = shop
      if (rs.data) {
        //session exists, no redirect, just render UI
        navigate("/login")
      } else {
        //session does not exist, redirect to auth flow
        const app = createApp({
          apiKey: process.env.REACT_APP_SHOPIFY_API_KEY,
          host: host,
          forceRedirect: true,
        });

        let redirectUrl = `${process.env.REACT_APP_CLIENT_HOST}/shopify/auth/callback`;
        const queryParams = new URLSearchParams({
          client_id: process.env.REACT_APP_SHOPIFY_API_KEY,
          scope: "write_products",
          redirect_uri: redirectUrl,
        }).toString();

        let grandScreenUrl = `https://${shop}/admin/oauth/authorize?${queryParams}`;

        if (!embedded || embedded != 1) {
          window.location = decodeURIComponent(grandScreenUrl);
        } else {
          const redirect = Redirect.create(app);
          redirect.dispatch(
            Redirect.Action.REMOTE,
            decodeURIComponent(grandScreenUrl)
          );
        }
      }
    })
    .catch((e) => {
      console.error(e);
    });
  });
  return <div>Loading...</div>;
};
export default Shopify