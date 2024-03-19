
interface JsonData {
    [key: string]: any; // Define the structure of your JSON data
  }
  
export  const tryGetJson = async (resp: Response | null): Promise<JsonData | null> => {
    return new Promise<JsonData | null>((resolve) => {
      if (resp) {
        resp.json().then((json: JsonData) => resolve(json)).catch(() => resolve(null));
      } else {
        resolve(null);
      }
    });
  };