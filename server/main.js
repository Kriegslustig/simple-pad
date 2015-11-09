Meteor.methods({
  updateDoc (name, text, clientId) {
    Pads.upsert(
      { name },
      { $set: { text, lock: { time: (new Date).getTime(), clientId } } }
    )
  }
})

Meteor.publish('pad', (name) => Pads.find({ name }))

