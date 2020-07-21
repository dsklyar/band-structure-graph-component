# "Band Structure" Chart Component

This repo is a showcase of work done for a challenge assigned by the material project team at UC Berkeley. The challenge was to take on designing and features used to replace the static plots of [band structure](https://en.wikipedia.org/wiki/Electronic_band_structure). The core request were plotting a graph derived from provided JSON file, allowing user to "mark" the graph, and saving functionality with a watermark. Example showcased on material's project website [here](https://materialsproject.org/materials/mp-3666/).

Here is the [live demo](https://dsklyar.github.io/band-structure-graph-component/) of my take on it

## Set-up:

> 1. run `npm install` command and wait for install to complete
> 2. run `npm install -g webpack-dev-server` commnad to install webpack server
> 3. run `npm start` command and wait for web-page to open

## How to use:

> 1. Click once on the graph to display mark line
> 2. If needed, adjust the energy range
> 3. Click save button
> 4. Click once on the graph to hide the graph mark

## Technologies used:

> - [React](https://github.com/facebook/react/)
> - [Recharts](https://github.com/recharts/recharts)
> - [ReactJSS](https://github.com/cssinjs/jss)
> - [Dom2Image](https://github.com/tsayen/dom-to-image)
> - [FileSaver](https://github.com/eligrey/FileSaver.js/)
> - [Webpack](https://github.com/webpack/webpack)
