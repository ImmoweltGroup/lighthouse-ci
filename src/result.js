const pick = require('lodash.pick')
const { format } = require('util')
const { getFilenamePrefix } = require('lighthouse/lighthouse-core/lib/file-namer')
const { getConfig, CONFIG_THRESHOLD_DESCRIPTOR } = require('./config')

const processScores = categories => categories
  .map(category => pick(category, 'id', 'score', 'title'))
  .map(category => Object.assign(category, { score: Math.round(category.score * 100) }))

const accumulate = result => ({
  scores: processScores(Object.values(result.lhr.categories)),
  url: result.lhr.finalUrl,
  reportName: `${getFilenamePrefix(result.lhr)}.html`,
  report: result.report
})

const evaluate = (result, thresholds) => result.scores.reduce((score, value) => {
  const config = getConfig()
  let threshold
  if (config && config.hasOwnProperty(CONFIG_THRESHOLD_DESCRIPTOR)) { threshold = { ...config.threshold } || {} }

  const thresholdScore = thresholds[value.id] === 0 && threshold.hasOwnProperty(value.id) ? threshold[value.id] : thresholds[value.id]
  if (value.score < thresholdScore) {
    score.push(format('%s threshold not met: %i/%i [%s]', value.title, value.score, thresholdScore, result.url))
  }
  return score
}, [])

module.exports = { processScores, accumulate, evaluate }
