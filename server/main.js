Meteor.methods({
  updateDoc (name, text, clientId) {
    const $set = { lock: { time: (new Date).getTime(), clientId } }
    if (text) $set.text = text
    Pads.upsert(
      { name },
      { $set }
    )
  }
})

Meteor.publish('pad', (name) => Pads.find({ name }))

