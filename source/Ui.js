import React from 'react'
import ReactDOM from 'react-dom'

import metrics from './Metrics'
import {createElement} from './utils'
import {nTileDomain} from './constants'
import TileGenerationUiControls from './components/TileGenerationUiControls'
import HexMetrics from './components/HexMetrics'
import ExportButton from './components/ExportButton'
import EditWarningModal from './components/EditWarningModal'
import googleNewsLabLogo from './images/gnl-logo.png'

class Ui {
  constructor() {
    this._init()
    this._tiles = null
    this._editing = false

    this._startOver = this._startOver.bind(this)
    this._resumeEditing = this._resumeEditing.bind(this)
    this._resizeAfterPaint = this._resizeAfterPaint.bind(this)
    window.addEventListener('resize', this._resize)
  }

  _resize() {
    const heightAvailable = Array.prototype.slice.call(
      document.querySelectorAll('.no-scroll-ui')
    ).reduce(
      (remainingHeight, node) => {
        const dimensions = node.getBoundingClientRect()
        return remainingHeight - dimensions.height
      },
      window.innerHeight - 15
    )
    const ele = document.querySelector('.metrics')
    if (ele) {
      ele.style.height = `${heightAvailable}px`
    }
  }

  setGeos(geos) {
    this._geos = geos
  }

  setTiles(tiles) {
    this._tiles = tiles
  }

  setAddTileCallback(callback) {
    this._addTileCallback = callback
  }

  setDatasetLabels(datasetLabels) {
    this._datasetLabels = datasetLabels
  }

  setTilegramLabels(tilegramLabels) {
    this._tilegramLabels = tilegramLabels
  }

  setSelectedDataset(dataset) {
    this._selectedDataset = dataset
    this._selectedDatasetSum = this.getDatasetSum(dataset)
    this._metricDomain = this._calculateIdealDomain()
    this._resize()
  }

  /** calculate the slider's domain from the dataset */
  _calculateIdealDomain() {
    const metricMin = this.roundToPretty(this._selectedDatasetSum / nTileDomain[0])
    const metricMax = this.roundToPretty(this._selectedDatasetSum / nTileDomain[1])
    return [metricMax, metricMin]
  }

  /** round to two significant digits rounded to nearest multiple of 5 */
  roundToPretty(number) {
    const units = Math.pow(10, Math.floor(Math.log10(number)) - 1)
    const significant = number / units
    const rounded = 5 * (Math.round(significant / 5))
    return rounded * units
  }

  getDatasetSum(dataset) {
    return dataset.reduce((a, b) => { return a + b[1] }, 0)
  }

  setDatasetSelectedCallback(callback) {
    this._datasetSelectedCallback = (index) => {
      callback(index)
      window.requestAnimationFrame(this._resize)
    }
  }

  setTilegramSelectedCallback(callback) {
    this._tilegramSelectedCallback = (index) => {
      callback(index)
      window.requestAnimationFrame(this._resize)
    }
  }

  setCustomDatasetCallback(callback) {
    this._customDatasetCallback = (csv) => {
      callback(csv)
      window.requestAnimationFrame(this._resize)
    }
  }

  setHightlightCallback(callback) {
    this._highlightCallback = callback
  }

  setUnhighlightCallback(callback) {
    this._unhighlightCallback = callback
  }

  setResolutionChangedCallback(callback) {
    this._resolutionChangedCallback = callback
  }

  setExportCallback(callback) {
    this._exportCallback = callback
  }

  setExportSvgCallback(callback) {
    this._exportSvgCallback = callback
  }

  setImportCallback(callback) {
    this._importCallback = (topoJson) => {
      callback(topoJson)
    }
  }

  _setEditing(isEditing) {
    return () => {
      if (!isEditing) {
        if (this._checkForUnsavedChanges()) {
          this._showModal = true
          this.render()
          return
        }
      }
      this._editing = isEditing
      this.render()

      // to allow CSS to paint
      window.requestAnimationFrame(this.render.bind(this))
    }
  }

