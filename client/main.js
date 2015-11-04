let padlock = new ReactiveVar({})

Template.pad.onCreated(function () {
  Session.set('document', location.pathname)
  if(!Session.get('clientId')) Session.set('clientId', Random.id())
  this.subscribe('pad', Session.get('document'))
  setInterval(updatePadlock, 1000)
})

Template.pad.helpers({
  renderPad () {
    return (Pads.findOne() || {}).text || ''
  },

  isLocked () {
    return !padlock.get()
  }
})

Template.pad.events({
  'keyup': _.throttle((e) => {
    Meteor.call('updateDoc', Session.get('document'), e.currentTarget.value, Session.get('clientId'))
  }, 1000)
})

function updatePadlock (){
  let lock = Pads.findOne().lock
  padlock.set(
    lock.clientId === Session.get('clientId')
    || (new Date).getTime() - lock.time > 10000
  )
}

