# Making a tilegram

A “tilegram” is a map made of tiles
where regions are sized proportionally to a dataset.
The name is short for a tiled
[cartogram](https://en.wikipedia.org/wiki/Cartogram).
Tilegrams can represent demographic data more truthfully than conventional,
geographic maps, while still retaining a familiar appearance.

This free, open-source tool enables news designers and developers
to browse existing tilegrams or make their own for use in interactive
and print publication.

Even with computer automation, tilegrams can be time-consuming to produce,
because, to be effective, they require a human eye to verify that geographic
contours will be recognizable and meaningful to a general readership. For this
reason, you're encouraged to begin with existing tilegrams before authoring
your own.

This manual proceeds from the most basic to the most advanced usage case.

## Exporting existing tilegrams

On load, you will see a ready-made tilegram, as selected in the
**Load existing** menu. Try selecting other options to browse around.

If you are satisfied with the tilegram as it appears, go right ahead and
**Export**—as **TopoJSON** or **SVG**—using the buttons at the lower left.

Designers will be able to import the SVG into their software of choice
(e.g. Illustrator) and developers will be able to pull the TopoJSON into
web applications. In both cases, the data is identified with the US
[FIPS](https://en.wikipedia.org/wiki/Federal_Information_Processing_Standards)
code.

## Editing tilegrams

Suppose you've loaded a tilegram, but want to reshape a region. Maybe Florida
looks too heavy, or Missouri is streched too thin.

Click step **2**: **Refine your tilegram**.

### Moving tiles around

Click and drag any tile to move it around.

To move many tiles around, click and drag a
rectangular marquee around them, and then drag them around.

To move just a specific region around, double-click
any tile in it to select them all—then drag them around.

You can also hover over a region in the **State Tiles**
sidebar area to see that region's tiles highlighted on the map.

### Ensuring statistical accuracy

Under **State Tiles**, you'll see a list of each state with a number and a
hexagon.

The number indicates the _delta inaccuracy_ between the number of tiles that
region _currently_ has on the map and how many it _should_ have, based on the
dataset. If the delta is positive, that region has too many tiles on the map.
If the delta is negative, it doesn't have enough tiles on the map. If there
is a warning sign, then that region has _no_ tiles on the map; that may be
alright in certain situations, but unacceptable in others.

(_Why does this happen?_ It is computationally very difficult to produce
tilegrams which are accurate _and_ recognizable. As you begin to make
cartograms, you'll appreciate the difficult trade-offs you must make between
preserving the approximate shapes of regions and their adjacency to other
regions.)

To remove a tile from the map, click it, and hit 'Delete' on your keyboard.

To add a tile to the map, click the hexagon from the left sidebar and drag it
onto the map.

## Generating new tilegrams

If you've made it this far, you are ready to produce your own tilegram.

Select **Generate from data**. You will see the tilegram generated before your
eyes, by beginning with a conventional geographic map and then progressively
resizing its regions to conform to the selected dataset.

Under **Dataset**, you may select one of a few prepared datasets, or input
your own **Custom CSV**, by pasting in a dataset in the format specified,
using US FIPS codes.

Then you may alter the resolution in two ways. The most visually gratifying is
to click and grab the **Resolution** slider and watch as the tiles are
re-computed in realtime. The other, more statistically accurate way is to click
into the **Per tile** field and entire your desired value per tile. For example,
if you are using population to scale the regions of your tilegram, you might
enter `500,000` so that each tile corresponds to (approximately) five hundred
thousand people.

As you adjust the **Dataset** and **Resolution**/**Per tile**, you'll notice
that the _deltas_ under **State Tiles** update dynamically. Please remember
to take note of them and ensure that they all read `0` to make responsible
tilegrams.

## Sharing tilegrams

If you use, enjoy, or can't stand this tool, we'd love to hear from you at
[@pitchinc](http://twitter.com/pitchinc) or
[info@pitchinteractive.com](mailto:info@pitchinteractive.com).
We hope to include more example tilegrams in the application.

Happy tilegramming!
