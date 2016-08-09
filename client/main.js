let currentTime = new ReactiveVar((new Date).getTime())
const showStates = [
  'write',
  'display',
  'both'
]

Session.setDefault('show', showStates[0])

setInterval(() => {
  currentTime.set((new Date).getTime())
}, 1000)

const isLocked = () => {
  let pad = Pads.findOne()
  return (
    !pad
    || (
      pad.lock.clientId !== Session.get('clientId')
      && currentTime.get() - pad.lock.time < 10000
    )
  )
}

const showDisplay = () => Session.get('show') === 'display' || Session.get('show') === 'both'
const showTextArea = () => Session.get('show') === 'write' || Session.get('show') === 'both'
const showRendered = () => {
  const pad = Pads.findOne()
  return pad ? pad.text : ''
}

const lock = () =>
  Meteor.call(
    'updateDoc',
    Session.get('document'),
    '',
    Session.get('clientId')
  )

const updateTextArea = templateInstance => () => {
  const element = templateInstance.find('textarea')
  if (!element) return
  const text = element.textContent
  if (!text || text === '' || isLocked()) {
    element.textContent = showRendered()
  }
}

let intervalId

Template.pad.onCreated(function () {
  Session.set('document', location.pathname)
  if(!Session.get('clientId')) Session.set('clientId', Random.id())
  this.subscribe('pad', Session.get('document'))
})

Template.pad.onRendered(function () {
  intervalId = window.setInterval(updateTextArea(this), 1000)
  this.autorun(() => {
    if (this.subscriptionsReady() && showTextArea()) {
      setTimeout(updateTextArea(this)())
    }
  })
})

Template.pad.onDestroyed(function () {
  window.clearInterval(intervalId)
})

Template.pad.events({
  // TODO make the button turn to display state
  'click button' (e) {
    const currentState = showStates.indexOf(Session.get('show'))
    const newState = currentState + 1 >= showStates.length
      ? 0
      : currentState + 1
    Session.set(
      'show',
      showStates[newState]
    )
  }
})

Template.pad.helpers({
  showRendered,
  both: () => Session.get('show') === 'both' ? 'both' : '',
  isLocked,
  showDisplay,
  showTextArea,
})

const updateDoc = _.throttle(value => {
  if (!isLocked()) lock()
  Meteor.call(
    'updateDoc',
    Session.get('document'),
    value,
    Session.get('clientId')
  )
})

Template.pad.events({
  keyup: (e) => {
    // TODO implement saving sign
    updateDoc(e.target.value)
  }
})

