module.exports = option => require('./lib/ui')(Object.assign(option, {
  isApiMode: true
}));