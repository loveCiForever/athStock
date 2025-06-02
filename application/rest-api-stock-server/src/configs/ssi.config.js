import "dotenv/config";

export const ssiConfig = () => {
  const SSI_ConsumerId = process.env.SSI_ConsumerId;
  const SSI_ConsumerSecret = process.env.SSI_ConsumerSecret;

  // console.log(`SSI Consumer ID: ${SSI_ConsumerId}`);
  // console.log(`SSI Consumer Secret: ${SSI_ConsumerSecret}`);

  return {
    market: {
      HubUrl: "wss://fc-datahub.ssi.com.vn/",
      ApiUrl: "https://fc-data.ssi.com.vn/",
      ConsumerId: SSI_ConsumerId,
      ConsumerSecret: SSI_ConsumerSecret,
    },
  };
};
