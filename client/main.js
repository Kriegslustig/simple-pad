let currentTime = new ReactiveVar((new Date).getTime())
const showStates = [
  'write',
  'display',
  'both'
]

const stateHash = LocationHash(showStates)

Session.setDefault('show', showStates[0])

setInterval(() => {
  currentTime.set((new Date).getTime())
}, 1000)

const isLocked = () => {
  let pad = Pads.findOne()
  return (
    pad
    && (
      pad.lock.clientId
      && pad.lock.clientId !== Session.get('clientId')
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
    null,
    Session.get('clientId')
  )

const unlock = getter => (...args) =>
  Meteor.call(
    'updateDoc',
    Session.get('document'),
    getter(...args),
    null
  )

const updateTextArea = (templateInstance, force) => () => {
  const element = templateInstance.find('textarea')
  if (!element) return
  const text = element.value
  if (force || !text || text === '' || isLocked()) {
    element.value = showRendered()
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
      /* Update the textarea as soon as the document loads */
      setTimeout(updateTextArea(this, true))
    }
  })
  /* Seperate autorun, should only run when isLocked changes */
  let currentLockState = isLocked()
  Tracker.autorun(() => {
    /* As soon as the pad gets unlocked */
    if (!isLocked() && currentLockState) {
      currentLockState = false
      /* Update the textarea */
      updateTextArea(this, true)()
    } else {
      currentLockState = isLocked()
    }
  })

  /* Runs whenever the hash chagnes to update Session.show */
  Tracker.autorun(() => {
    const newState = stateHash.get()
    if (newState) Session.set('show', newState)
  })

  /* Updates Session */
  Tracker.autorun(() => {
    const newState = Session.get('show')
    if (newState) stateHash.set(newState)
  })
})

Template.pad.onDestroyed(function () {
  window.clearInterval(intervalId)
})

Template.pad.events({
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
  isLocked,
  showDisplay,
  showTextArea,
  both: () => Session.get('show') === 'both' ? 'both' : '',
  getShow: () => Session.get('show'),
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
    updateDoc(e.target.value)
  },
  focus: lock,
  blur: unlock(e => e.target.value),
})

