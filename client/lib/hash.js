const hashChange = new Tracker.Dependency()

const getHashFromURL = () => window.location.hash.length > 0
  ? window.location.hash.substr(1)
  : null

let hash = getHashFromURL()

const getHash = () => {
  hashChange.depend()
  return hash
}

const setHash = (newHash) => {
  if (typeof newHash === 'string') {
    hash = newHash
    window.location.hash = `#${hash}`
  } else {
    hash = getHashFromURL()
  }
  hashChange.changed()
}

window.addEventListener('hashchange', setHash)

LocationHash = validStates => ({
  /* This might look a little weird, but I use it as a haskell `in` operator */
  get: () => (
    hash => validStates.find(s => s === hash)
  )(getHash()),
  set: setHash
})

