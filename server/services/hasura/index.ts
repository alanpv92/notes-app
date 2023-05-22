import axios from "axios";
import constants from "../../helpers/constants";
class HasuraService {
  private static instance: HasuraService;
  private constructor() {}
  public static getInstance(): HasuraService {
    if (!this.instance) {
      this.instance = new HasuraService();
    }
    return this.instance;
  }

  async query(queryString: String) {
    try {
     
      const graphqlQuery = {
        query: queryString,
        variables: {},
      };
      let hasuraHeadersData = {
        "content-type": "application/json",
      };

      

      let response = await axios({
        url: constants.hasuraEndPoint,
        method: "post",
        headers: hasuraHeadersData,
        data: graphqlQuery,
      });
      

      if (response.data["errors"]) {
        throw new Error(
          response.data["errors"][0]["message"] || "something went wrong"
        );
      }
      return response.data["data"];
    } catch (e: any) {
      const errorText = e.message || "something went wrong";

      throw new Error(errorText);
    }
  }
}

export default HasuraService.getInstance();
