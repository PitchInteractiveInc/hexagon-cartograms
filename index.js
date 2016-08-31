import data from './source/Data'
import canvas from './source/Canvas'
import ui from './source/Ui'
import exporter from './source/file/Exporter'
import mapData from './source/MapData'
import hexagonGrid from './source/HexagonGrid'
import {startDownload} from './source/utils'

require('./source/css/main.scss')

function selectDataset(dataset) {
  ui.setSelectedDataset(dataset)
  canvas.computeCartogram({
    topoJson: mapData.getTopoJson(),
    properties: dataset,
  })
}

function updateUi() {
  ui.render(
    canvas.getGrid().getTiles(),
    canvas.getGrid().getOriginalTilesLength()
  )
}

// wire up callbacks
function init() {
  canvas.getGrid().onChange(() => updateUi())
  ui.setAddTileCallback(id => canvas.getGrid().onAddTileMouseDown(id))
  ui.setDatasetSelectedCallback(index => selectDataset(data.getDataset(index)))
  ui.setCustomDatasetCallback(csv => selectDataset(data.parseCsv(csv)))
  ui.setHightlightCallback(id => canvas.getGrid().onHighlightGeo(id))
  ui.setUnhighlightCallback(() => canvas.getGrid().resetHighlightedGeo())
  ui.setResolutionChangedCallback(value => {
    hexagonGrid.setTileEdge(value)
    canvas.updateTiles()
  })
  ui.setExportCallback(() => {
    const json = exporter.formatTopoJson(canvas.getGrid().getTiles())
    startDownload({
      filename: 'hexagon-cartogram.json',
      mimeType: 'application/json',
      content: JSON.stringify(json),
    })
  })

  // populate
  ui.setGeos(mapData.getUniqueFeatureIds())
  ui.setDatasetLabels(data.getLabels())
  selectDataset(data.getDataset(0))
  updateUi()
}

init()
