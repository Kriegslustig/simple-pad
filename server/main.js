Meteor.methods({
  updateDoc (name, text, clientId) {
    console.log(arguments)
    Pads.upsert(
      { name },
      { $set: { text, lock: { time: (new Date).getTime(), clientId } } }
    )
  }
})

Meteor.publish('pad', (name) => console.log(arguments) || Pads.find({ name }))

