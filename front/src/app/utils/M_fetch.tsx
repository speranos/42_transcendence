interface ReqData {
    method: string;
    credentials: RequestCredentials;
    headers: HeadersInit;
    body?: string;
  }
  
const defFetch = async (
    uri: string,
    method: string = "POST",
    additionalHeaders: HeadersInit = {},
    body: any = {}
  ): Promise<Response> => {
    const data: ReqData = {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        //   Authorization: "Bearer " + params.token, // not needed for now, using cookies.
        ...additionalHeaders,
      },
    };
    const url = `${process.env.NEXT_PUBLIC_API_URL}${uri}`.replace(
      /(?<!:)\/+/gm,
      "/"
    );
  
    if (method.toLowerCase() !== "get") data.body = JSON.stringify(body);;
    return await fetch(url, data);
  };
  
  const M_fetch = {
    post: async (uri: string, additionalHeaders: any = {}, body: any = {}) => {
      return await defFetch(uri, "POST", additionalHeaders, body);
    },
  
    get: async (uri: string, additionalHeaders: any = {}) => {
      return await defFetch(uri, "GET", additionalHeaders, {});
    },
  };

  export default M_fetch;
  