const {processScores, accumulate, evaluate} = require('../src/result')

jest.mock('lighthouse/lighthouse-core/lib/file-namer', () => ({
  getFilenamePrefix: () => 'report'
}))

describe('result', () => {
  it('.processScores() should process the score value', () => {
    const categories = [{
      score: 0.12
    }, {
      score: 0.76
    }]
    const processedScores = processScores(categories)
    expect(processedScores.length).toBe(2)
    expect(processedScores[0].score).toBe(12)
    expect(processedScores[1].score).toBe(76)
  })
  it('.processScores() should pick specific keys', () => {
    const categories = [{
      unknown: 1,
      id: 'two',
      score: 0.3,
      title: 'four'
    }]
    expect(Object.keys(processScores(categories)[0])).toEqual(['id', 'score', 'title'])
  })
  it('.accumulate() should ', () => {
    const result = {
      lhr: {
        categories: {
          performance: {
            score: 0.59
          }
        },
        finalUrl: 'https://www.immonet.de'
      },
      report: 'REPORT'
    }
    const accumulated = accumulate(result)
    expect(accumulated.scores.length).toBe(1)
    expect(accumulated.scores[0].score).toBe(59)
    expect(accumulated.url).toBe('https://www.immonet.de')
    expect(accumulated.report).toBe('REPORT')
    expect(accumulated.reportName).toBe('report.html')
  })
  it('.evaluate() create threshold error messages', () => {
    const thresholds = {
      pwa: 75,
      seo: 50,
      performance: 100
    }
    const result = {
      url: 'https://www.immonet.de',
      scores: [{
        id: 'pwa',
        score: 50,
        title: 'PWA'
      }, {
        id: 'seo',
        score: 25,
        title: 'SEO'
      }, {
        id: 'performance',
        score: 100,
        title: 'Performance'
      }]
    }
    const evaluated = evaluate(result, thresholds)
    expect(evaluated.length).toBe(2)
    expect(evaluated[0]).toBe('PWA threshold not met: 50/75 [https://www.immonet.de]')
    expect(evaluated[1]).toBe('SEO threshold not met: 25/50 [https://www.immonet.de]')
  })
})
