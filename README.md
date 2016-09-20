# Tilegrams

A “tilegram” is a map made of tiles
where regions are sized proportionally to a dataset.

One day, we got [really interested](https://twitter.com/pitchinc/status/765962981855199232)
in cartograms made from hexagons.

**Please read the [MANUAL](MANUAL.md)**

## Development

### Setup

After cloning the repository, run:

    npm i

### Running

Run

    npm start

Then access `http://localhost:8080/`.

### Deploying

To generate deployable assets, run:

    npm run build

They will be written to `dist/`.

## Dependencies

JavaScript is written in [ES2015](https://babeljs.io/docs/learn-es2015/)
using [Babel](https://babeljs.io/). Styles are written in
[SASS](http://sass-lang.com/). All assets are preprocessed with
[webpack](https://webpack.github.io/).

The Maker also depends on a pre-release `npm` version of `topogram`
(formerly `cartogram.js`) as seen in
[this PR](https://github.com/shawnbot/topogram/pull/26).

## Data Sources
[Population Data](http://factfinder.census.gov/faces/tableservices/jsf/pages/productview.xhtml?pid=PEP_2015_PEPANNRES&prodType=table)

[Electoral Votes Data](https://www.archives.gov/federal-register/electoral-college/allocation.html)

[GDP Data](http://www.bea.gov/itable/)

# License

This software is distributed under the [ISC](https://spdx.org/licenses/ISC.html)
license.
