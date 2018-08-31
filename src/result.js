const pick = require('lodash.pick')
const {format} = require('util')
const {getFilenamePrefix} = require('lighthouse/lighthouse-core/lib/file-namer')

const processScores = categories => categories
  .map(category => pick(category, 'id', 'score', 'title'))
  .map(category => Object.assign(category, {score: Math.round(category.score * 100)}))

const accumulate = result => ({
  scores: processScores(Object.values(result.lhr.categories)),
  url: result.lhr.finalUrl,
  reportName: `${getFilenamePrefix(result.lhr)}.html`,
  report: result.report
})

const evaluate = (result, thresholds) => result.scores.reduce((score, value) => {
  if (value.score < thresholds[value.id]) {
    score.push(format('%s threshold not met: %i/%i [%s]', value.title, value.score, thresholds[value.id], result.url))
  }
  return score
}, [])

module.exports = {processScores, accumulate, evaluate}
