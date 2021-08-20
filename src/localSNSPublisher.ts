import { AWSError, SNS } from "aws-sdk";
import axios from "axios";

export function localSns(urls: string[]) {
  return {
    publish: ((
      params: SNS.PublishInput,
      callback?: (err: AWSError, data: SNS.PublishResponse) => void
    ) => {
      return {
        promise: () =>
          Promise.all(
            urls.map(async (url) => {
              const req = {
                headers: Object.keys(params.MessageAttributes ?? {}).reduce(
                  (acc, item) => ({
                    ...acc,
                    [item]: params.MessageAttributes?.[item] ?? "",
                  }),
                  {}
                ),
                body: params.Message,
                subject: params.Subject,
              };
              return axios
                .post(`${url}/${params.TopicArn}`, req)
                .then((response) => {
                  console.log(
                    `SNS response ${response.status} received from ${url}/${params.TopicArn}`
                  );
                  console.log(JSON.stringify(response.data, null, 2));
                  return response.data;
                })
                .catch((e) =>
                  console.error(
                    `error publishing to local topic ${params.TopicArn}`
                  )
                );
            })
          ),
      } as any;
    }) as any,
  } as unknown as SNS;
}

export function setupLocalSNS(localSnsPublisherInfo: {
  [topicName: string]: number[];
}): { [topicName: string]: SNS } {
  return Object.keys(localSnsPublisherInfo).reduce<{ [key: string]: SNS }>(
    (acc, topicName) => {
      const locations = localSnsPublisherInfo[topicName].map(
        (port) => `http://localhost:${port}/sns`
      );
      console.log(
        `LOCAL TOPIC: ${topicName}, LOCATIONS: ${JSON.stringify(locations)}`
      );
      return { ...acc, [topicName]: localSns(locations) };
    },
    {}
  );
}
