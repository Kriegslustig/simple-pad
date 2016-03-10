let currentTime = new ReactiveVar((new Date).getTime())
Session.setDefault('show', 'both')
const showStates = [
  'both',
  'display',
  'write'
]

setInterval(() => {
  currentTime.set((new Date).getTime())
}, 1000)

Template.pad.onCreated(function () {
  Session.set('document', location.pathname)
  if(!Session.get('clientId')) Session.set('clientId', Random.id())
  this.subscribe('pad', Session.get('document'))
})

Template.pad.events({
  'click button' (e) {
    Session.set(
      'show',
      showStates[
        showStates.indexOf(Session.get('show'))
        + 1
      ] || 'both'
    )
  }
})

Template.pad.helpers({
  renderPad () {
    let text = (Pads.findOne() || {}).text
    return (
      text !== undefined
        ? text
        : Meteor.call(
          'updateDoc',
          Session.get('document'),
          '',
          Session.get('clientId')
        )
    )
  },
  showRendered: () => Pads.findOne().text,
  isLocked () {
    let pad = Pads.findOne()
    return (
      !pad
      || (
        pad.lock.clientId !== Session.get('clientId')
        && currentTime.get() - pad.lock.time < 10000
      )
    )
  },
  showDisplay: () => Session.get('show') === 'display' || Session.get('show') === 'both',
  showTextArea: () => Session.get('show') === 'write' || Session.get('show') === 'both',
  both: () => Session.get('show') === 'both' ? 'both' : '',
})

Template.pad.events({
  keyup: _.throttle((e) =>
    Meteor.call('updateDoc', Session.get('document'), e.currentTarget.value, Session.get('clientId'))
  )
})