  setUnsavedChangesCallback(callback) {
    this._checkForUnsavedChanges = callback
  }

  _init() {
    this._container = createElement({id: 'ui'})
  }

  _startOver() {
    this._editing = false
    this._showModal = false
    this.render()
  }

  _resumeEditing() {
    this._showModal = false
    this.render()
  }

  setEditingTrue() {
    this._editing = true
    this.render()
  }

  _resizeAfterPaint() {
    window.requestAnimationFrame(this._resize.bind(this))
  }

  render() {
    const tileGenerationControls = (
      <TileGenerationUiControls
        datasetLabels={this._datasetLabels}
        tilegramLabels={this._tilegramLabels}
        selectDataset={this._datasetSelectedCallback}
        selectTilegram={this._tilegramSelectedCallback}
        selectCustomDataset={this._customDatasetCallback}
        importCustom={this._importCallback}
        metricDomain={this._metricDomain}
        metricPerTile={metrics.metricPerTile}
        changeResolution={this._resolutionChangedCallback}
        datasetSum={this._selectedDatasetSum}
        onResizeNeeded={this._resizeAfterPaint}
        editing={this._editing}
      />
    )
    const generateOption = (
      <div
        className={this._editing ? 'step' : 'active step'}
        onClick={this._setEditing(false)}
      >
        <div className='highlight-bar' />
        <p><span>1</span> Begin with a tilegram</p>
      </div>
    )
    const editOption = (
      <div
        className={this._editing ? 'active step' : 'step'}
        onClick={this._setEditing(true)}
      >
        <div className='highlight-bar' />
        <p><span>2</span> Refine your tilegram</p>
      </div>
    )
    let modal = null
    if (this._showModal) {
      modal = (
        <EditWarningModal
          startOver={this._startOver}
          resumeEditing={this._resumeEditing}
        />
      )
    }
    ReactDOM.render(
      <div>
        {modal}
        <div className='column'>
          <div className='no-scroll-ui'>
            <h1 className='title'>
              Make a Tilegram
            </h1>
            <p className='intro'>
              A “tilegram” is a map made of tiles
              where regions are sized proportionally to a dataset.
              <br />
              <a
                href='https://github.com/PitchInteractiveInc/tilegrams/blob/master/MANUAL.md'
                target='_blank'
                rel='noopener noreferrer'
              >
                Read the manual
              </a>
            </p>
            <hr />
            {generateOption}
            <div className={this._editing ? 'deselected' : null} >
              {tileGenerationControls}
            </div>
            <hr />
            {editOption}
          </div>
          <div className={this._editing ? null : 'deselected'}>
            <HexMetrics
              metricPerTile={metrics.metricPerTile}
              dataset={this._selectedDataset}
              geos={this._geos}
              tiles={this._tiles}
              onAddTileMouseDown={this._addTileCallback}
              onMetricMouseOver={this._highlightCallback}
              onMetricMouseOut={this._unhighlightCallback}
            />
          </div>
          <div className='no-scroll-ui'>
            <fieldset>
              <ExportButton
                text='Export TopoJSON'
                onClick={() => this._exportCallback()}
              />
              <ExportButton
                text='Export SVG'
                onClick={() => this._exportSvgCallback()}
              />
            </fieldset>
          </div>
        </div>
        <h2 className='credits'>
          A project by
          <a
            href='http://pitchinteractive.com/'
            target='_blank'
            rel='noopener noreferrer'
          >
            Pitch Interactive
          </a>
          in association with
          <a
            href='https://newslab.withgoogle.com/'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img src={googleNewsLabLogo} className='gnl-logo' alt='Google News Lab' />
          </a>
          |
          View
          <a
            href='https://github.com/PitchInteractiveInc/tilegrams'
            target='_blank'
            rel='noopener noreferrer'
          >
            source
          </a>
          on GitHub
        </h2>
      </div>,
      this._container
    )
    this._resize()
  }
}

export default new Ui()
