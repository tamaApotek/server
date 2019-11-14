const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const queueSchema = new Schema(
    {
      total: {
        type: Number,
        default: 0,
      },
      current: {
        type: Number,
        default: 0,
      },
      registered: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Register',
        },
      ],
      dokterId: {
        type: Schema.Types.ObjectId,
        ref: 'Dokter',
      },
    },
    {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}},
);

queueSchema.pre('save', function(next) {
  if (this.current <= this.total) next();
  else throw {status: 400, message: `Current can't be more than total`};
});
// queueSchema.plugin(AutoIncrement, { inc_field: 'nomorAntrian' })
const Queue = mongoose.model('Queue', queueSchema);

module.exports = Queue;
