import { Kafka } from "kafkajs";
const kafka = new Kafka({
  clientId: "my-zap-app",
  brokers: ["localhost:9092"],
});

const admin = kafka.admin();
const createTopic = async (topic: string) => {
  try {
    await admin.connect();
    ///creating the toppic
    const response = await admin.createTopics({
      validateOnly: false,
      timeout: 6000,
      topics: [
        {
          topic: topic,
          numPartitions: 2,
          replicationFactor: 1,
        },
      ],
    });
    if (!response) {
      console.log("topic not created ");
    } else {
      console.log("topic created successfully ");
    }
  } catch (error) {
    console.log("Error while creating the topic ", error);
  } finally {
    await admin.disconnect();
  }
};
createTopic("ZapServices2");
