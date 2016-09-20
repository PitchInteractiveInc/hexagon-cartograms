import canvas from './source/Canvas'
import ui from './source/Ui'
import exporter from './source/file/Exporter'
import importer from './source/file/Importer'
import datasetResource from './source/resources/DatasetResource'
import mapResource from './source/resources/MapResource'
import tilegramResource from './source/resources/TilegramResource'
import gridGeometry from './source/geometry/GridGeometry'
import {startDownload, isDevEnvironment} from './source/utils'
import {updateCanvasSize} from './source/constants'

require('./source/css/main.scss')
require('font-awesome/scss/font-awesome.scss')

const CARTOGRAM_COMPUTE_FPS = 60.0

let cartogramComputeTimer

let importing = false
let metricPerTile = null
let sumMetrics = null

function selectDataset(dataset) {
  importing = false
  ui.setSelectedDataset(dataset)
  canvas.computeCartogram(dataset)
  clearInterval(cartogramComputeTimer)
  cartogramComputeTimer = setInterval(() => {
    const iterated = canvas.iterateCartogram()
    if (iterated) {
      canvas.updateTilesFromMetrics(metricPerTile, sumMetrics)
    }
  }, 1000.0 / CARTOGRAM_COMPUTE_FPS)
}

function updateUi() {
  ui.setTiles(canvas.getGrid().getTiles())
  ui.render()
}

function loadTopoJson(topoJson) {
  importing = true
  const {tiles, newMetricPerTile, cartogramArea} = importer.fromTopoJson(topoJson)
  const dataset = datasetResource.buildDatasetFromTiles(tiles)

  ui.setSelectedDataset(dataset)
  ui.metricPerTile = newMetricPerTile
  canvas.importTiles(tiles, cartogramArea)
  updateUi()
}

function confirmNavigation(e) {
  // most browsers won't let you display custom text but have something like this anyway
  const message = 'Are you sure you want to leave this page? You will lose any unsaved work.'
  e.returnValue = message
  return message
}

function init() {
  // wire up callbacks
  canvas.getGrid().onChange(() => updateUi())
  canvas.getGrid().setUiEditingCallback(() => ui.setEditingTrue())
  ui.setAddTileCallback(id => canvas.getGrid().onAddTileMouseDown(id))
  ui.setDatasetSelectedCallback(index => selectDataset(datasetResource.getDataset(index)))
  ui.setTilegramSelectedCallback(index => {
    loadTopoJson(tilegramResource.getTilegram(index))
  })
  ui.setCustomDatasetCallback(csv => selectDataset(datasetResource.parseCsv(csv)))
  ui.setHightlightCallback(id => canvas.getGrid().onHighlightGeo(id))
  ui.setUnhighlightCallback(() => canvas.getGrid().resetHighlightedGeo())
  ui.setResolutionChangedCallback((newMetricPerTile, newSumMetrics) => {
    if (importing) {
      return
    }
    metricPerTile = newMetricPerTile // for tile calculation
    sumMetrics = newSumMetrics
    ui.metricPerTile = newMetricPerTile
    canvas.updateTilesFromMetrics(newMetricPerTile, newSumMetrics)
  })
  ui.setUnsavedChangesCallback(() => canvas.getGrid().checkForEdits())
  ui.setExportCallback(() => {
    const json = exporter.toTopoJson(
      canvas.getGrid().getTiles(),
      ui.metricPerTile,
      canvas.getCartogramArea()
    )
    startDownload({
      filename: 'tiles.topo.json',
      mimeType: 'application/json',
      content: JSON.stringify(json),
    })
  })
  ui.setExportSvgCallback(() => {
    const svg = exporter.toSvg(canvas.getGrid().getTiles())
    startDownload({
      filename: 'tiles.svg',
      mimeType: 'image/svg+xml',
      content: svg,
    })
  })
  ui.setImportCallback(loadTopoJson)

  // populate
  ui.setGeos(mapResource.getUniqueFeatureIds())
  ui.setDatasetLabels(datasetResource.getLabels())
  ui.setTilegramLabels(tilegramResource.getLabels())
  loadTopoJson(tilegramResource.getTilegram(0))
  updateUi()
  if (!isDevEnvironment()) {
    window.addEventListener('beforeunload', confirmNavigation)
  }
}

function resize() {
  updateCanvasSize()
  canvas.resize()
  gridGeometry.resize()
  canvas.getMap().updatePreProjection()
}
window.onresize = resize
resize()

init()
