import {
  SNSClient,
  SubscribeCommand,
  ConfirmSubscriptionCommand,
  PublishCommand,
  VerifySMSSandboxPhoneNumberInputFilterSensitiveLog,
} from "@aws-sdk/client-sns";

export class NotificationService {
  client: SNSClient;
  topicARN: string;

  constructor() {
    this.client = new SNSClient(process.env);
    this.topicARN =
      "arn:aws:sns:us-east-1:489881683177:Breaktime-Timesheet-Updates";
  }

  // adds an email subscription
  public async addSubscription(
    email: string,
    userID: string,
    directUserIDs: string[]
  ) {
    const subInput = {
      TopicArn: this.topicARN,
      Protocol: "email",
      Endpoint: email,
      Attributes: {
        FilterPolicy: JSON.stringify({
          UserID: [userID],
          DirectUserIDs: directUserIDs,
        }),
        FilterPolicyScope: "MessageAttributes",
      },
    };

    const subCommand = new SubscribeCommand(subInput);
    const response = await this.client.send(subCommand);
    console.log(`Subscription: ${response}`);
  }

  // sends an email to the proper user ID
  public async sendEmail(
    toUserID: string,
    fromUserID: string,
    subjectLine: string,
    messageBody: string
  ) {
    const publishInput = {
      TopicArn: this.topicARN,
      Subject: subjectLine,
      Message: messageBody,
      MessageAttributes: {
        UserID: {
          DataType: "String",
          StringValue: toUserID,
        },
        DirectUserIDs: {
          DataType: "String",
          StringValue: fromUserID,
        },
      },
    };

    const pubCommand = new PublishCommand(publishInput);
    const response = await this.client.send(pubCommand);
    console.log(`Message sent: ${response}`);
  }
}
