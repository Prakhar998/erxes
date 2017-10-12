import mongoose from 'mongoose';
import Random from 'meteor-random';
import { MESSENGER_KINDS, SENT_AS_CHOICES } from '../../data/constants';

const EmailSchema = mongoose.Schema({
  templateId: String,
  subject: String,
  content: String,
});

const RuleSchema = mongoose.Schema({
  _id: String,

  // browserLanguage, currentUrl, etc ...
  kind: String,

  // Browser language, Current url etc ...
  text: String,

  // is, isNot, startsWith
  condition: String,

  value: String,
});

const MessengerSchema = mongoose.Schema({
  brandId: String,
  kind: {
    type: String,
    enum: MESSENGER_KINDS.ALL_LIST,
  },
  sentAs: {
    type: String,
    enum: SENT_AS_CHOICES.ALL_LIST,
  },
  content: String,
  rules: [RuleSchema],
});

const EngageMessageSchema = mongoose.Schema({
  _id: { type: String, unique: true, default: () => Random.id() },
  kind: String,
  segmentId: String,
  customerIds: [String],
  title: String,
  fromUserId: String,
  method: String,
  isDraft: Boolean,
  isLive: Boolean,
  stopDate: Date,
  createdDate: Date,
  tagIds: [String],
  messengerReceivedCustomerIds: [String],

  email: EmailSchema,
  messenger: MessengerSchema,
  deliveryReports: Object,
});

class Message {
  /**
   * Create engage message
   * @param  {Object} doc object
   * @return {Promise} Newly created message object
   */
  static createMessage(doc) {
    return this.create({
      ...doc,
      deliveryReports: {},
      createdUserId: doc.userId,
      createdDate: new Date(),
    });
  }

  static updateMessage(_id, doc) {
    return this.update({ _id }, { $set: doc });
  }

  static removeMessage(_id) {
    return this.remove({ _id });
  }
}

EngageMessageSchema.loadClass(Message);
const EngageMessages = mongoose.model('engage_messages', EngageMessageSchema);

export default EngageMessages;
