import Axios, { type AxiosRequestConfig } from "axios";
import { invoke } from "@tauri-apps/api/tauri";

interface IOptions {
  port: number;
}

export class DiscoveryService {
  constructor(private options: IOptions) {}

  public async discover(): Promise<string | undefined> {
    const localIp = (await invoke("get_local_ip")) as string;
    let serverUrl;
    // TODO discover with rust backend via udp socket
    // example like yeelight: https://github.com/Leixb/yeelight/blob/master/src/discover.rs#L101
    const ipOctets = localIp.split(".");
    ipOctets[ipOctets.length - 1] = "xxx";
    const ipRange = ipOctets.join(".");
    const promiseArray = [];
    const controller = new AbortController();
    const possibleIps = Array.from(Array(255 + 1).keys());
    console.log(`search for ip range: ${ipRange}`);
    for (const octet of possibleIps) {
      const ip = `${ipRange.replace(".xxx", `.${octet.toString()}`)}`;
      promiseArray.push(
        this.connect(ip, { signal: controller.signal }).then((response) => {
          if ("serverUrl" in response) {
            serverUrl = response.serverUrl;
            controller.abort();
          }
        })
      );
    }
    await Promise.all(promiseArray);
    return serverUrl;
  }

  public async connect(
    ip: string,
    requestConfig?: AxiosRequestConfig
  ): Promise<{ serverUrl: string } | { error: string }> {
    let serverUrl;
    let error;
    try {
      const response = await Axios.head(
        `http://${ip}:${this.options.port}`,
        requestConfig
      );
      if (response && response.headers["motion-detector"]) {
        serverUrl = response.request.responseURL.slice(0, -1);
        console.log("found motion controller with url: ", serverUrl);
      }
    } catch (responseError) {
      if (Axios.isAxiosError(responseError)) {
        error = responseError.response
          ? responseError.response?.data
          : responseError.message;
      } else if (responseError instanceof Error) {
        error = responseError.message;
      } else {
        error = error;
      }
    }
    return error ? { error } : { serverUrl };
  }
}
