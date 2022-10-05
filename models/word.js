const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);
// 필드값 자동 증가 플러그인
const wordSchema = new mongoose.Schema({
  id: { type: Number, required: true, default: 0 },
  month: { type: Number, required: true },
  day: { type: Number, required: true },
  word: { type: String, required: true },
  mean: { type: String, required: true },
  folder: { type: String, required: false, default: "" }
}
,
{ collection: 'word' }
,
{
  timestamps: true
});
// Mongoose 사용 Schema 정의, Word컬렉션을 명시하여 사용했다.

wordSchema.plugin(autoIncrement.plugin, {
  model: 'Word', //Word Model에
  field: 'id', // Id 필드를
  startAt: 1, //1부터
  increment: 1 // 1씩 증가
});


wordSchema.statics.create = function (payload) {
    const word = new this(payload);
    return word.save();
  };
  // insert 작업
  

  wordSchema.statics.findAll = function () {
    return this.find({});
  };
  // Find 작업
 

  wordSchema.statics.updateBywordid = function (id, payload) {
    // { new: true } : 수정된 값을 서버로 반환한다.
    return this.findOneAndUpdate({ id }, payload, { new: true });
  };
  // update 작업, id로 찾은 후 payload 값으로 update 수행 
  
  
  wordSchema.statics.deleteBywordid = function (id) {
    return this.deleteOne({ id });
  };
  // delete 작업 



// Model Export
module.exports = mongoose.model('Word', wordSchema);