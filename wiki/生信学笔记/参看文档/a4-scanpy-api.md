---
title: scanpy API 参考（查阅材料）
collection:
  profile: wiki
  id: 生信学笔记
active_menu: 生信学笔记
date: '2026-10-05'
tags:
- 生信
- 教材
---

{% raw %}# scanpy API 参考（查阅材料）

## 编者导语

本附录收录 scanpy 的 API 参考，按模块组织，用于查证函数签名、参数含义与返回对象。 它合并了原站点的两份材料：手写的 API 说明页，以及由文档自动生成的条目—— 后者逐条罗列参数，量大但结构统一，编者保留其原始形式而未改写， 因为逐条手抄这种材料既无必要也会引入错误。 **请注意定位：这是查找用的索引，不是教程，不建议通读。** 需要理解某个步骤该怎么做，请回正文 [ch46](/wiki/生信学笔记/参看文档/ch46/) 的工作流；想知道某个参数是什么， 再到这里查。使用时请区分文档标注的稳定 API 与实验性功能， 编者保留了原站点的标注方式未做统一。抓取日期见附录末来源说明。

### Classes

### Classes #

`AnnData` is reexported from `anndata` .

Represent data as a neighborhood structure, usually a knn graph.

```
Neighbors
```

Data represented as graph of nearest neighbors.

### Datasets


datasets.blobs Gaussian Blobs.

datasets.ebi\_expression\_atlas Load a dataset from the EBI Single Cell Expression Atlas.

datasets.krumsiek11 Simulated myeloid progenitors [Krumsiek et al., 2011].

datasets.moignard15 Hematopoiesis in early mouse embryos [Moignard et al., 2015].

datasets.pbmc3k 3k PBMCs from 10x Genomics.

datasets.pbmc3k\_processed Processed 3k PBMCs from 10x Genomics.

datasets.pbmc68k\_reduced Subsampled and processed 68k PBMCs.

datasets.paul15 Development of Myeloid Progenitors [Paul et al., 2015].

datasets.toggleswitch Simulated toggleswitch.

Processed Visium Spatial Gene Expression data from 10x Genomics datasets.visium\_sge database.

By Scanpy development team

© Copyright 2026, scverse.

### Experimental

### Experimental #

New methods that are in early development which are not (yet) integrated in Scanpy core.

```
experimental.pp.normalize_pearson_residuals
```

Apply analytic Pearson residual normalization, based on Lause et al. [ 2021 ]

.

```
experimental.pp.normalize_pearson_residuals_pca
```

Apply analytic Pearson residual normalization and PCA, based on Lause et al. [ 2021 ]

.

```
experimental.pp.highly_variable_genes
```

Select highly variable genes using analytic Pearson residuals [ Lause et al. , 2021 ]

.

```
experimental.pp.recipe_pearson_residuals
```

Full pipeline for HVG selection and normalization by analytic Pearson residuals [ Lause et al. , 2021 ]

.

### Get object from AnnData: get

### Get object from `AnnData` : `get` #

The module `sc.get` provides convenience functions for getting values back in useful formats.

```
get.obs_df
```

Return values for observations in adata.

```
get.var_df
```

Return values for observations in adata.

```
get.rank_genes_groups_df
```

Get `scanpy.tl.rank_genes_groups()` results in the form of a `DataFrame` .

```
get.aggregate
```

Aggregate data matrix based on some categorical grouping.

### API

#### Contents

### API #

Import Scanpy as:

```
import scanpy as sc
```

Note

Additional functionality is available across the broader scverse ecosystem, with some tools wrapped in the `scanpy.external` module.

#### Array type support #

Different APIs have different levels of support for array types, and this page lists the supported array types for each function (⚡ indicates support of the type as chunk in a dask `Array` ):

Function

```
ndarray
```

|  | `csr_array` / `csr_matrix` | `csc_array` / `csc_matrix` |
|---|---|---|
|  |  |  |

```
scanpy.experimental.pp.highly_variable_genes()
```

|  | ✅ | ✅ | ✅ |
|---|---|---|---|
|  |  |  |  |

```
scanpy.get.aggregate()
```

|  | ✅ ⚡ | ✅ ⚡ | ✅ ⚡ |
|---|---|---|---|
|  |  |  |  |

```
scanpy.pp.calculate_qc_metrics()
```

|  | ✅ ⚡ | ✅ ⚡ | ✅ ⚡ |
|---|---|---|---|
|  |  |  |  |

```
scanpy.pp.combat()
```

|  | ✅ | ❌ | ❌ |
|---|---|---|---|
|  |  |  |  |

```
scanpy.pp.downsample_counts()
```

|  | ✅ | ✅ | ❌ |
|---|---|---|---|
|  |  |  |  |

```
scanpy.pp.filter_cells()
```

|  | ✅ ⚡ | ✅ ⚡ | ✅ ⚡ |
|---|---|---|---|
|  |  |  |  |

```
scanpy.pp.filter_genes()
```

|  | ✅ ⚡ | ✅ ⚡ | ✅ ⚡ |
|---|---|---|---|
|  |  |  |  |

```
scanpy.pp.highly_variable_genes()
```

|  | ✅ ⚡ | ✅ ⚡ | ✅ |
|---|---|---|---|
|  |  |  |  |

```
scanpy.pp.log1p()
```

|  | ✅ ⚡ | ✅ ⚡ | ✅ ⚡ |
|---|---|---|---|
|  |  |  |  |

```
scanpy.pp.neighbors()
```

|  | ✅ | ✅ | ✅ |
|---|---|---|---|
|  |  |  |  |

```
scanpy.pp.normalize_total()
```

|  | ✅ ⚡ | ✅ ⚡ | ❌ |
|---|---|---|---|
|  |  |  |  |

```
scanpy.pp.pca()
```

|  | ✅ ⚡ | ✅ ⚡ | ✅ |
|---|---|---|---|
|  |  |  |  |

```
scanpy.pp.regress_out()
```

|  | ✅ | ❌ | ❌ |
|---|---|---|---|
|  |  |  |  |

```
scanpy.pp.sample()
```

|  | ✅ ⚡ | ✅ ⚡ | ✅ ⚡ |
|---|---|---|---|
|  |  |  |  |

```
scanpy.pp.scale()
```

|  | ✅ ⚡ | ✅ ⚡ | ✅ ⚡ |
|---|---|---|---|
|  |  |  |  |

```
scanpy.pp.scrublet()
```

|  | ✅ | ✅ | ✅ |
|---|---|---|---|
|  |  |  |  |

```
scanpy.pp.scrublet_simulate_doublets()
```

|  | ✅ | ✅ | ✅ |
|---|---|---|---|
|  |  |  |  |

```
scanpy.tl.dendrogram()
```

|  | ✅ | ✅ | ✅ |
|---|---|---|---|
|  |  |  |  |

```
scanpy.tl.diffmap()
```

|  | ✅ | ✅ | ✅ |
|---|---|---|---|
|  |  |  |  |

```
scanpy.tl.dpt()
```

|  | ✅ | ✅ | ✅ |
|---|---|---|---|
|  |  |  |  |

```
scanpy.tl.draw_graph()
```

|  | ✅ | ✅ | ✅ |
|---|---|---|---|
|  |  |  |  |

```
scanpy.tl.embedding_density()
```

|  | ✅ | ❌ | ❌ |
|---|---|---|---|
|  |  |  |  |

```
scanpy.tl.ingest()
```

|  | ✅ | ✅ | ✅ |
|---|---|---|---|
|  |  |  |  |

```
scanpy.tl.leiden()
```

|  | ✅ | ✅ | ✅ |
|---|---|---|---|
|  |  |  |  |

```
scanpy.tl.louvain()
```

|  | ✅ | ✅ | ✅ |
|---|---|---|---|
|  |  |  |  |

```
scanpy.tl.paga()
```

|  | ✅ | ✅ | ✅ |
|---|---|---|---|
|  |  |  |  |

```
scanpy.tl.rank_genes_groups()
```

|  | ✅ | ✅ | ✅ |
|---|---|---|---|
|  |  |  |  |

```
scanpy.tl.score_genes()
```

|  | ✅ | ✅ | ✅ |
|---|---|---|---|
|  |  |  |  |

```
scanpy.tl.tsne()
```

|  | ✅ | ✅ | ✅ |
|---|---|---|---|
|  |  |  |  |

```
scanpy.tl.umap()
```

|  | ✅ | ✅ | ✅ |
|---|---|---|---|

### Reading and Writing

### Reading and Writing #

Write `AnnData` objects using its writing methods

```
write
```

Write `AnnData`

objects to file.

Note

For reading annotation use pandas.read_… and add it to your `AnnData` object. The following read functions are intended for the numeric data in the data matrix `X` .

Read common file formats using

```
read
```

Read file and return `AnnData`

object.

Read 10x formatted hdf5 files and directories containing `.mtx` files using

```
read_10x_h5
```

Read 10x-Genomics-formatted hdf5 file.

```
read_10x_mtx
```

Read 10x-Genomics-formatted mtx directory.

```
read_visium
```

Read 10x-Genomics-formatted visum dataset.

Read other formats using functions borrowed from `anndata`

```
read_h5ad
```

Read `.h5ad` -formatted hdf5 file.

```
read_csv
```

Read `.csv` file.

```
read_excel
```

Read `.xlsx` (Excel) file.

```
read_hdf
```

Read `.h5` (hdf5) file.

```
read_loom
```

Read `.loom` -formatted hdf5 file.

```
read_mtx
```

Read `.mtx` file.

```
read_text
```

Read `.txt` , `.tab` , `.data` (text) file.

```
read_umi_tools
```

Read a gzipped condensed count matrix from umi_tools.

### Metrics

### Metrics #

Collections of useful measurements for evaluating results.

```
metrics.modularity
```

Compute the modularity of a graph given its connectivities and labels.

```
metrics.confusion_matrix
```

Given an original and new set of labels, create a labelled confusion matrix.

```
metrics.gearys_c
```

Calculate Geary's C

.

```
metrics.morans_i
```

Calculate Moran’s I Global Autocorrelation Statistic.

### Plotting: pl

#### Contents

### Plotting: `pl` #

The plotting module `scanpy.pl` largely parallels the `tl.*` and a few of the `pp.*` functions. For most tools and for some preprocessing functions, you’ll find a plotting function with the same name.

See Core plotting functions for an overview of how to use these functions.

Note

See the Settings section for all important plotting configurations.

#### Generic #

```
pl.scatter
```

Scatter plot along observations or variables axes.

```
pl.heatmap
```

Heatmap of the expression values of genes.

```
pl.dotplot
```

Make a dot plot of the expression values of `var_names` .

```
pl.tracksplot
```

Compact plot of expression of a list of genes.

```
pl.violin
```

Violin plot.

```
pl.stacked_violin
```

Stacked violin plots.

```
pl.matrixplot
```

Create a heatmap of the mean expression values per group of each var_names.

```
pl.clustermap
```

Hierarchically-clustered heatmap.

```
pl.ranking
```

Plot rankings.

```
pl.dendrogram
```

Plot a dendrogram of the categories defined in `groupby` .

#### Classes #

These classes allow fine tuning of visual parameters.

```
pl.DotPlot
```

Allows the visualization of two values that are encoded as dot size and color.

```
pl.MatrixPlot
```

Allows the visualization of values using a color map.

```
pl.StackedViolin
```

Stacked violin plots.

#### Preprocessing #

Methods for visualizing quality control and results of preprocessing functions.

```
pl.highest_expr_genes
```

Fraction of counts assigned to each gene over all cells.

```
pl.highly_variable_genes
```

Plot dispersions or normalized variance versus means for genes.

```
pl.scrublet_score_distribution
```

Plot histogram of doublet scores for observed transcriptomes and simulated doublets.

#### Tools #

Methods that extract and visualize tool-specific annotation in an `AnnData` object. For any method in module `tl` , there is a method with the same name in `pl` .

##### PCA #

```
pl.pca
```

Scatter plot in PCA coordinates.

```
pl.pca_loadings
```

Rank genes according to contributions to PCs.

```
pl.pca_variance_ratio
```

Plot the variance ratio.

```
pl.pca_overview
```

Plot PCA results.

##### Embeddings #

```
pl.tsne
```

Scatter plot in tSNE basis.

```
pl.umap
```

Scatter plot in UMAP basis.

```
pl.diffmap
```

Scatter plot in Diffusion Map basis.

```
pl.draw_graph
```

Scatter plot in graph-drawing basis.

```
pl.spatial
```

Scatter plot in spatial coordinates.

```
pl.embedding
```

Scatter plot for user specified embedding basis (e.g. umap, pca, etc).

Compute densities on embeddings.

```
pl.embedding_density
```

Plot the density of cells in an embedding (per condition).

##### Branching trajectories and pseudotime, clustering #

Visualize clusters using one of the embedding methods passing e.g. `color='leiden'` .

```
pl.dpt_groups_pseudotime
```

Plot groups and pseudotime.

```
pl.dpt_timeseries
```

Heatmap of pseudotime series.

```
pl.paga
```

Plot the PAGA graph through thresholding low-connectivity edges.

```
pl.paga_path
```

Gene expression and annotation changes along paths in the abstracted graph.

```
pl.paga_compare
```

Scatter and PAGA graph side-by-side.

Visualize hierarchical clustering results as a heatmap.

```
pl.correlation_matrix
```

Plot the correlation matrix computed as part of `scanpy.tl.dendrogram()`

.

##### Marker genes #

```
pl.rank_genes_groups
```

Plot ranking of genes.

```
pl.rank_genes_groups_violin
```

Plot ranking of genes for all tested comparisons.

```
pl.rank_genes_groups_stacked_violin
```

Plot ranking of genes using stacked_violin plot.

```
pl.rank_genes_groups_heatmap
```

Plot ranking of genes using heatmap plot (see `heatmap()`

).

```
pl.rank_genes_groups_dotplot
```

Plot ranking of genes using dotplot plot (see `dotplot()`

).

```
pl.rank_genes_groups_matrixplot
```

Plot ranking of genes using matrixplot plot (see `matrixplot()`

).

```
pl.rank_genes_groups_tracksplot
```

Plot ranking of genes using heatmap plot (see `heatmap()`

).

##### Simulations #

```
pl.sim
```

Plot results of simulation.

### Preprocessing: pp

#### Contents

### Preprocessing: `pp` #

Filtering of highly-variable genes, batch-effect correction, per-cell normalization, preprocessing recipes.

Any transformation of the data matrix that is not a tool. Other than tools, preprocessing steps usually don’t return an easily interpretable annotation, but perform a basic transformation on the data matrix.

#### Basic Preprocessing #

For visual quality control, see `highest_expr_genes()` and `filter_genes_dispersion()` in `scanpy.pl` .

```
pp.calculate_qc_metrics
```

Calculate quality control metrics.

```
pp.filter_cells
```

Filter cell outliers based on counts and numbers of genes expressed.

```
pp.filter_genes
```

Filter genes based on number of cells or counts.

```
pp.highly_variable_genes
```

Annotate highly variable genes [ Satija et al. , 2015 , Stuart et al. , 2019 , Zheng et al. , 2017 ]

.

```
pp.log1p
```

Logarithmize the data matrix.

```
pp.pca
```

Principal component analysis [ Pedregosa et al. , 2011 ]

.

```
pp.normalize_total
```

Normalize counts per cell.

```
pp.regress_out
```

Regress out (mostly) unwanted sources of variation.

```
pp.scale
```

Scale data to unit variance and zero mean.

```
pp.sample
```

Sample observations or variables with or without replacement.

```
pp.downsample_counts
```

Downsample counts from count matrix.

#### Recipes #

```
pp.recipe_zheng17
```

Normalize and filter as of Zheng et al. [ 2017 ]

.

```
pp.recipe_weinreb17
```

Normalize and filter as of [ Weinreb et al. , 2017 ]

.

```
pp.recipe_seurat
```

Normalize and filter as of Seurat [ Satija et al. , 2015 ]

.

#### Batch effect correction #

Also see Data integration. Note that a simple batch correction method is available via `pp.regress_out()` . Checkout `scanpy.external` for more.

```
pp.combat
```

ComBat function for batch effect correction [ Johnson et al. , 2006 , Leek et al. , 2017 , Pedersen, 2012 ]

.

#### Doublet detection #

```
pp.scrublet
```

Predict doublets using Scrublet [ Wolock et al. , 2019 ]

.

```
pp.scrublet_simulate_doublets
```

Simulate doublets by adding the counts of random observed transcriptome pairs.

#### Neighbors #

```
pp.neighbors
```

Compute the nearest neighbors distance matrix and a neighborhood graph of observations [ McInnes et al. , 2018 ]

.

### Queries

### Queries #

This module provides useful queries for annotation and enrichment.

```
queries.biomart_annotations
```

Retrieve gene annotations from ensembl biomart.

```
queries.gene_coordinates
```

Retrieve gene coordinates for specific organism through BioMart.

```
queries.mitochondrial_genes
```

Mitochondrial gene symbols for specific organism through BioMart.

```
queries.enrich
```

Get enrichment for DE results.

### Settings

### Settings #

A convenience function for setting some default `matplotlib.rcParams` and a high-resolution jupyter display backend useful for use in notebooks.

```
set_figure_params
```

Set resolution/size, styling and format of figures.

An object that allows configuring Scanpy.

```
settings
```

Settings for scanpy.

Some selected settings are discussed in the following.

Verbosity controls the amount of logging output:

```
Verbosity
```

Logging verbosity levels for `scanpy.settings.verbosity`

.

Influence the global behavior of plotting functions. In non-interactive scripts, you’d usually want to set `settings.autoshow` to `False` .

```
settings.autoshow
settings.autosave
```

IO related settings for saving figures, caching files and storing datasets.

```
settings.figdir
settings.cachedir
settings.datasetdir
settings.file_format_figs
settings.file_format_data
```

Print versions of packages that might influence numerical results.

```
logging.print_header
```

Versions that might influence the numerical results.

### Tools: tl

#### Contents

### Tools: `tl` #

Any transformation of the data matrix that is not preprocessing. In contrast to a preprocessing function, a tool usually adds an easily interpretable annotation to the data matrix, which can then be visualized with a corresponding plotting function.

#### Embeddings #

```
pp.pca
```

Principal component analysis [ Pedregosa et al. , 2011 ]

.

```
tl.tsne
```

t-SNE [ Amir et al. , 2013 , Pedregosa et al. , 2011 , van der Maaten and Hinton, 2008 ]

.

```
tl.umap
```

Embed the neighborhood graph using UMAP [ McInnes et al. , 2018 ]

.

```
tl.draw_graph
```

Force-directed graph drawing [ Chippada, 2018 , Islam et al. , 2011 , Jacomy et al. , 2014 ]

.

```
tl.diffmap
```

Diffusion Maps [ Coifman et al. , 2005 , Haghverdi et al. , 2015 , Wolf et al. , 2018 ]

.

Compute densities on embeddings.

```
tl.embedding_density
```

Calculate the density of cells in an embedding (per condition).

#### Clustering and trajectory inference #

```
tl.leiden
```

Cluster cells into subgroups [ Traag et al. , 2019 ]

.

```
tl.dendrogram
```

Compute a hierarchical clustering for the given `groupby` categories.

```
tl.dpt
```

Infer progression of cells through geodesic distance along the graph [ Haghverdi et al. , 2016 , Wolf et al. , 2019 ]

.

```
tl.paga
```

Map out the coarse-grained connectivity structures of complex manifolds [ Wolf et al. , 2019 ]

.

#### Data integration #

```
tl.ingest
```

Map labels and embeddings from reference data to new data.

#### Marker genes #

```
tl.rank_genes_groups
```

Rank genes for characterizing groups.

```
tl.filter_rank_genes_groups
```

Filter out genes based on two criteria.

```
tl.marker_gene_overlap
```

Calculate an overlap score between data-derived marker genes and provided markers.

#### Gene scores, Cell cycle #

```
tl.score_genes
```

Score a set of genes [ Tirosh et al. , 2016 ]

.

```
tl.score_genes_cell_cycle
```

Score cell cycle genes [ Satija et al. , 2015 ]

.

#### Simulations #

```
tl.sim
```

Simulate dynamic gene expression data [ Wittmann et al. , 2009 ] [ Wolf et al. , 2018 ] .

### scanpy.pl.DotPlot.DEFAULT_COLORMAP

#### Contents

### scanpy.pl.DotPlot.DEFAULT_COLORMAP #

DotPlot. DEFAULT_COLORMAP = 'Reds' [source] #

### scanpy.pl.DotPlot.DEFAULT_COLOR_LEGEND_TITLE

### scanpy.pl.DotPlot.DEFAULT_COLOR_LEGEND_TITLE #

DotPlot. DEFAULT_COLOR_LEGEND_TITLE = 'Mean expression\nin group' [source] #

### scanpy.pl.DotPlot.DEFAULT_COLOR_ON

#### Contents

### scanpy.pl.DotPlot.DEFAULT_COLOR_ON #

DotPlot. DEFAULT_COLOR_ON = 'dot' [source] #

### scanpy.pl.DotPlot.DEFAULT_DOT_EDGECOLOR

#### Contents

### scanpy.pl.DotPlot.DEFAULT_DOT_EDGECOLOR #

DotPlot. DEFAULT_DOT_EDGECOLOR = 'black' [source] #

### scanpy.pl.DotPlot.DEFAULT_DOT_EDGELW

#### Contents

### scanpy.pl.DotPlot.DEFAULT_DOT_EDGELW #

DotPlot. DEFAULT_DOT_EDGELW = 0.2 [source] #

### scanpy.pl.DotPlot.DEFAULT_DOT_MAX

#### Contents

### scanpy.pl.DotPlot.DEFAULT_DOT_MAX #

DotPlot. DEFAULT_DOT_MAX = None [source] #

### scanpy.pl.DotPlot.DEFAULT_DOT_MIN

#### Contents

### scanpy.pl.DotPlot.DEFAULT_DOT_MIN #

DotPlot. DEFAULT_DOT_MIN = None [source] #

### scanpy.pl.DotPlot.DEFAULT_LARGEST_DOT

#### Contents

### scanpy.pl.DotPlot.DEFAULT_LARGEST_DOT #

DotPlot. DEFAULT_LARGEST_DOT = 200.0 [source] #

### scanpy.pl.DotPlot.DEFAULT_LEGENDS_WIDTH

#### Contents

### scanpy.pl.DotPlot.DEFAULT_LEGENDS_WIDTH #

DotPlot. DEFAULT_LEGENDS_WIDTH = 1.5 [source] #

### scanpy.pl.DotPlot.DEFAULT_PLOT_X_PADDING

#### Contents

### scanpy.pl.DotPlot.DEFAULT_PLOT_X_PADDING #

DotPlot. DEFAULT_PLOT_X_PADDING = 0.8 [source] #

### scanpy.pl.DotPlot.DEFAULT_PLOT_Y_PADDING

#### Contents

### scanpy.pl.DotPlot.DEFAULT_PLOT_Y_PADDING #

DotPlot. DEFAULT_PLOT_Y_PADDING = 1.0 [source] #

### scanpy.pl.DotPlot.DEFAULT_SAVE_PREFIX

#### Contents

### scanpy.pl.DotPlot.DEFAULT_SAVE_PREFIX #

DotPlot. DEFAULT_SAVE_PREFIX = 'dotplot_' [source] #

### scanpy.pl.DotPlot.DEFAULT_SIZE_EXPONENT

#### Contents

### scanpy.pl.DotPlot.DEFAULT_SIZE_EXPONENT #

DotPlot. DEFAULT_SIZE_EXPONENT = 1.5 [source] #

### scanpy.pl.DotPlot.DEFAULT_SIZE_LEGEND_TITLE

### scanpy.pl.DotPlot.DEFAULT_SIZE_LEGEND_TITLE #

DotPlot. DEFAULT_SIZE_LEGEND_TITLE = 'Fraction of cells\nin group (%)' [source] #

### scanpy.pl.DotPlot.DEFAULT_SMALLEST_DOT

#### Contents

### scanpy.pl.DotPlot.DEFAULT_SMALLEST_DOT #

DotPlot. DEFAULT_SMALLEST_DOT = 0.0 [source] #

### scanpy.pl.DotPlot.legend

#### Contents

### scanpy.pl.DotPlot.legend #

DotPlot. legend ( * , show = True , show_size_legend = True , show_colorbar = True , size_title = 'Fraction of cells\\nin group (%)' , colorbar_title = 'Mean expression\\nin group' , width = 1.5 ) [source] #
Configure dot size and the colorbar legends.

Parameters :

show `bool` | `None` (default: `True` )
Set to `False` to hide the default plot of the legends. This sets the legend width to zero, which will result in a wider main plot.
show_size_legend `bool` | `None` (default: `True` )
Set to `False` to hide the dot size legend
show_colorbar `bool` | `None` (default: `True` )
Set to `False` to hide the colorbar legend
size_title `str` | `None` (default: `'Fraction of cells\\nin group (%)'` )
Title for the dot size legend. Use `\n` to add line breaks. Appears on top of dot sizes
colorbar_title `str` | `None` (default: `'Mean expression\\nin group'` )
Title for the color bar. Use `\n` to add line breaks. Appears on top of the color bar
width `float` | `None` (default: `1.5` )
Width of the legends area. The unit is the same as in matplotlib (inches).
Return type :

```
Self
```
Returns :

```
DotPlot
```

Examples
Set color bar title:

```
>>> import scanpy as sc
>>> adata = sc.datasets.pbmc68k_reduced()
>>> markers = {"T-cell": "CD3D", "B-cell": "CD79A", "myeloid": "CST3"}
>>> dp = sc.pl.DotPlot(adata, markers, groupby="bulk_labels")
>>> dp.legend(colorbar_title="log(UMI counts + 1)").show()
```

### scanpy.pl.DotPlot

#### Contents

### scanpy.pl.DotPlot #

class scanpy.pl. DotPlot ( adata , var_names , groupby , * , use_raw = None , log = False , num_categories = 7 , categories_order = None , title = None , figsize = None , gene_symbols = None , var_group_positions = None , var_group_labels = None , var_group_rotation = None , layer = None , expression_cutoff = 0.0 , mean_only_expressed = False , standard_scale = None , dot_color_df = None , dot_size_df = None , ax = None , vmin = None , vmax = None , vcenter = None , norm = None , group_colors = None , ** kwds ) [source] #
Bases: `BasePlot`
Allows the visualization of two values that are encoded as dot size and color.
The size usually represents the fraction of cells (obs) that have a non-zero value for genes (var).
For each var_name and each `groupby` category a dot is plotted. Each dot represents two values: mean expression within each category (visualized by color) and fraction of cells expressing the `var_name` in the category (visualized by the size of the dot). If `groupby` is not given, the dotplot assumes that all data belongs to a single category.
Note
A gene is considered expressed if the expression value in the `adata` (or `adata.raw` ) is above the specified threshold which is zero by default.
An example of dotplot usage is to visualize, for multiple marker genes, the mean value and the percentage of cells expressing the gene across multiple clusters.
See also
Parameters :

adata `AnnData`
Annotated data matrix.
var_names `str` | `Sequence` [ `str` ] | `Mapping` [ `str` , `str` | `Sequence` [ `str` ]]
`var_names` should be a valid subset of `adata.var_names` . If `var_names` is a mapping, then the key is used as label to group the values (see `var_group_labels` ). The mapping values should be sequences of valid `adata.var_names` . In this case either coloring or ‘brackets’ are used for the grouping of var names depending on the plot. When `var_names` is a mapping, then the `var_group_labels` and `var_group_positions` are set.
groupby `str` | `Sequence` [ `str` ]
The key of the observation grouping to consider.
use_raw `bool` | `None` (default: `None` )
Use `raw` attribute of `adata` if present.
log `bool` (default: `False` )
Plot on logarithmic axis.
num_categories `int` (default: `7` )
Only used if groupby observation is not categorical. This value determines the number of groups into which the groupby observation should be subdivided.
categories_order `Sequence` [ `str` ] | `None` (default: `None` )
Order in which to show the categories. Note: add_dendrogram or add_totals can change the categories order.
figsize `tuple` [ `float` , `float` ] | `None` (default: `None` )
Figure size when `multi_panel=True` . Otherwise the `rcParam['figure.figsize]` value is used. Format is (width, height)
dendrogram
If True or a valid dendrogram key, a dendrogram based on the hierarchical clustering between the `groupby` categories is added. The dendrogram information is computed using `scanpy.tl.dendrogram()` . If `tl.dendrogram` has not been called previously the function is called with default parameters.
gene_symbols `str` | `None` (default: `None` )
Column name in `.var` DataFrame that stores gene symbols. By default `var_names` refer to the index column of the `.var` DataFrame. Setting this option allows alternative names to be used.
var_group_positions `Sequence` [ `tuple` [ `int` , `int` ]] | `None` (default: `None` )
Use this parameter to highlight groups of `var_names` . This will draw a ‘bracket’ or a color block between the given start and end positions. If the parameter `var_group_labels` is set, the corresponding labels are added on top/left. E.g. `var_group_positions=[(4,10)]` will add a bracket between the fourth `var_name` and the tenth `var_name` . By giving more positions, more brackets/color blocks are drawn.
var_group_labels `Sequence` [ `str` ] | `None` (default: `None` )
Labels for each of the `var_group_positions` that want to be highlighted.
var_group_rotation `float` | `None` (default: `None` )
Label rotation degrees. By default, labels larger than 4 characters are rotated 90 degrees.
layer `str` | `None` (default: `None` )
Name of the AnnData object layer that wants to be plotted. By default adata.raw.X is plotted. If `use_raw=False` is set, then `adata.X` is plotted. If `layer` is set to a valid layer name, then the layer is plotted. `layer` takes precedence over `use_raw` .
title `str` | `None` (default: `None` )
Title for the figure
expression_cutoff `float` (default: `0.0` )
Expression cutoff that is used for binarizing the gene expression and determining the fraction of cells expressing given genes. A gene is expressed only if the expression value is greater than this threshold.
mean_only_expressed `bool` (default: `False` )
If True, gene expression is averaged only over the cells expressing the given genes.
standard_scale `Literal` [ `'var'` , `'group'` ] | `None` (default: `None` )
Whether or not to standardize that dimension between 0 and 1, meaning for each variable or group, subtract the minimum and divide each by its maximum.
kwds
Are passed to `matplotlib.pyplot.scatter()` .

```
dotplot()
```
Simpler way to call DotPlot but with less options.

```
rank_genes_groups_dotplot()
```

Examples
to plot marker genes identified using the `rank_genes_groups()` function.

```
>>> import scanpy as sc
>>> adata = sc.datasets.pbmc68k_reduced()
>>> markers = ["C1QA", "PSAP", "CD79A", "CD79B", "CST3", "LYZ"]
>>> sc.pl.DotPlot(adata, markers, groupby="bulk_labels").show()
```

Using var_names as dict:

```
>>> markers = {"T-cell": "CD3D", "B-cell": "CD79A", "myeloid": "CST3"}
>>> sc.pl.DotPlot(adata, markers, groupby="bulk_labels").show()
```

Attributes

```
DEFAULT_COLORMAP
DEFAULT_COLOR_LEGEND_TITLE
DEFAULT_COLOR_ON
DEFAULT_DOT_EDGECOLOR
DEFAULT_DOT_EDGELW
DEFAULT_DOT_MAX
DEFAULT_DOT_MIN
DEFAULT_LARGEST_DOT
DEFAULT_LEGENDS_WIDTH
DEFAULT_PLOT_X_PADDING
DEFAULT_PLOT_Y_PADDING
DEFAULT_SAVE_PREFIX
DEFAULT_SIZE_EXPONENT
DEFAULT_SIZE_LEGEND_TITLE
DEFAULT_SMALLEST_DOT
```

Methods

| `legend` (*[, show, show_size_legend, ...]) | Configure dot size and the colorbar legends. |
|---|---|
| `style` (*[, cmap, color_on, dot_max, dot_min, ...]) | Modify plot visual parameters. |

### scanpy.pl.DotPlot.style

#### Contents

### scanpy.pl.DotPlot.style #

DotPlot. style ( * , cmap = _empty , color_on = _empty , dot_max = _empty , dot_min = _empty , smallest_dot = _empty , largest_dot = _empty , dot_edge_color = _empty , dot_edge_lw = _empty , size_exponent = _empty , grid = _empty , x_padding = _empty , y_padding = _empty ) [source] #
Modify plot visual parameters.

Parameters :

cmap `Colormap` | `str` | `Empty` | `None` (default: `_empty` )
String denoting matplotlib color map.
color_on `Literal` [ `'dot'` , `'square'` ] | `Empty` (default: `_empty` )
By default the color map is applied to the color of the `"dot"` . Optionally, the colormap can be applied to a `"square"` behind the dot, in which case the dot is transparent and only the edge is shown.
dot_max `float` | `Empty` | `None` (default: `_empty` )
If `None` , the maximum dot size is set to the maximum fraction value found (e.g. 0.6). If given, the value should be a number between 0 and 1. All fractions larger than dot_max are clipped to this value.
dot_min `float` | `Empty` | `None` (default: `_empty` )
If `None` , the minimum dot size is set to 0. If given, the value should be a number between 0 and 1. All fractions smaller than dot_min are clipped to this value.
smallest_dot `float` | `Empty` (default: `_empty` )
All expression fractions with `dot_min` are plotted with this size.
largest_dot `float` | `Empty` (default: `_empty` )
All expression fractions with `dot_max` are plotted with this size.
dot_edge_color `str` | `tuple` [ `float` , `float` , `float` ] | `tuple` [ `float` , `float` , `float` , `float` ] | `Empty` | `None` (default: `_empty` )
Dot edge color. When `color_on='dot'` , `None` means no edge. When `color_on='square'` , `None` means that the edge color is white for darker colors and black for lighter background square colors.
dot_edge_lw `float` | `Empty` | `None` (default: `_empty` )
Dot edge line width. When `color_on='dot'` , `None` means no edge. When `color_on='square'` , `None` means a line width of 1.5.
size_exponent `float` | `Empty` (default: `_empty` )
Dot size is computed as: fraction ** size exponent and afterwards scaled to match the `smallest_dot` and `largest_dot` size parameters. Using a different size exponent changes the relative sizes of the dots to each other.
grid `bool` | `Empty` (default: `_empty` )
Set to true to show grid lines. By default grid lines are not shown. Further configuration of the grid lines can be achieved directly on the returned ax.
x_padding `float` | `Empty` (default: `_empty` )
Space between the plot left/right borders and the dots center. A unit is the distance between the x ticks. Only applied when color_on = dot
y_padding `float` | `Empty` (default: `_empty` )
Space between the plot top/bottom borders and the dots center. A unit is the distance between the y ticks. Only applied when color_on = dot
Return type :

```
Self
```
Returns :

```
DotPlot
```

Examples

```
>>> import scanpy as sc
>>> adata = sc.datasets.pbmc68k_reduced()
>>> markers = ['C1QA', 'PSAP', 'CD79A', 'CD79B', 'CST3', 'LYZ']
```

Change color map and apply it to the square behind the dot

```
>>> sc.pl.DotPlot(adata, markers, groupby='bulk_labels') \
...     .style(cmap='RdBu_r', color_on='square').show()
```

Add edge to dots and plot a grid

```
>>> sc.pl.DotPlot(adata, markers, groupby='bulk_labels') \
...     .style(dot_edge_color='black', dot_edge_lw=1, grid=True) \
...     .show()
```

### scanpy.pl.MatrixPlot.DEFAULT_COLORMAP

#### Contents

### scanpy.pl.MatrixPlot.DEFAULT_COLORMAP #

MatrixPlot. DEFAULT_COLORMAP = 'viridis' [source] #

### scanpy.pl.MatrixPlot.DEFAULT_COLOR_LEGEND_TITLE

### scanpy.pl.MatrixPlot.DEFAULT_COLOR_LEGEND_TITLE #

MatrixPlot. DEFAULT_COLOR_LEGEND_TITLE = 'Mean expression\nin group' [source] #

### scanpy.pl.MatrixPlot.DEFAULT_EDGE_COLOR

#### Contents

### scanpy.pl.MatrixPlot.DEFAULT_EDGE_COLOR #

MatrixPlot. DEFAULT_EDGE_COLOR = 'gray' [source] #

### scanpy.pl.MatrixPlot.DEFAULT_EDGE_LW

#### Contents

### scanpy.pl.MatrixPlot.DEFAULT_EDGE_LW #

MatrixPlot. DEFAULT_EDGE_LW = 0.1 [source] #

### scanpy.pl.MatrixPlot.DEFAULT_SAVE_PREFIX

#### Contents

### scanpy.pl.MatrixPlot.DEFAULT_SAVE_PREFIX #

MatrixPlot. DEFAULT_SAVE_PREFIX = 'matrixplot_' [source] #

### scanpy.pl.MatrixPlot

#### Contents

### scanpy.pl.MatrixPlot #

class scanpy.pl. MatrixPlot ( adata , var_names , groupby , * , use_raw = None , log = False , num_categories = 7 , categories_order = None , title = None , figsize = None , gene_symbols = None , var_group_positions = None , var_group_labels = None , var_group_rotation = None , layer = None , standard_scale = None , ax = None , values_df = None , vmin = None , vmax = None , vcenter = None , norm = None , ** kwds ) [source] #
Bases: `BasePlot`
Allows the visualization of values using a color map.
See also
Parameters :

adata `AnnData`
Annotated data matrix.
var_names `str` | `Sequence` [ `str` ] | `Mapping` [ `str` , `str` | `Sequence` [ `str` ]]
`var_names` should be a valid subset of `adata.var_names` . If `var_names` is a mapping, then the key is used as label to group the values (see `var_group_labels` ). The mapping values should be sequences of valid `adata.var_names` . In this case either coloring or ‘brackets’ are used for the grouping of var names depending on the plot. When `var_names` is a mapping, then the `var_group_labels` and `var_group_positions` are set.
groupby `str` | `Sequence` [ `str` ]
The key of the observation grouping to consider.
use_raw `bool` | `None` (default: `None` )
Use `raw` attribute of `adata` if present.
log `bool` (default: `False` )
Plot on logarithmic axis.
num_categories `int` (default: `7` )
Only used if groupby observation is not categorical. This value determines the number of groups into which the groupby observation should be subdivided.
categories_order `Sequence` [ `str` ] | `None` (default: `None` )
Order in which to show the categories. Note: add_dendrogram or add_totals can change the categories order.
figsize `tuple` [ `float` , `float` ] | `None` (default: `None` )
Figure size when `multi_panel=True` . Otherwise the `rcParam['figure.figsize]` value is used. Format is (width, height)
dendrogram
If True or a valid dendrogram key, a dendrogram based on the hierarchical clustering between the `groupby` categories is added. The dendrogram information is computed using `scanpy.tl.dendrogram()` . If `tl.dendrogram` has not been called previously the function is called with default parameters.
gene_symbols `str` | `None` (default: `None` )
Column name in `.var` DataFrame that stores gene symbols. By default `var_names` refer to the index column of the `.var` DataFrame. Setting this option allows alternative names to be used.
var_group_positions `Sequence` [ `tuple` [ `int` , `int` ]] | `None` (default: `None` )
Use this parameter to highlight groups of `var_names` . This will draw a ‘bracket’ or a color block between the given start and end positions. If the parameter `var_group_labels` is set, the corresponding labels are added on top/left. E.g. `var_group_positions=[(4,10)]` will add a bracket between the fourth `var_name` and the tenth `var_name` . By giving more positions, more brackets/color blocks are drawn.
var_group_labels `Sequence` [ `str` ] | `None` (default: `None` )
Labels for each of the `var_group_positions` that want to be highlighted.
var_group_rotation `float` | `None` (default: `None` )
Label rotation degrees. By default, labels larger than 4 characters are rotated 90 degrees.
layer `str` | `None` (default: `None` )
Name of the AnnData object layer that wants to be plotted. By default adata.raw.X is plotted. If `use_raw=False` is set, then `adata.X` is plotted. If `layer` is set to a valid layer name, then the layer is plotted. `layer` takes precedence over `use_raw` .
title `str` | `None` (default: `None` )
Title for the figure.
expression_cutoff
Expression cutoff that is used for binarizing the gene expression and determining the fraction of cells expressing given genes. A gene is expressed only if the expression value is greater than this threshold.
mean_only_expressed
If True, gene expression is averaged only over the cells expressing the given genes.
standard_scale `Literal` [ `'var'` , `'group'` ] | `None` (default: `None` )
Whether or not to standardize that dimension between 0 and 1, meaning for each variable or group, subtract the minimum and divide each by its maximum.
values_df `DataFrame` | `None` (default: `None` )
Optionally, a dataframe with the values to plot can be given. The index should be the grouby categories and the columns the genes names.
kwds
Are passed to `matplotlib.pyplot.scatter()` .

```
matrixplot()
```
Simpler way to call MatrixPlot but with less options.

```
rank_genes_groups_matrixplot()
```

Examples
Simple visualization of the average expression of a few genes grouped by the category ‘bulk_labels’.
to plot marker genes identified using the `rank_genes_groups()` function.

```
import scanpy as sc
adata = sc.datasets.pbmc68k_reduced()
markers = ['C1QA', 'PSAP', 'CD79A', 'CD79B', 'CST3', 'LYZ']
sc.pl.MatrixPlot(adata, markers, groupby='bulk_labels').show()
```

Same visualization but passing var_names as dict, which adds a grouping of the genes on top of the image:

```
markers = {'T-cell': 'CD3D', 'B-cell': 'CD79A', 'myeloid': 'CST3'}
sc.pl.MatrixPlot(adata, markers, groupby='bulk_labels').show()
```

Attributes

```
DEFAULT_COLORMAP
DEFAULT_COLOR_LEGEND_TITLE
DEFAULT_EDGE_COLOR
DEFAULT_EDGE_LW
DEFAULT_SAVE_PREFIX
```

Methods

| `style` ([cmap, edge_color, edge_lw]) | Modify plot visual parameters. |
|---|---|

### scanpy.pl.MatrixPlot.style

#### Contents

### scanpy.pl.MatrixPlot.style #

MatrixPlot. style ( cmap = _empty , edge_color = _empty , edge_lw = _empty ) [source] #
Modify plot visual parameters.

Parameters :

cmap `Colormap` | `str` | `Empty` | `None` (default: `_empty` )
Matplotlib color map, specified by name or directly. If `None` , use `matplotlib.rcParams` `["image.cmap"]`
edge_color `str` | `tuple` [ `float` , `float` , `float` ] | `tuple` [ `float` , `float` , `float` , `float` ] | `Empty` | `None` (default: `_empty` )
Edge color between the squares of matrix plot. If `None` , use `matplotlib.rcParams` `["patch.edgecolor"]`
edge_lw `float` | `Empty` | `None` (default: `_empty` )
Edge line width. If `None` , use `matplotlib.rcParams` `["lines.linewidth"]`
Return type :

```
Self
```
Returns :

```
MatrixPlot
```

Examples

```
import scanpy as sc

adata = sc.datasets.pbmc68k_reduced()
markers = ['C1QA', 'PSAP', 'CD79A', 'CD79B', 'CST3', 'LYZ']
```

Change color map and turn off edges:

```
(
    sc.pl.MatrixPlot(adata, markers, groupby='bulk_labels')
    .style(cmap='Blues', edge_color='none')
    .show()
)
```

### scanpy.pl.StackedViolin.DEFAULT_COLORMAP

#### Contents

### scanpy.pl.StackedViolin.DEFAULT_COLORMAP #

StackedViolin. DEFAULT_COLORMAP = 'Blues' [source] #

### scanpy.pl.StackedViolin.DEFAULT_COLOR_LEGEND_TITLE

### scanpy.pl.StackedViolin.DEFAULT_COLOR_LEGEND_TITLE #

StackedViolin. DEFAULT_COLOR_LEGEND_TITLE = 'Median expression\nin group' [source] #

### scanpy.pl.StackedViolin.DEFAULT_CUT

#### Contents

### scanpy.pl.StackedViolin.DEFAULT_CUT #

StackedViolin. DEFAULT_CUT = 0 [source] #

### scanpy.pl.StackedViolin.DEFAULT_DENSITY_NORM

#### Contents

### scanpy.pl.StackedViolin.DEFAULT_DENSITY_NORM #

StackedViolin. DEFAULT_DENSITY_NORM = 'width' [source] #

### scanpy.pl.StackedViolin.DEFAULT_INNER

#### Contents

### scanpy.pl.StackedViolin.DEFAULT_INNER #

StackedViolin. DEFAULT_INNER = None [source] #

### scanpy.pl.StackedViolin.DEFAULT_JITTER

#### Contents

### scanpy.pl.StackedViolin.DEFAULT_JITTER #

StackedViolin. DEFAULT_JITTER = False [source] #

### scanpy.pl.StackedViolin.DEFAULT_JITTER_SIZE

#### Contents

### scanpy.pl.StackedViolin.DEFAULT_JITTER_SIZE #

StackedViolin. DEFAULT_JITTER_SIZE = 1 [source] #

### scanpy.pl.StackedViolin.DEFAULT_LINE_WIDTH

#### Contents

### scanpy.pl.StackedViolin.DEFAULT_LINE_WIDTH #

StackedViolin. DEFAULT_LINE_WIDTH = 0.2 [source] #

### scanpy.pl.StackedViolin.DEFAULT_PLOT_X_PADDING

#### Contents

### scanpy.pl.StackedViolin.DEFAULT_PLOT_X_PADDING #

StackedViolin. DEFAULT_PLOT_X_PADDING = 0.5 [source] #

### scanpy.pl.StackedViolin.DEFAULT_PLOT_YTICKLABELS

#### Contents

### scanpy.pl.StackedViolin.DEFAULT_PLOT_YTICKLABELS #

StackedViolin. DEFAULT_PLOT_YTICKLABELS = False [source] #

### scanpy.pl.StackedViolin.DEFAULT_PLOT_Y_PADDING

#### Contents

### scanpy.pl.StackedViolin.DEFAULT_PLOT_Y_PADDING #

StackedViolin. DEFAULT_PLOT_Y_PADDING = 0.5 [source] #

### scanpy.pl.StackedViolin.DEFAULT_ROW_PALETTE

#### Contents

### scanpy.pl.StackedViolin.DEFAULT_ROW_PALETTE #

StackedViolin. DEFAULT_ROW_PALETTE = None [source] #

### scanpy.pl.StackedViolin.DEFAULT_SAVE_PREFIX

#### Contents

### scanpy.pl.StackedViolin.DEFAULT_SAVE_PREFIX #

StackedViolin. DEFAULT_SAVE_PREFIX = 'stacked_violin_' [source] #

### scanpy.pl.StackedViolin.DEFAULT_STRIPPLOT

#### Contents

### scanpy.pl.StackedViolin.DEFAULT_STRIPPLOT #

StackedViolin. DEFAULT_STRIPPLOT = False [source] #

### scanpy.pl.StackedViolin.DEFAULT_YLIM

#### Contents

### scanpy.pl.StackedViolin.DEFAULT_YLIM #

StackedViolin. DEFAULT_YLIM = None [source] #

### scanpy.pl.StackedViolin

#### Contents

### scanpy.pl.StackedViolin #

class scanpy.pl. StackedViolin ( adata , var_names , groupby , * , use_raw = None , log = False , num_categories = 7 , categories_order = None , title = None , figsize = None , gene_symbols = None , var_group_positions = None , var_group_labels = None , var_group_rotation = None , layer = None , standard_scale = None , ax = None , vmin = None , vmax = None , vcenter = None , norm = None , ** kwds ) [source] #
Bases: `BasePlot`
Stacked violin plots.
Makes a compact image composed of individual violin plots (from `violinplot()` ) stacked on top of each other. Useful to visualize gene expression per cluster.
Wraps `seaborn.violinplot()` for `AnnData` .
See also
Parameters :

adata `AnnData`
Annotated data matrix.
var_names `str` | `Sequence` [ `str` ] | `Mapping` [ `str` , `str` | `Sequence` [ `str` ]]
`var_names` should be a valid subset of `adata.var_names` . If `var_names` is a mapping, then the key is used as label to group the values (see `var_group_labels` ). The mapping values should be sequences of valid `adata.var_names` . In this case either coloring or ‘brackets’ are used for the grouping of var names depending on the plot. When `var_names` is a mapping, then the `var_group_labels` and `var_group_positions` are set.
groupby `str` | `Sequence` [ `str` ]
The key of the observation grouping to consider.
use_raw `bool` | `None` (default: `None` )
Use `raw` attribute of `adata` if present.
log `bool` (default: `False` )
Plot on logarithmic axis.
num_categories `int` (default: `7` )
Only used if groupby observation is not categorical. This value determines the number of groups into which the groupby observation should be subdivided.
categories_order `Sequence` [ `str` ] | `None` (default: `None` )
Order in which to show the categories. Note: add_dendrogram or add_totals can change the categories order.
figsize `tuple` [ `float` , `float` ] | `None` (default: `None` )
Figure size when `multi_panel=True` . Otherwise the `rcParam['figure.figsize]` value is used. Format is (width, height)
dendrogram
If True or a valid dendrogram key, a dendrogram based on the hierarchical clustering between the `groupby` categories is added. The dendrogram information is computed using `scanpy.tl.dendrogram()` . If `tl.dendrogram` has not been called previously the function is called with default parameters.
gene_symbols `str` | `None` (default: `None` )
Column name in `.var` DataFrame that stores gene symbols. By default `var_names` refer to the index column of the `.var` DataFrame. Setting this option allows alternative names to be used.
var_group_positions `Sequence` [ `tuple` [ `int` , `int` ]] | `None` (default: `None` )
Use this parameter to highlight groups of `var_names` . This will draw a ‘bracket’ or a color block between the given start and end positions. If the parameter `var_group_labels` is set, the corresponding labels are added on top/left. E.g. `var_group_positions=[(4,10)]` will add a bracket between the fourth `var_name` and the tenth `var_name` . By giving more positions, more brackets/color blocks are drawn.
var_group_labels `Sequence` [ `str` ] | `None` (default: `None` )
Labels for each of the `var_group_positions` that want to be highlighted.
var_group_rotation `float` | `None` (default: `None` )
Label rotation degrees. By default, labels larger than 4 characters are rotated 90 degrees.
layer `str` | `None` (default: `None` )
Name of the AnnData object layer that wants to be plotted. By default adata.raw.X is plotted. If `use_raw=False` is set, then `adata.X` is plotted. If `layer` is set to a valid layer name, then the layer is plotted. `layer` takes precedence over `use_raw` .
title `str` | `None` (default: `None` )
Title for the figure
stripplot
Add a stripplot on top of the violin plot. See `stripplot()` .
jitter
Add jitter to the stripplot (only when stripplot is True) See `stripplot()` .
size
Size of the jitter points.
order
Order in which to show the categories. Note: if `dendrogram=True` the categories order will be given by the dendrogram and `order` will be ignored.
density_norm
The method used to scale the width of each violin. If ‘width’ (the default), each violin will have the same width. If ‘area’, each violin will have the same area. If ‘count’, a violin’s width corresponds to the number of observations.
row_palette
The row palette determines the colors to use for the stacked violins. The value should be a valid seaborn or matplotlib palette name (see `color_palette()` ). Alternatively, a single color name or hex value can be passed, e.g. `'red'` or `'#cc33ff'` .
standard_scale `Literal` [ `'var'` , `'group'` ] | `None` (default: `None` )
Whether or not to standardize a dimension between 0 and 1, meaning for each variable or observation, subtract the minimum and divide each by its maximum.
swap_axes
By default, the x axis contains `var_names` (e.g. genes) and the y axis the `groupby` categories. By setting `swap_axes` then x are the `groupby` categories and y the `var_names` . When swapping axes var_group_positions are no longer used
kwds
Are passed to `violinplot()` .

```
stacked_violin()
```
simpler way to call StackedViolin but with less options.

```
violin()
```

Examples
to plot marker genes identified using `rank_genes_groups()`

```
>>> import scanpy as sc
>>> adata = sc.datasets.pbmc68k_reduced()
>>> markers = ["C1QA", "PSAP", "CD79A", "CD79B", "CST3", "LYZ"]
>>> sc.pl.StackedViolin(
...     adata, markers, groupby="bulk_labels", dendrogram=True
... )
<scanpy.plotting._stacked_violin.StackedViolin object at 0x...>
```

Using var_names as dict:

```
>>> markers = {"T-cell": "CD3D", "B-cell": "CD79A", "myeloid": "CST3"}
>>> sc.pl.StackedViolin(
...     adata, markers, groupby="bulk_labels", dendrogram=True
... )
<scanpy.plotting._stacked_violin.StackedViolin object at 0x...>
```

Attributes

```
DEFAULT_COLORMAP
DEFAULT_COLOR_LEGEND_TITLE
DEFAULT_CUT
DEFAULT_DENSITY_NORM
DEFAULT_INNER
DEFAULT_JITTER
DEFAULT_JITTER_SIZE
DEFAULT_LINE_WIDTH
DEFAULT_PLOT_X_PADDING
DEFAULT_PLOT_YTICKLABELS
DEFAULT_PLOT_Y_PADDING
DEFAULT_ROW_PALETTE
DEFAULT_SAVE_PREFIX
DEFAULT_STRIPPLOT
DEFAULT_YLIM
```

Methods

| `style` (*[, cmap, stripplot, jitter, ...]) | Modify plot visual parameters. |
|---|---|

### scanpy.pl.StackedViolin.style

#### Contents

### scanpy.pl.StackedViolin.style #

StackedViolin. style ( * , cmap = _empty , stripplot = _empty , jitter = _empty , jitter_size = _empty , linewidth = _empty , row_palette = _empty , density_norm = _empty , yticklabels = _empty , ylim = _empty , x_padding = _empty , y_padding = _empty , scale = _empty ) [source] #
Modify plot visual parameters.

Parameters :

cmap `Colormap` | `str` | `Empty` | `None` (default: `_empty` )
Matplotlib color map, specified by name or directly. If `None` , use `matplotlib.rcParams` `["image.cmap"]`
stripplot `bool` | `Empty` (default: `_empty` )
Add a stripplot on top of the violin plot. See `stripplot()` .
jitter `float` | `bool` | `Empty` (default: `_empty` )
Add jitter to the stripplot (only when stripplot is True) See `stripplot()` .
jitter_size `float` | `Empty` (default: `_empty` )
Size of the jitter points.
linewidth `float` | `Empty` | `None` (default: `_empty` )
line width for the violin plots. If None, use `matplotlib.rcParams` `["lines.linewidth"]`
row_palette `str` | `Empty` | `None` (default: `_empty` )
The row palette determines the colors to use for the stacked violins. If `None` , use `matplotlib.rcParams` `["axes.prop_cycle"]` The value should be a valid seaborn or matplotlib palette name (see `color_palette()` ). Alternatively, a single color name or hex value can be passed, e.g. `'red'` or `'#cc33ff'` .
density_norm `Literal` [ `'area'` , `'count'` , `'width'` ] | `Empty` (default: `_empty` )
The method used to scale the width of each violin. If ‘width’ (the default), each violin will have the same width. If ‘area’, each violin will have the same area. If ‘count’, a violin’s width corresponds to the number of observations.
yticklabels `bool` | `Empty` (default: `_empty` )
Set to true to view the y tick labels.
ylim `tuple` [ `float` , `float` ] | `Empty` | `None` (default: `_empty` )
minimum and maximum values for the y-axis. If not `None` , all rows will have the same y-axis range. Example: `ylim=(0, 5)`
x_padding `float` | `Empty` (default: `_empty` )
Space between the plot left/right borders and the violins. A unit is the distance between the x ticks.
y_padding `float` | `Empty` (default: `_empty` )
Space between the plot top/bottom borders and the violins. A unit is the distance between the y ticks.
Return type :

```
Self
```
Returns :

```
StackedViolin
```

Examples

```
>>> import scanpy as sc
>>> adata = sc.datasets.pbmc68k_reduced()
>>> markers = ['C1QA', 'PSAP', 'CD79A', 'CD79B', 'CST3', 'LYZ']
```

Change color map and turn off edges

```
>>> sc.pl.StackedViolin(adata, markers, groupby='bulk_labels') \
...     .style(row_palette='Blues', linewidth=0).show()
```

### scanpy.pl.correlation_matrix

### scanpy.pl.correlation_matrix #

scanpy.pl. correlation_matrix ( adata , groupby , * , show_correlation_numbers = False , dendrogram = None , figsize = None , show = None , save = None , ax = None , vmin = None , vmax = None , vcenter = None , norm = None , ** kwds ) [source] #
Plot the correlation matrix computed as part of `scanpy.tl.dendrogram()` .
Examples
Plot correlation matrix between cell type groups.
Parameters :

adata `AnnData`
groupby `str`
Categorical data column used to create the dendrogram
show_correlation_numbers `bool` (default: `False` )
If `show_correlation=True` , plot the correlation on top of each cell.
dendrogram `bool` | `str` | `None` (default: `None` )
If True or a valid dendrogram key, a dendrogram based on the hierarchical clustering between the `groupby` categories is added. The dendrogram is computed using `scanpy.tl.dendrogram()` . If `tl.dendrogram` has not been called previously, the function is called with default parameters.
figsize `tuple` [ `float` , `float` ] | `None` (default: `None` )
By default a figure size that aims to produce a squared correlation matrix plot is used. Format is (width, height)
show `bool` | `None` (default: `None` )
Show the plot, do not return axis.
save `str` | `bool` | `None` (default: `None` )
If `True` or a `str` , save the figure. A string is appended to the default filename. Infer the filetype if ending on { `'.pdf'` , `'.png'` , `'.svg'` }. (deprecated in favour of `sc.pl.plot(show=False).figure.savefig()` ).
ax `Axes` | `None` (default: `None` )
A matplotlib axes object. Only works if plotting a single component.
vmin `float` | `None` (default: `None` )
The value representing the lower limit of the color scale. Values smaller than vmin are plotted with the same color as vmin.
vmax `float` | `None` (default: `None` )
The value representing the upper limit of the color scale. Values larger than vmax are plotted with the same color as vmax.
vcenter `float` | `None` (default: `None` )
The value representing the center of the color scale. Useful for diverging colormaps.
norm `Normalize` | `None` (default: `None` )
Custom color normalization object from matplotlib. See Colormap normalization for details.
**kwds
Only if `show_correlation` is True: Are passed to `matplotlib.pyplot.pcolormesh()` when plotting the correlation heatmap. `cmap` can be used to change the color palette.
Return type :
`list` [ `Axes` ] | `None`
Returns :
If `show=False` , returns a list of `matplotlib.axes.Axes` objects.

```
import scanpy as sc
adata = sc.datasets.pbmc68k_reduced()
sc.tl.dendrogram(adata, "bulk_labels")
sc.pl.correlation_matrix(adata, "bulk_labels")
```

### scanpy.pl.diffmap

#### Contents

### scanpy.pl.diffmap #

scanpy.pl. diffmap ( adata , * , color = None , mask_obs = None , gene_symbols = None , use_raw = None , sort_order = True , edges = False , edges_width = 0.1 , edges_color = 'grey' , neighbors_key = None , arrows = False , arrows_kwds = None , groups = None , components = None , dimensions = None , layer = None , projection = '2d' , scale_factor = None , color_map = None , cmap = None , palette = None , na_color = 'lightgray' , na_in_legend = True , size = None , frameon = None , legend_fontsize = None , legend_fontweight = 'bold' , legend_loc = 'right margin' , legend_fontoutline = None , colorbar_loc = 'right' , vmax = None , vmin = None , vcenter = None , norm = None , add_outline = False , outline_width = (0.3, 0.05) , outline_color = ('black', 'white') , ncols = 4 , hspace = 0.25 , wspace = None , title = None , show = None , ax = None , return_fig = None , marker = '.' , save = None , ** kwargs ) [source] #
Scatter plot in Diffusion Map basis.

Parameters :

adata `AnnData`
Annotated data matrix.
color `str` | `Sequence` [ `str` ] | `None` (default: `None` )
Keys for annotations of observations/cells or variables/genes, e.g., `'ann1'` or `['ann1', 'ann2']` .
gene_symbols `str` | `None` (default: `None` )
Column name in `.var` DataFrame that stores gene symbols. By default `var_names` refer to the index column of the `.var` DataFrame. Setting this option allows alternative names to be used.
use_raw `bool` | `None` (default: `None` )
Use `.raw` attribute of `adata` for coloring with gene expression. If `None` , defaults to `True` if `layer` isn’t provided and `adata.raw` is present.
layer `str` | `None` (default: `None` )
Name of the AnnData object layer that wants to be plotted. By default adata.raw.X is plotted. If `use_raw=False` is set, then `adata.X` is plotted. If `layer` is set to a valid layer name, then the layer is plotted. `layer` takes precedence over `use_raw` .
sort_order `bool` (default: `True` )
For continuous annotations used as color parameter, plot data points with higher values on top of others.
groups `str` | `Sequence` [ `str` ] | `None` (default: `None` )
Restrict to a few categories in categorical observation annotation. The default is not to restrict to any groups.
dimensions `tuple` [ `int` , `int` ] | `Sequence` [ `tuple` [ `int` , `int` ]] | `None` (default: `None` )
0-indexed dimensions of the embedding to plot as integers. E.g. [(0, 1), (1, 2)]. Unlike `components` , this argument is used in the same way as `colors` , e.g. is used to specify a single plot at a time. Will eventually replace the components argument.
components `str` | `Sequence` [ `str` ] | `None` (default: `None` )
For instance, `['1,2', '2,3']` . To plot all available components use `components='all'` .
projection `Literal` [ `'2d'` , `'3d'` ] (default: `'2d'` )
Projection of plot (default: `'2d'` ).
legend_loc `Literal` [ `'none'` , `'right margin'` , `'on data'` , `'on data export'` , `'best'` , `'upper right'` , `'upper left'` , `'lower left'` , `'lower right'` , `'right'` , `'center left'` , `'center right'` , `'lower center'` , `'upper center'` , `'center'` ] | `None` (default: `'right margin'` )
Location of legend, either `'on data'` , `'right margin'` , `None` , or a valid keyword for the `loc` parameter of `Legend` .
legend_fontsize `float` | `Literal` [ `'xx-small'` , `'x-small'` , `'small'` , `'medium'` , `'large'` , `'x-large'` , `'xx-large'` ] | `None` (default: `None` )
Numeric size in pt or string describing the size. See `set_fontsize()` .
legend_fontweight `int` | `Literal` [ `'light'` , `'normal'` , `'medium'` , `'semibold'` , `'bold'` , `'heavy'` , `'black'` ] (default: `'bold'` )
Legend font weight. A numeric value in range 0-1000 or a string. Defaults to `'bold'` if `legend_loc == 'on data'` , otherwise to `'normal'` . See `set_fontweight()` .
legend_fontoutline `int` | `None` (default: `None` )
Line width of the legend font outline in pt. Draws a white outline using the path effect `withStroke` .
size `float` | `Sequence` [ `float` ] | `None` (default: `None` )
Point size. If `None` , is automatically computed as 120000 / n_cells. Can be a sequence containing the size for each cell. The order should be the same as in adata.obs.
color_map `Colormap` | `str` | `None` (default: `None` )
Color map to use for continous variables. Can be a name or a `Colormap` instance (e.g. `"magma` ”, `"viridis"` or `mpl.cm.cividis` ), see `get_cmap()` . If `None` , the value of `mpl.rcParams["image.cmap"]` is used. The default `color_map` can be set using `set_figure_params()` .
palette `str` | `Sequence` [ `str` ] | `Cycler` | `None` (default: `None` )
Colors to use for plotting categorical annotation groups. The palette can be a valid `ListedColormap` name ( `'Set2'` , `'tab20'` , …), a `Cycler` object, a dict mapping categories to colors, or a sequence of colors. Colors must be valid to matplotlib. (see `is_color_like()` ). If `None` , `mpl.rcParams["axes.prop_cycle"]` is used unless the categorical variable already has colors stored in `adata.uns["{var}_colors"]` . If provided, values of `adata.uns["{var}_colors"]` will be set.
frameon `bool` | `None` (default: `None` )
Draw a frame around the scatter plot. Defaults to value set in `set_figure_params()` , defaults to `True` .
title `str` | `Sequence` [ `str` ] | `None` (default: `None` )
Provide title for panels either as string or list of strings, e.g. `['title1', 'title2', ...]` .
colorbar_loc `Literal` [ `'right'` , `'left'` , `'top'` , `'bottom'` ] | `None` (default: `'right'` )
Where to place the colorbar for continous variables. If `None` , no colorbar is added.
na_color `str` | `tuple` [ `float` , `float` , `float` ] | `tuple` [ `float` , `float` , `float` , `float` ] (default: `'lightgray'` )
Color to use for null or masked values. Can be anything matplotlib accepts as a color. Used for all points if `color=None` .
na_in_legend `bool` (default: `True` )
If there are missing values, whether they get an entry in the legend. Currently only implemented for categorical legends.
vmin `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ] | `Sequence` [ `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ]] | `None` (default: `None` )
The value representing the lower limit of the color scale. Values smaller than vmin are plotted with the same color as vmin. vmin can be a number, a string, a function or `None` . If vmin is a string and has the format `pN` , this is interpreted as a vmin=percentile(N). For example vmin=’p1.5’ is interpreted as the 1.5 percentile. If vmin is function, then vmin is interpreted as the return value of the function over the list of values to plot. For example to set vmin tp the mean of the values to plot,

```
def my_vmin(values): returnnp.mean(values)
```

Examples

and then set `vmin=my_vmin` . If vmin is None (default) an automatic minimum value is used as defined by matplotlib `scatter` function. When making multiple plots, vmin can be a list of values, one for each plot. For example `vmin=[0.1, 'p1', None, my_vmin]`
vmax `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ] | `Sequence` [ `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ]] | `None` (default: `None` )
The value representing the upper limit of the color scale. The format is the same as for `vmin` .
vcenter `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ] | `Sequence` [ `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ]] | `None` (default: `None` )
The value representing the center of the color scale. Useful for diverging colormaps. The format is the same as for `vmin` . Example: `sc.pl.umap(adata, color='TREM2', vcenter='p50', cmap='RdBu_r')`
add_outline `bool` | `None` (default: `False` )
If set to True, this will add a thin border around groups of dots. In some situations this can enhance the aesthetics of the resulting image
outline_color `tuple` [ `str` , `str` ] (default: `('black', 'white')` )
Tuple with two valid color names used to adjust the add_outline. The first color is the border color (default: black), while the second color is a gap color between the border color and the scatter dot (default: white).
outline_width `tuple` [ `float` , `float` ] (default: `(0.3, 0.05)` )
Tuple with two width numbers used to adjust the outline. The first value is the width of the border color as a fraction of the scatter dot size (default: 0.3). The second value is width of the gap color (default: 0.05).
ncols `int` (default: `4` )
Number of panels per row.
wspace `float` | `None` (default: `None` )
Adjust the width of the space between multiple panels.
hspace `float` (default: `0.25` )
Adjust the height of the space between multiple panels.
return_fig `bool` | `None` (default: `None` )
Return the matplotlib figure.
kwargs
Arguments to pass to `matplotlib.pyplot.scatter()` , for instance: the maximum and minimum values (e.g. `vmin=-2, vmax=5` ).
show `bool` | `None` (default: `None` )
Show the plot, do not return axis.
save `bool` | `str` | `None` (default: `None` )
If `True` or a `str` , save the figure. A string is appended to the default filename. Infer the filetype if ending on { `'.pdf'` , `'.png'` , `'.svg'` }. (deprecated in favour of `sc.pl.plot(show=False).figure.savefig()` ).
ax `Axes` | `None` (default: `None` )
A matplotlib axes object. Only works if plotting a single component.
Return type :
`Figure` | `Axes` | `list` [ `Axes` ] | `None`
Returns :
If `show==False` a `Axes` or a list of it.

```
import scanpy as sc
adata = sc.datasets.pbmc68k_reduced()
sc.tl.diffmap(adata)
sc.pl.diffmap(adata, color='bulk_labels')
```

### scanpy.pl.dpt_groups_pseudotime

#### Contents

### scanpy.pl.dpt_groups_pseudotime #

scanpy.pl. dpt_groups_pseudotime ( adata , * , color_map = None , palette = None , show = None , marker = '.' , return_fig = False , save = None ) [source] #
Plot groups and pseudotime.

Parameters :

adata `AnnData`
Annotated data matrix.
color_map `str` | `Colormap` | `None` (default: `None` )
Color map to use for continous variables. Can be a name or a `Colormap` instance (e.g. `"magma` ”, `"viridis"` or `mpl.cm.cividis` ), see `get_cmap()` . If `None` , the value of `mpl.rcParams["image.cmap"]` is used. The default `color_map` can be set using `set_figure_params()` .
palette `Sequence` [ `str` ] | `Cycler` | `None` (default: `None` )
Colors to use for plotting categorical annotation groups. The palette can be a valid `ListedColormap` name ( `'Set2'` , `'tab20'` , …), a `Cycler` object, a dict mapping categories to colors, or a sequence of colors. Colors must be valid to matplotlib. (see `is_color_like()` ). If `None` , `mpl.rcParams["axes.prop_cycle"]` is used unless the categorical variable already has colors stored in `adata.uns["{var}_colors"]` . If provided, values of `adata.uns["{var}_colors"]` will be set.
show `bool` | `None` (default: `None` )
Show the plot, do not return axis.
save `bool` | `str` | `None` (default: `None` )
If `True` or a `str` , save the figure. A string is appended to the default filename. Infer the filetype if ending on { `'.pdf'` , `'.png'` , `'.svg'` }. (deprecated in favour of `sc.pl.plot(show=False).figure.savefig()` ).
marker `str` | `Sequence` [ `str` ] (default: `'.'` )
Marker style. See `markers` for details.
Return type :
`Figure` | `None`

### scanpy.pl.dpt_timeseries

#### Contents

### scanpy.pl.dpt_timeseries #

scanpy.pl. dpt_timeseries ( adata , * , color_map = None , show = None , as_heatmap = True , marker = '.' , save = None ) [source] #
Heatmap of pseudotime series.

Parameters :

as_heatmap `bool` (default: `True` )
Plot the timeseries as heatmap.

### scanpy.pl.draw_graph

#### Contents

### scanpy.pl.draw_graph #

scanpy.pl. draw_graph ( adata , * , color = None , mask_obs = None , gene_symbols = None , use_raw = None , sort_order = True , edges = False , edges_width = 0.1 , edges_color = 'grey' , neighbors_key = None , arrows = False , arrows_kwds = None , groups = None , components = None , dimensions = None , layer = None , projection = '2d' , scale_factor = None , color_map = None , cmap = None , palette = None , na_color = 'lightgray' , na_in_legend = True , size = None , frameon = None , legend_fontsize = None , legend_fontweight = 'bold' , legend_loc = 'right margin' , legend_fontoutline = None , colorbar_loc = 'right' , vmax = None , vmin = None , vcenter = None , norm = None , add_outline = False , outline_width = (0.3, 0.05) , outline_color = ('black', 'white') , ncols = 4 , hspace = 0.25 , wspace = None , title = None , show = None , ax = None , return_fig = None , marker = '.' , save = None , layout = None , ** kwargs ) [source] #
Scatter plot in graph-drawing basis.

Parameters :

adata `AnnData`
Annotated data matrix.
color `str` | `Sequence` [ `str` ] | `None` (default: `None` )
Keys for annotations of observations/cells or variables/genes, e.g., `'ann1'` or `['ann1', 'ann2']` .
gene_symbols `str` | `None` (default: `None` )
Column name in `.var` DataFrame that stores gene symbols. By default `var_names` refer to the index column of the `.var` DataFrame. Setting this option allows alternative names to be used.
use_raw `bool` | `None` (default: `None` )
Use `.raw` attribute of `adata` for coloring with gene expression. If `None` , defaults to `True` if `layer` isn’t provided and `adata.raw` is present.
layer `str` | `None` (default: `None` )
Name of the AnnData object layer that wants to be plotted. By default adata.raw.X is plotted. If `use_raw=False` is set, then `adata.X` is plotted. If `layer` is set to a valid layer name, then the layer is plotted. `layer` takes precedence over `use_raw` .
layout `Literal` [ `'fr'` , `'drl'` , `'kk'` , `'grid_fr'` , `'lgl'` , `'rt'` , `'rt_circular'` , `'fa'` ] | `None` (default: `None` )
One of the `draw_graph()` layouts. By default, the last computed layout is used.
edges `bool` (default: `False` )
Show edges.
edges_width `float` (default: `0.1` )
Width of edges.
edges_color `str` | `Sequence` [ `float` ] | `Sequence` [ `str` ] (default: `'grey'` )
Color of edges. See `draw_networkx_edges()` .
neighbors_key `str` | `None` (default: `None` )
Where to look for neighbors connectivities. If not specified, this retrieves `.obsp['connectivities']` for connectivities (default storage place for `neighbors()` ). If specified, this retrieves `.obsp[.uns[neighbors_key]['connectivities_key']]` for connectivities.
arrows `bool` (default: `False` )
Show arrows (deprecated in favour of `scvelo.pl.velocity_embedding` ).
arrows_kwds `Mapping` [ `str` , `Any` ] | `None` (default: `None` )
Passed to `quiver()`
sort_order `bool` (default: `True` )
For continuous annotations used as color parameter, plot data points with higher values on top of others.
groups `str` | `Sequence` [ `str` ] | `None` (default: `None` )
Restrict to a few categories in categorical observation annotation. The default is not to restrict to any groups.
dimensions `tuple` [ `int` , `int` ] | `Sequence` [ `tuple` [ `int` , `int` ]] | `None` (default: `None` )
0-indexed dimensions of the embedding to plot as integers. E.g. [(0, 1), (1, 2)]. Unlike `components` , this argument is used in the same way as `colors` , e.g. is used to specify a single plot at a time. Will eventually replace the components argument.
components `str` | `Sequence` [ `str` ] | `None` (default: `None` )
For instance, `['1,2', '2,3']` . To plot all available components use `components='all'` .
projection `Literal` [ `'2d'` , `'3d'` ] (default: `'2d'` )
Projection of plot (default: `'2d'` ).
legend_loc `Literal` [ `'none'` , `'right margin'` , `'on data'` , `'on data export'` , `'best'` , `'upper right'` , `'upper left'` , `'lower left'` , `'lower right'` , `'right'` , `'center left'` , `'center right'` , `'lower center'` , `'upper center'` , `'center'` ] | `None` (default: `'right margin'` )
Location of legend, either `'on data'` , `'right margin'` , `None` , or a valid keyword for the `loc` parameter of `Legend` .
legend_fontsize `float` | `Literal` [ `'xx-small'` , `'x-small'` , `'small'` , `'medium'` , `'large'` , `'x-large'` , `'xx-large'` ] | `None` (default: `None` )
Numeric size in pt or string describing the size. See `set_fontsize()` .
legend_fontweight `int` | `Literal` [ `'light'` , `'normal'` , `'medium'` , `'semibold'` , `'bold'` , `'heavy'` , `'black'` ] (default: `'bold'` )
Legend font weight. A numeric value in range 0-1000 or a string. Defaults to `'bold'` if `legend_loc == 'on data'` , otherwise to `'normal'` . See `set_fontweight()` .
legend_fontoutline `int` | `None` (default: `None` )
Line width of the legend font outline in pt. Draws a white outline using the path effect `withStroke` .
size `float` | `Sequence` [ `float` ] | `None` (default: `None` )
Point size. If `None` , is automatically computed as 120000 / n_cells. Can be a sequence containing the size for each cell. The order should be the same as in adata.obs.
color_map `Colormap` | `str` | `None` (default: `None` )
Color map to use for continous variables. Can be a name or a `Colormap` instance (e.g. `"magma` ”, `"viridis"` or `mpl.cm.cividis` ), see `get_cmap()` . If `None` , the value of `mpl.rcParams["image.cmap"]` is used. The default `color_map` can be set using `set_figure_params()` .
palette `str` | `Sequence` [ `str` ] | `Cycler` | `None` (default: `None` )
Colors to use for plotting categorical annotation groups. The palette can be a valid `ListedColormap` name ( `'Set2'` , `'tab20'` , …), a `Cycler` object, a dict mapping categories to colors, or a sequence of colors. Colors must be valid to matplotlib. (see `is_color_like()` ). If `None` , `mpl.rcParams["axes.prop_cycle"]` is used unless the categorical variable already has colors stored in `adata.uns["{var}_colors"]` . If provided, values of `adata.uns["{var}_colors"]` will be set.
frameon `bool` | `None` (default: `None` )
Draw a frame around the scatter plot. Defaults to value set in `set_figure_params()` , defaults to `True` .
title `str` | `Sequence` [ `str` ] | `None` (default: `None` )
Provide title for panels either as string or list of strings, e.g. `['title1', 'title2', ...]` .
colorbar_loc `Literal` [ `'right'` , `'left'` , `'top'` , `'bottom'` ] | `None` (default: `'right'` )
Where to place the colorbar for continous variables. If `None` , no colorbar is added.
na_color `str` | `tuple` [ `float` , `float` , `float` ] | `tuple` [ `float` , `float` , `float` , `float` ] (default: `'lightgray'` )
Color to use for null or masked values. Can be anything matplotlib accepts as a color. Used for all points if `color=None` .
na_in_legend `bool` (default: `True` )
If there are missing values, whether they get an entry in the legend. Currently only implemented for categorical legends.
vmin `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ] | `Sequence` [ `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ]] | `None` (default: `None` )
The value representing the lower limit of the color scale. Values smaller than vmin are plotted with the same color as vmin. vmin can be a number, a string, a function or `None` . If vmin is a string and has the format `pN` , this is interpreted as a vmin=percentile(N). For example vmin=’p1.5’ is interpreted as the 1.5 percentile. If vmin is function, then vmin is interpreted as the return value of the function over the list of values to plot. For example to set vmin tp the mean of the values to plot,

```
def my_vmin(values): returnnp.mean(values)
```

Examples

and then set `vmin=my_vmin` . If vmin is None (default) an automatic minimum value is used as defined by matplotlib `scatter` function. When making multiple plots, vmin can be a list of values, one for each plot. For example `vmin=[0.1, 'p1', None, my_vmin]`
vmax `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ] | `Sequence` [ `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ]] | `None` (default: `None` )
The value representing the upper limit of the color scale. The format is the same as for `vmin` .
vcenter `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ] | `Sequence` [ `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ]] | `None` (default: `None` )
The value representing the center of the color scale. Useful for diverging colormaps. The format is the same as for `vmin` . Example: `sc.pl.umap(adata, color='TREM2', vcenter='p50', cmap='RdBu_r')`
add_outline `bool` | `None` (default: `False` )
If set to True, this will add a thin border around groups of dots. In some situations this can enhance the aesthetics of the resulting image
outline_color `tuple` [ `str` , `str` ] (default: `('black', 'white')` )
Tuple with two valid color names used to adjust the add_outline. The first color is the border color (default: black), while the second color is a gap color between the border color and the scatter dot (default: white).
outline_width `tuple` [ `float` , `float` ] (default: `(0.3, 0.05)` )
Tuple with two width numbers used to adjust the outline. The first value is the width of the border color as a fraction of the scatter dot size (default: 0.3). The second value is width of the gap color (default: 0.05).
ncols `int` (default: `4` )
Number of panels per row.
wspace `float` | `None` (default: `None` )
Adjust the width of the space between multiple panels.
hspace `float` (default: `0.25` )
Adjust the height of the space between multiple panels.
return_fig `bool` | `None` (default: `None` )
Return the matplotlib figure.
kwargs
Arguments to pass to `matplotlib.pyplot.scatter()` , for instance: the maximum and minimum values (e.g. `vmin=-2, vmax=5` ).
show `bool` | `None` (default: `None` )
Show the plot, do not return axis.
save `bool` | `str` | `None` (default: `None` )
If `True` or a `str` , save the figure. A string is appended to the default filename. Infer the filetype if ending on { `'.pdf'` , `'.png'` , `'.svg'` }. (deprecated in favour of `sc.pl.plot(show=False).figure.savefig()` ).
ax `Axes` | `None` (default: `None` )
A matplotlib axes object. Only works if plotting a single component.
Return type :
`Figure` | `Axes` | `list` [ `Axes` ] | `None`
Returns :
If `show==False` a `Axes` or a list of it.

```
import scanpy as sc
adata = sc.datasets.pbmc68k_reduced()
sc.tl.draw_graph(adata)
sc.pl.draw_graph(adata, color=['phase', 'bulk_labels'])
```

See also

```
tl.draw_graph
```

### scanpy.pl.embedding

#### Contents

### scanpy.pl.embedding #

scanpy.pl. embedding ( adata , basis , * , color = None , mask_obs = None , gene_symbols = None , use_raw = None , sort_order = True , edges = False , edges_width = 0.1 , edges_color = 'grey' , neighbors_key = None , arrows = False , arrows_kwds = None , groups = None , components = None , dimensions = None , layer = None , projection = '2d' , scale_factor = None , color_map = None , cmap = None , palette = None , na_color = 'lightgray' , na_in_legend = True , size = None , frameon = None , legend_fontsize = None , legend_fontweight = 'bold' , legend_loc = 'right margin' , legend_fontoutline = None , colorbar_loc = 'right' , vmax = None , vmin = None , vcenter = None , norm = None , add_outline = False , outline_width = (0.3, 0.05) , outline_color = ('black', 'white') , ncols = 4 , hspace = 0.25 , wspace = None , title = None , show = None , ax = None , return_fig = None , marker = '.' , save = None , ** kwargs ) [source] #
Scatter plot for user specified embedding basis (e.g. umap, pca, etc).

Parameters :

basis `str`
Name of the `obsm` basis to use.
adata `AnnData`
Annotated data matrix.
color `str` | `Sequence` [ `str` ] | `None` (default: `None` )
Keys for annotations of observations/cells or variables/genes, e.g., `'ann1'` or `['ann1', 'ann2']` .
gene_symbols `str` | `None` (default: `None` )
Column name in `.var` DataFrame that stores gene symbols. By default `var_names` refer to the index column of the `.var` DataFrame. Setting this option allows alternative names to be used.
use_raw `bool` | `None` (default: `None` )
Use `.raw` attribute of `adata` for coloring with gene expression. If `None` , defaults to `True` if `layer` isn’t provided and `adata.raw` is present.
layer `str` | `None` (default: `None` )
Name of the AnnData object layer that wants to be plotted. By default adata.raw.X is plotted. If `use_raw=False` is set, then `adata.X` is plotted. If `layer` is set to a valid layer name, then the layer is plotted. `layer` takes precedence over `use_raw` .
edges `bool` (default: `False` )
Show edges.
edges_width `float` (default: `0.1` )
Width of edges.
edges_color `str` | `Sequence` [ `float` ] | `Sequence` [ `str` ] (default: `'grey'` )
Color of edges. See `draw_networkx_edges()` .
neighbors_key `str` | `None` (default: `None` )
Where to look for neighbors connectivities. If not specified, this retrieves `.obsp['connectivities']` for connectivities (default storage place for `neighbors()` ). If specified, this retrieves `.obsp[.uns[neighbors_key]['connectivities_key']]` for connectivities.
arrows `bool` (default: `False` )
Show arrows (deprecated in favour of `scvelo.pl.velocity_embedding` ).
arrows_kwds `Mapping` [ `str` , `Any` ] | `None` (default: `None` )
Passed to `quiver()`
sort_order `bool` (default: `True` )
For continuous annotations used as color parameter, plot data points with higher values on top of others.
groups `str` | `Sequence` [ `str` ] | `None` (default: `None` )
Restrict to a few categories in categorical observation annotation. The default is not to restrict to any groups.
dimensions `tuple` [ `int` , `int` ] | `Sequence` [ `tuple` [ `int` , `int` ]] | `None` (default: `None` )
0-indexed dimensions of the embedding to plot as integers. E.g. [(0, 1), (1, 2)]. Unlike `components` , this argument is used in the same way as `colors` , e.g. is used to specify a single plot at a time. Will eventually replace the components argument.
components `str` | `Sequence` [ `str` ] | `None` (default: `None` )
For instance, `['1,2', '2,3']` . To plot all available components use `components='all'` .
projection `Literal` [ `'2d'` , `'3d'` ] (default: `'2d'` )
Projection of plot (default: `'2d'` ).
legend_loc `Literal` [ `'none'` , `'right margin'` , `'on data'` , `'on data export'` , `'best'` , `'upper right'` , `'upper left'` , `'lower left'` , `'lower right'` , `'right'` , `'center left'` , `'center right'` , `'lower center'` , `'upper center'` , `'center'` ] | `None` (default: `'right margin'` )
Location of legend, either `'on data'` , `'right margin'` , `None` , or a valid keyword for the `loc` parameter of `Legend` .
legend_fontsize `float` | `Literal` [ `'xx-small'` , `'x-small'` , `'small'` , `'medium'` , `'large'` , `'x-large'` , `'xx-large'` ] | `None` (default: `None` )
Numeric size in pt or string describing the size. See `set_fontsize()` .
legend_fontweight `int` | `Literal` [ `'light'` , `'normal'` , `'medium'` , `'semibold'` , `'bold'` , `'heavy'` , `'black'` ] (default: `'bold'` )
Legend font weight. A numeric value in range 0-1000 or a string. Defaults to `'bold'` if `legend_loc == 'on data'` , otherwise to `'normal'` . See `set_fontweight()` .
legend_fontoutline `int` | `None` (default: `None` )
Line width of the legend font outline in pt. Draws a white outline using the path effect `withStroke` .
size `float` | `Sequence` [ `float` ] | `None` (default: `None` )
Point size. If `None` , is automatically computed as 120000 / n_cells. Can be a sequence containing the size for each cell. The order should be the same as in adata.obs.
color_map `Colormap` | `str` | `None` (default: `None` )
Color map to use for continous variables. Can be a name or a `Colormap` instance (e.g. `"magma` ”, `"viridis"` or `mpl.cm.cividis` ), see `get_cmap()` . If `None` , the value of `mpl.rcParams["image.cmap"]` is used. The default `color_map` can be set using `set_figure_params()` .
palette `str` | `Sequence` [ `str` ] | `Cycler` | `None` (default: `None` )
Colors to use for plotting categorical annotation groups. The palette can be a valid `ListedColormap` name ( `'Set2'` , `'tab20'` , …), a `Cycler` object, a dict mapping categories to colors, or a sequence of colors. Colors must be valid to matplotlib. (see `is_color_like()` ). If `None` , `mpl.rcParams["axes.prop_cycle"]` is used unless the categorical variable already has colors stored in `adata.uns["{var}_colors"]` . If provided, values of `adata.uns["{var}_colors"]` will be set.
frameon `bool` | `None` (default: `None` )
Draw a frame around the scatter plot. Defaults to value set in `set_figure_params()` , defaults to `True` .
title `str` | `Sequence` [ `str` ] | `None` (default: `None` )
Provide title for panels either as string or list of strings, e.g. `['title1', 'title2', ...]` .
colorbar_loc `Literal` [ `'right'` , `'left'` , `'top'` , `'bottom'` ] | `None` (default: `'right'` )
Where to place the colorbar for continous variables. If `None` , no colorbar is added.
na_color `str` | `tuple` [ `float` , `float` , `float` ] | `tuple` [ `float` , `float` , `float` , `float` ] (default: `'lightgray'` )
Color to use for null or masked values. Can be anything matplotlib accepts as a color. Used for all points if `color=None` .
na_in_legend `bool` (default: `True` )
If there are missing values, whether they get an entry in the legend. Currently only implemented for categorical legends.
vmin `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ] | `Sequence` [ `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ]] | `None` (default: `None` )
The value representing the lower limit of the color scale. Values smaller than vmin are plotted with the same color as vmin. vmin can be a number, a string, a function or `None` . If vmin is a string and has the format `pN` , this is interpreted as a vmin=percentile(N). For example vmin=’p1.5’ is interpreted as the 1.5 percentile. If vmin is function, then vmin is interpreted as the return value of the function over the list of values to plot. For example to set vmin tp the mean of the values to plot,

```
def my_vmin(values): returnnp.mean(values)
```

Examples
Plot a precomputed UMAP embedding coloured by the `'bulk_labels'` cell-type annotation.

and then set `vmin=my_vmin` . If vmin is None (default) an automatic minimum value is used as defined by matplotlib `scatter` function. When making multiple plots, vmin can be a list of values, one for each plot. For example `vmin=[0.1, 'p1', None, my_vmin]`
vmax `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ] | `Sequence` [ `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ]] | `None` (default: `None` )
The value representing the upper limit of the color scale. The format is the same as for `vmin` .
vcenter `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ] | `Sequence` [ `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ]] | `None` (default: `None` )
The value representing the center of the color scale. Useful for diverging colormaps. The format is the same as for `vmin` . Example: `sc.pl.umap(adata, color='TREM2', vcenter='p50', cmap='RdBu_r')`
add_outline `bool` | `None` (default: `False` )
If set to True, this will add a thin border around groups of dots. In some situations this can enhance the aesthetics of the resulting image
outline_color `tuple` [ `str` , `str` ] (default: `('black', 'white')` )
Tuple with two valid color names used to adjust the add_outline. The first color is the border color (default: black), while the second color is a gap color between the border color and the scatter dot (default: white).
outline_width `tuple` [ `float` , `float` ] (default: `(0.3, 0.05)` )
Tuple with two width numbers used to adjust the outline. The first value is the width of the border color as a fraction of the scatter dot size (default: 0.3). The second value is width of the gap color (default: 0.05).
ncols `int` (default: `4` )
Number of panels per row.
wspace `float` | `None` (default: `None` )
Adjust the width of the space between multiple panels.
hspace `float` (default: `0.25` )
Adjust the height of the space between multiple panels.
return_fig `bool` | `None` (default: `None` )
Return the matplotlib figure.
kwargs
Arguments to pass to `matplotlib.pyplot.scatter()` , for instance: the maximum and minimum values (e.g. `vmin=-2, vmax=5` ).
show `bool` | `None` (default: `None` )
Show the plot, do not return axis.
save `bool` | `str` | `None` (default: `None` )
If `True` or a `str` , save the figure. A string is appended to the default filename. Infer the filetype if ending on { `'.pdf'` , `'.png'` , `'.svg'` }. (deprecated in favour of `sc.pl.plot(show=False).figure.savefig()` ).
ax `Axes` | `None` (default: `None` )
A matplotlib axes object. Only works if plotting a single component.
Return type :
`Figure` | `Axes` | `list` [ `Axes` ] | `None`
Returns :
If `show==False` a `Axes` or a list of it.

```
import scanpy as sc
adata = sc.datasets.pbmc68k_reduced()
sc.pl.embedding(adata, basis="umap", color="bulk_labels")
```

Show several panels in a single call by passing a list of keys to `color` , mixing categorical annotations and gene expression.

```
sc.pl.embedding(adata, basis="umap", color=["bulk_labels", "CD3D", "LYZ"])
```

### scanpy.pl.embedding_density

#### Contents

### scanpy.pl.embedding_density #

scanpy.pl. embedding_density ( adata , basis = 'umap' , * , key = None , groupby = None , group = 'all' , color_map = 'YlOrRd' , bg_dotsize = 80 , fg_dotsize = 180 , vmax = 1 , vmin = 0 , vcenter = None , norm = None , ncols = 4 , hspace = 0.25 , wspace = None , title = None , show = None , ax = None , return_fig = None , save = None , ** kwargs ) [source] #
Plot the density of cells in an embedding (per condition).
Plots the gaussian kernel density estimates (over condition) from the `sc.tl.embedding_density()` output.
This function was written by Sophie Tritschler and implemented into Scanpy by Malte Luecken.

Parameters :

adata `AnnData`
The annotated data matrix.
basis `str` (default: `'umap'` )
The embedding over which the density was calculated. This embedded representation should be found in `adata.obsm['X_[basis]']`` .
key `str` | `None` (default: `None` )
Name of the `.obs` covariate that contains the density estimates. Alternatively, pass `groupby` .
groupby `str` | `None` (default: `None` )
Name of the condition used in `tl.embedding_density` . Alternatively, pass `key` .
group `str` | `Sequence` [ `str` ] | `None` (default: `'all'` )
The category in the categorical observation annotation to be plotted. For example, ‘G1’ in the cell cycle ‘phase’ covariate. If all categories are to be plotted use group=’all’ (default), If multiple categories want to be plotted use a list (e.g.: [‘G1’, ‘S’]. If the overall density wants to be ploted set group to ‘None’.
color_map `Colormap` | `str` (default: `'YlOrRd'` )
Matplolib color map to use for density plotting.
bg_dotsize `int` | `None` (default: `80` )
Dot size for background data points not in the `group` .
fg_dotsize `int` | `None` (default: `180` )
Dot size for foreground data points in the `group` .
vmin `int` | `None` (default: `0` )
The value representing the lower limit of the color scale. Values smaller than vmin are plotted with the same color as vmin. vmin can be a number, a string, a function or `None` . If vmin is a string and has the format `pN` , this is interpreted as a vmin=percentile(N). For example vmin=’p1.5’ is interpreted as the 1.5 percentile. If vmin is function, then vmin is interpreted as the return value of the function over the list of values to plot. For example to set vmin tp the mean of the values to plot,

```
def my_vmin(values): returnnp.mean(values)
```

Examples

and then set `vmin=my_vmin` . If vmin is None (default) an automatic minimum value is used as defined by matplotlib `scatter` function. When making multiple plots, vmin can be a list of values, one for each plot. For example `vmin=[0.1, 'p1', None, my_vmin]`
vmax `int` | `None` (default: `1` )
The value representing the upper limit of the color scale. The format is the same as for `vmin` .
vcenter `int` | `None` (default: `None` )
The value representing the center of the color scale. Useful for diverging colormaps. The format is the same as for `vmin` . Example: `sc.pl.umap(adata, color='TREM2', vcenter='p50', cmap='RdBu_r')`
ncols `int` | `None` (default: `4` )
Number of panels per row.
wspace `None` (default: `None` )
Adjust the width of the space between multiple panels.
hspace `float` | `None` (default: `0.25` )
Adjust the height of the space between multiple panels.
return_fig `bool` | `None` (default: `None` )
Return the matplotlib figure.
show `bool` | `None` (default: `None` )
Show the plot, do not return axis.
save `bool` | `str` | `None` (default: `None` )
If `True` or a `str` , save the figure. A string is appended to the default filename. Infer the filetype if ending on { `'.pdf'` , `'.png'` , `'.svg'` }. (deprecated in favour of `sc.pl.plot(show=False).figure.savefig()` ).
ax `Axes` | `None` (default: `None` )
A matplotlib axes object. Only works if plotting a single component.
Return type :
`Figure` | `Axes` | `None`

```
import scanpy as sc
adata = sc.datasets.pbmc68k_reduced()
sc.tl.umap(adata)
sc.tl.embedding_density(adata, basis='umap', groupby='phase')
```

Plot all categories be default

```
sc.pl.embedding_density(adata, basis='umap', key='umap_density_phase')
```

Plot selected categories

```
sc.pl.embedding_density(
    adata,
    basis='umap',
    key='umap_density_phase',
    group=['G1', 'S'],
)
```

### scanpy.pl.highest_expr_genes

#### Contents

### scanpy.pl.highest_expr_genes #

scanpy.pl. highest_expr_genes ( adata , n_top = 30 , * , layer = None , gene_symbols = None , log = False , show = None , save = None , ax = None , ** kwds ) [source] #
Fraction of counts assigned to each gene over all cells.
Computes, for each gene, the fraction of counts assigned to that gene within a cell. The `n_top` genes with the highest mean fraction over all cells are plotted as boxplots.
This plot is similar to the `scater` package function

```
plotHighestExprs(type= "highest-expression")
```

, see here . Quoting from there:
We expect to see the “usual suspects”, i.e., mitochondrial genes, actin, ribosomal protein, MALAT1. A few spike-in transcripts may also be present here, though if all of the spike-ins are in the top 50, it suggests that too much spike-in RNA was added. A large number of pseudo-genes or predicted genes may indicate problems with alignment. – Davis McCarthy and Aaron Lun
Examples
Parameters :

adata `AnnData`
Annotated data matrix.
n_top `int` (default: `30` )
Number of top
layer `str` | `None` (default: `None` )
Layer from which to pull data.
gene_symbols `str` | `None` (default: `None` )
Key for field in .var that stores gene symbols if you do not want to use .var_names.
log `bool` (default: `False` )
Plot x-axis in log scale
show `bool` | `None` (default: `None` )
Show the plot, do not return axis.
save `str` | `bool` | `None` (default: `None` )
If `True` or a `str` , save the figure. A string is appended to the default filename. Infer the filetype if ending on { `'.pdf'` , `'.png'` , `'.svg'` }. (deprecated in favour of `sc.pl.plot(show=False).figure.savefig()` ).
ax `Axes` | `None` (default: `None` )
A matplotlib axes object. Only works if plotting a single component.
**kwds
Are passed to `boxplot()` .
Returns :
If `show==False` a `Axes` .

```
import scanpy as sc
adata = sc.datasets.pbmc3k()
sc.pl.highest_expr_genes(adata)
```

Show only the top 10 genes

```
sc.pl.highest_expr_genes(adata, n_top=10)
```

### scanpy.pl.highly_variable_genes

#### Contents

### scanpy.pl.highly_variable_genes #

scanpy.pl. highly_variable_genes ( adata_or_result , * , log = False , show = None , highly_variable_genes = True , save = None ) [source] #
Plot dispersions or normalized variance versus means for genes.
Produces Supp. Fig. 5c of Zheng et al. (2017) and MeanVarPlot() and VariableFeaturePlot() of Seurat.

Parameters :

adata
Result of `highly_variable_genes()` .
log `bool` (default: `False` )
Plot on logarithmic axes.
show `bool` | `None` (default: `None` )
Show the plot, do not return axis.
save `bool` | `str` | `None` (default: `None` )
If `True` or a `str` , save the figure. A string is appended to the default filename. Infer the filetype if ending on {{ `'.pdf'` , `'.png'` , `'.svg'` }}.
Return type :

```
None
```

Examples
Compute and plot highly variable genes from raw PBMC data.

```
import scanpy as sc
adata = sc.datasets.pbmc3k()
sc.pp.normalize_total(adata, target_sum=1e4)
sc.pp.log1p(adata)
sc.pp.highly_variable_genes(adata, min_mean=0.0125, max_mean=3, min_disp=0.5)
sc.pl.highly_variable_genes(adata)
```

Plot on logarithmic axes.

```
sc.pl.highly_variable_genes(adata, log=True)
```

### scanpy.pl.paga

#### Contents

### scanpy.pl.paga #

scanpy.pl. paga ( adata , * , threshold = None , color = None , layout = None , layout_kwds = mappingproxy({}) , init_pos = None , root = 0 , labels = None , single_component = False , solid_edges = 'connectivities' , dashed_edges = None , transitions = None , fontsize = None , fontweight = 'bold' , fontoutline = None , text_kwds = mappingproxy({}) , node_size_scale = 1.0 , node_size_power = 0.5 , edge_width_scale = 1.0 , min_edge_width = None , max_edge_width = None , arrowsize = 30 , title = None , left_margin = 0.01 , random_state = 0 , pos = None , normalize_to_color = False , cmap = None , cax = None , colorbar = None , cb_kwds = mappingproxy({}) , frameon = None , add_pos = True , export_to_gexf = False , use_raw = True , colors = None , groups = None , plot = True , show = None , ax = None , save = None ) [source] #
Plot the PAGA graph through thresholding low-connectivity edges.
Compute a coarse-grained layout of the data. Reuse this by passing `init_pos='paga'` to `umap()` or `draw_graph()` and obtain embeddings with more meaningful global topology [ Wolf et al. , 2019 ] .
This uses ForceAtlas2 or igraph’s layout algorithms for most layouts [ Csárdi and Nepusz, 2006 ] .
Examples
Parameters :

adata `AnnData`
Annotated data matrix.
threshold `float` | `None` (default: `None` )
Do not draw edges for weights below this threshold. Set to 0 if you want all edges. Discarding low-connectivity edges helps in getting a much clearer picture of the graph.
color `str` | `Mapping` [ `str` | `int` , `Mapping` [ `Any` , `float` ]] | `None` (default: `None` )
Gene name or `obs` annotation defining the node colors. Also plots the degree of the abstracted graph when passing { `'degree_dashed'` , `'degree_solid'` }.
Can be also used to visualize pie chart at each node in the following form: `{<group name or index>: {<color>: <fraction>, ...}, ...}` . If the fractions do not sum to 1, a new category called `'rest'` colored grey will be created.
labels `str` | `Sequence` [ `str` ] | `Mapping` [ `str` , `str` ] | `None` (default: `None` )
The node labels. If `None` , this defaults to the group labels stored in the categorical for which `paga()` has been computed.
pos `ndarray` | `Path` | `str` | `None` (default: `None` )
Two-column array-like storing the x and y coordinates for drawing. Otherwise, path to a `.gdf` file that has been exported from Gephi or a similar graph visualization software.
layout `Literal` [ `'fr'` , `'drl'` , `'kk'` , `'grid_fr'` , `'lgl'` , `'rt'` , `'rt_circular'` , `'fa'` ] | `Literal` [ `'eq_tree'` ] | `None` (default: `None` )
Plotting layout that computes positions. `'fa'` stands for “ForceAtlas2”, `'fr'` stands for “Fruchterman-Reingold”, `'rt'` stands for “Reingold-Tilford”, `'eq_tree'` stands for “eqally spaced tree”. All but `'fa'` and `'eq_tree'` are igraph layouts. All other igraph layouts are also permitted. See also parameter `pos` and `draw_graph()` .
layout_kwds `Mapping` [ `str` , `Any` ] (default: `mappingproxy({})` )
Keywords for the layout.
init_pos `ndarray` | `None` (default: `None` )
Two-column array storing the x and y coordinates for initializing the layout.
random_state `int` | `None` (default: `0` )
For layouts with random initialization like `'fr'` , change this to use different intial states for the optimization. If `None` , the initial state is not reproducible.
root `int` | `str` | `Sequence` [ `int` ] | `None` (default: `0` )
If choosing a tree layout, this is the index of the root node or a list of root node indices. If this is a non-empty vector then the supplied node IDs are used as the roots of the trees (or a single tree if the graph is connected). If this is `None` or an empty list, the root vertices are automatically calculated based on topological sorting.
transitions `str` | `None` (default: `None` )
Key for `.uns['paga']` that specifies the matrix that stores the arrows, for instance `'transitions_confidence'` .
solid_edges `str` (default: `'connectivities'` )
Key for `.uns['paga']` that specifies the matrix that stores the edges to be drawn solid black.
dashed_edges `str` | `None` (default: `None` )
Key for `.uns['paga']` that specifies the matrix that stores the edges to be drawn dashed grey. If `None` , no dashed edges are drawn.
single_component `bool` (default: `False` )
Restrict to largest connected component.
fontsize `int` | `None` (default: `None` )
Font size for node labels.
fontoutline `int` | `None` (default: `None` )
Width of the white outline around fonts.
text_kwds `Mapping` [ `str` , `Any` ] (default: `mappingproxy({})` )
Keywords for `text()` .
node_size_scale `float` (default: `1.0` )
Increase or decrease the size of the nodes.
node_size_power `float` (default: `0.5` )
The power with which groups sizes influence the radius of the nodes.
edge_width_scale `float` (default: `1.0` )
Edge with scale in units of `rcParams['lines.linewidth']` .
min_edge_width `float` | `None` (default: `None` )
Min width of solid edges.
max_edge_width `float` | `None` (default: `None` )
Max width of solid and dashed edges.
arrowsize `int` (default: `30` )
For directed graphs, choose the size of the arrow head head’s length and width. See :py:class: `matplotlib.patches.FancyArrowPatch` for attribute `mutation_scale` for more info.
export_to_gexf `bool` (default: `False` )
Export to gexf format to be read by graph visualization programs such as Gephi.
normalize_to_color `bool` (default: `False` )
Whether to normalize categorical plots to `color` or the underlying grouping.
cmap `str` | `Colormap` | `None` (default: `None` )
The color map.
cax `Axes` | `None` (default: `None` )
A matplotlib axes object for a potential colorbar.
cb_kwds `Mapping` [ `str` , `Any` ] (default: `mappingproxy({})` )
Keyword arguments for `Colorbar` , for instance, `ticks` .
add_pos `bool` (default: `True` )
Add the positions to `adata.uns['paga']` .
title `str` | `None` (default: `None` )
Provide a title.
frameon `bool` | `None` (default: `None` )
Draw a frame around the PAGA graph.
plot `bool` (default: `True` )
If `False` , do not create the figure, simply compute the layout.
save `bool` | `str` | `None` (default: `None` )
If `True` or a `str` , save the figure. A string is appended to the default filename. Infer the filetype if ending on { `'.pdf'` , `'.png'` , `'.svg'` }.
ax `Axes` | `None` (default: `None` )
A matplotlib axes object.
Return type :
`Axes` | `list` [ `Axes` ] | `None`
Returns :
If `show==False` , one or more `Axes` objects. Adds `'pos'` to `adata.uns['paga']` if `add_pos` is `True` .

```
import scanpy as sc
adata = sc.datasets.pbmc3k_processed()
sc.tl.paga(adata, groups='louvain')
sc.pl.paga(adata)
```

You can increase node and edge sizes by specifying additional arguments.

```
sc.pl.paga(adata, node_size_scale=10, edge_width_scale=2)
```

Notes
When initializing the positions, note that – for some reason – igraph mirrors coordinates along the x axis… that is, you should increase the `maxiter` parameter by 1 if the layout is flipped.
See also
`tl.paga` , `pl.paga_compare` , `pl.paga_path`

### scanpy.pl.paga_compare

#### Contents

### scanpy.pl.paga_compare #

scanpy.pl. paga_compare ( adata , basis = None , * , edges = False , color = None , alpha = None , groups = None , components = None , projection = '2d' , legend_loc = 'on data' , legend_fontsize = None , legend_fontweight = 'bold' , legend_fontoutline = None , color_map = None , palette = None , frameon = False , size = None , title = None , right_margin = None , left_margin = 0.05 , show = None , save = None , title_graph = None , groups_graph = None , pos = None , ** paga_graph_params ) [source] #
Scatter and PAGA graph side-by-side.
Consists in a scatter plot and the abstracted graph. See `paga()` for all related parameters.
See `paga_path()` for visualizing gene changes along paths through the abstracted graph.
Additional parameters are as follows.
Examples
Compute a PAGA graph on the bundled PBMC dataset and show it next to the UMAP embedding.
Parameters :

adata `AnnData`
Annotated data matrix.
kwds_scatter
Keywords for `scatter()` .
kwds_paga
Keywords for `paga()` .
Returns :
A list of `Axes` if `show` is `False` .

```
import scanpy as sc
adata = sc.datasets.pbmc68k_reduced()
sc.tl.paga(adata, groups="bulk_labels")
sc.pl.paga_compare(adata, basis="umap")
```

### scanpy.pl.paga_path

#### Contents

### scanpy.pl.paga_path #

scanpy.pl. paga_path ( adata , nodes , keys , * , use_raw = True , annotations = ('dpt_pseudotime',) , color_map = None , color_maps_annotations = mappingproxy({'dpt_pseudotime': 'Greys'}) , palette_groups = None , n_avg = 1 , groups_key = None , xlim = (None, None) , title = None , left_margin = None , ytick_fontsize = None , title_fontsize = None , show_node_names = True , show_yticks = True , show_colorbar = True , legend_fontsize = None , legend_fontweight = None , normalize_to_zero_one = False , as_heatmap = True , return_data = False , show = None , ax = None , save = None ) [source] #
Gene expression and annotation changes along paths in the abstracted graph.

Parameters :

adata `AnnData`
An annotated data matrix.
nodes `Sequence` [ `str` | `int` ]
A path through nodes of the abstracted graph, that is, names or indices (within `.categories` ) of groups that have been used to run PAGA.
keys `Sequence` [ `str` ]
Either variables in `adata.var_names` or annotations in `adata.obs` . They are plotted using `color_map` .
use_raw `bool` (default: `True` )
Use `adata.raw` for retrieving gene expressions if it has been set.
annotations `Sequence` [ `str` ] (default: `('dpt_pseudotime',)` )
Plot these keys with `color_maps_annotations` . Need to be keys for `adata.obs` .
color_map `str` | `Colormap` | `None` (default: `None` )
Matplotlib colormap.
color_maps_annotations `Mapping` [ `str` , `str` | `Colormap` ] (default: `mappingproxy({'dpt_pseudotime': 'Greys'})` )
Color maps for plotting the annotations. Keys of the dictionary must appear in `annotations` .
palette_groups `Sequence` [ `str` ] | `None` (default: `None` )
Ususally, use the same `sc.pl.palettes...` as used for coloring the abstracted graph.
n_avg `int` (default: `1` )
Number of data points to include in computation of running average.
groups_key `str` | `None` (default: `None` )
Key of the grouping used to run PAGA. If `None` , defaults to `adata.uns['paga']['groups']` .
as_heatmap `bool` (default: `True` )
Plot the timeseries as heatmap. If not plotting as heatmap, `annotations` have no effect.
show_node_names `bool` (default: `True` )
Plot the node names on the nodes bar.
show_colorbar `bool` (default: `True` )
Show the colorbar.
show_yticks `bool` (default: `True` )
Show the y ticks.
normalize_to_zero_one `bool` (default: `False` )
Shift and scale the running average to [0, 1] per gene.
return_data `bool` (default: `False` )
Return the timeseries data in addition to the axes if `True` .
show `bool` | `None` (default: `None` )
Show the plot, do not return axis.
save `bool` | `str` | `None` (default: `None` )
If `True` or a `str` , save the figure. A string is appended to the default filename. Infer the filetype if ending on { `'.pdf'` , `'.png'` , `'.svg'` }.
ax `Axes` | `None` (default: `None` )
A matplotlib axes object.
Return type :
`tuple` [ `Axes` , `DataFrame` ] | `Axes` | `DataFrame` | `None`
Returns :
A `Axes` object, if `ax` is `None` , else `None` . If `return_data` , return the timeseries data in addition to an axes.

### scanpy.pl.pca

#### Contents

### scanpy.pl.pca #

scanpy.pl. pca ( adata , * , color = None , mask_obs = None , gene_symbols = None , use_raw = None , sort_order = True , edges = False , edges_width = 0.1 , edges_color = 'grey' , neighbors_key = None , arrows = False , arrows_kwds = None , groups = None , components = None , dimensions = None , layer = None , projection = '2d' , scale_factor = None , color_map = None , cmap = None , palette = None , na_color = 'lightgray' , na_in_legend = True , size = None , frameon = None , legend_fontsize = None , legend_fontweight = 'bold' , legend_loc = 'right margin' , legend_fontoutline = None , colorbar_loc = 'right' , vmax = None , vmin = None , vcenter = None , norm = None , add_outline = False , outline_width = (0.3, 0.05) , outline_color = ('black', 'white') , ncols = 4 , hspace = 0.25 , wspace = None , title = None , show = None , ax = None , return_fig = None , marker = '.' , save = None , annotate_var_explained = False , ** kwargs ) [source] #
Scatter plot in PCA coordinates.
Use the parameter `annotate_var_explained` to annotate the explained variance.
Parameters :

adata `AnnData`
Annotated data matrix.
color `str` | `Sequence` [ `str` ] | `None` (default: `None` )
Keys for annotations of observations/cells or variables/genes, e.g., `'ann1'` or `['ann1', 'ann2']` .
gene_symbols `str` | `None` (default: `None` )
Column name in `.var` DataFrame that stores gene symbols. By default `var_names` refer to the index column of the `.var` DataFrame. Setting this option allows alternative names to be used.
use_raw `bool` | `None` (default: `None` )
Use `.raw` attribute of `adata` for coloring with gene expression. If `None` , defaults to `True` if `layer` isn’t provided and `adata.raw` is present.
layer `str` | `None` (default: `None` )
Name of the AnnData object layer that wants to be plotted. By default adata.raw.X is plotted. If `use_raw=False` is set, then `adata.X` is plotted. If `layer` is set to a valid layer name, then the layer is plotted. `layer` takes precedence over `use_raw` .
annotate_var_explained `bool` (default: `False` )
sort_order `bool` (default: `True` )
For continuous annotations used as color parameter, plot data points with higher values on top of others.
groups `str` | `Sequence` [ `str` ] | `None` (default: `None` )
Restrict to a few categories in categorical observation annotation. The default is not to restrict to any groups.
dimensions `tuple` [ `int` , `int` ] | `Sequence` [ `tuple` [ `int` , `int` ]] | `None` (default: `None` )
0-indexed dimensions of the embedding to plot as integers. E.g. [(0, 1), (1, 2)]. Unlike `components` , this argument is used in the same way as `colors` , e.g. is used to specify a single plot at a time. Will eventually replace the components argument.
components `str` | `Sequence` [ `str` ] | `None` (default: `None` )
For instance, `['1,2', '2,3']` . To plot all available components use `components='all'` .
projection `Literal` [ `'2d'` , `'3d'` ] (default: `'2d'` )
Projection of plot (default: `'2d'` ).
legend_loc `Literal` [ `'none'` , `'right margin'` , `'on data'` , `'on data export'` , `'best'` , `'upper right'` , `'upper left'` , `'lower left'` , `'lower right'` , `'right'` , `'center left'` , `'center right'` , `'lower center'` , `'upper center'` , `'center'` ] | `None` (default: `'right margin'` )
Location of legend, either `'on data'` , `'right margin'` , `None` , or a valid keyword for the `loc` parameter of `Legend` .
legend_fontsize `float` | `Literal` [ `'xx-small'` , `'x-small'` , `'small'` , `'medium'` , `'large'` , `'x-large'` , `'xx-large'` ] | `None` (default: `None` )
Numeric size in pt or string describing the size. See `set_fontsize()` .
legend_fontweight `int` | `Literal` [ `'light'` , `'normal'` , `'medium'` , `'semibold'` , `'bold'` , `'heavy'` , `'black'` ] (default: `'bold'` )
Legend font weight. A numeric value in range 0-1000 or a string. Defaults to `'bold'` if `legend_loc == 'on data'` , otherwise to `'normal'` . See `set_fontweight()` .
legend_fontoutline `int` | `None` (default: `None` )
Line width of the legend font outline in pt. Draws a white outline using the path effect `withStroke` .
size `float` | `Sequence` [ `float` ] | `None` (default: `None` )
Point size. If `None` , is automatically computed as 120000 / n_cells. Can be a sequence containing the size for each cell. The order should be the same as in adata.obs.
color_map `Colormap` | `str` | `None` (default: `None` )
Color map to use for continous variables. Can be a name or a `Colormap` instance (e.g. `"magma` ”, `"viridis"` or `mpl.cm.cividis` ), see `get_cmap()` . If `None` , the value of `mpl.rcParams["image.cmap"]` is used. The default `color_map` can be set using `set_figure_params()` .
palette `str` | `Sequence` [ `str` ] | `Cycler` | `None` (default: `None` )
Colors to use for plotting categorical annotation groups. The palette can be a valid `ListedColormap` name ( `'Set2'` , `'tab20'` , …), a `Cycler` object, a dict mapping categories to colors, or a sequence of colors. Colors must be valid to matplotlib. (see `is_color_like()` ). If `None` , `mpl.rcParams["axes.prop_cycle"]` is used unless the categorical variable already has colors stored in `adata.uns["{var}_colors"]` . If provided, values of `adata.uns["{var}_colors"]` will be set.
frameon `bool` | `None` (default: `None` )
Draw a frame around the scatter plot. Defaults to value set in `set_figure_params()` , defaults to `True` .
title `str` | `Sequence` [ `str` ] | `None` (default: `None` )
Provide title for panels either as string or list of strings, e.g. `['title1', 'title2', ...]` .
colorbar_loc `Literal` [ `'right'` , `'left'` , `'top'` , `'bottom'` ] | `None` (default: `'right'` )
Where to place the colorbar for continous variables. If `None` , no colorbar is added.
na_color `str` | `tuple` [ `float` , `float` , `float` ] | `tuple` [ `float` , `float` , `float` , `float` ] (default: `'lightgray'` )
Color to use for null or masked values. Can be anything matplotlib accepts as a color. Used for all points if `color=None` .
na_in_legend `bool` (default: `True` )
If there are missing values, whether they get an entry in the legend. Currently only implemented for categorical legends.
vmin `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ] | `Sequence` [ `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ]] | `None` (default: `None` )
The value representing the lower limit of the color scale. Values smaller than vmin are plotted with the same color as vmin. vmin can be a number, a string, a function or `None` . If vmin is a string and has the format `pN` , this is interpreted as a vmin=percentile(N). For example vmin=’p1.5’ is interpreted as the 1.5 percentile. If vmin is function, then vmin is interpreted as the return value of the function over the list of values to plot. For example to set vmin tp the mean of the values to plot,

```
def my_vmin(values): returnnp.mean(values)
```

Examples

and then set `vmin=my_vmin` . If vmin is None (default) an automatic minimum value is used as defined by matplotlib `scatter` function. When making multiple plots, vmin can be a list of values, one for each plot. For example `vmin=[0.1, 'p1', None, my_vmin]`
vmax `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ] | `Sequence` [ `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ]] | `None` (default: `None` )
The value representing the upper limit of the color scale. The format is the same as for `vmin` .
vcenter `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ] | `Sequence` [ `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ]] | `None` (default: `None` )
The value representing the center of the color scale. Useful for diverging colormaps. The format is the same as for `vmin` . Example: `sc.pl.umap(adata, color='TREM2', vcenter='p50', cmap='RdBu_r')`
add_outline `bool` | `None` (default: `False` )
If set to True, this will add a thin border around groups of dots. In some situations this can enhance the aesthetics of the resulting image
outline_color `tuple` [ `str` , `str` ] (default: `('black', 'white')` )
Tuple with two valid color names used to adjust the add_outline. The first color is the border color (default: black), while the second color is a gap color between the border color and the scatter dot (default: white).
outline_width `tuple` [ `float` , `float` ] (default: `(0.3, 0.05)` )
Tuple with two width numbers used to adjust the outline. The first value is the width of the border color as a fraction of the scatter dot size (default: 0.3). The second value is width of the gap color (default: 0.05).
ncols `int` (default: `4` )
Number of panels per row.
wspace `float` | `None` (default: `None` )
Adjust the width of the space between multiple panels.
hspace `float` (default: `0.25` )
Adjust the height of the space between multiple panels.
return_fig `bool` | `None` (default: `None` )
Return the matplotlib figure.
kwargs
Arguments to pass to `matplotlib.pyplot.scatter()` , for instance: the maximum and minimum values (e.g. `vmin=-2, vmax=5` ).
show `bool` | `None` (default: `None` )
Show the plot, do not return axis.
save `bool` | `str` | `None` (default: `None` )
If `True` or a `str` , save the figure. A string is appended to the default filename. Infer the filetype if ending on { `'.pdf'` , `'.png'` , `'.svg'` }. (deprecated in favour of `sc.pl.plot(show=False).figure.savefig()` ).
ax `Axes` | `None` (default: `None` )
A matplotlib axes object. Only works if plotting a single component.
Return type :
`Figure` | `Axes` | `list` [ `Axes` ] | `None`
Returns :
If `show==False` a `Axes` or a list of it.

```
import scanpy as sc
adata = sc.datasets.pbmc3k_processed()
sc.pl.pca(adata)
```

Colour points by discrete variable (Louvain clusters).

```
sc.pl.pca(adata, color="louvain")
```

Colour points by gene expression.

```
sc.pl.pca(adata, color="CST3")
```

See also

```
pp.pca
```

### scanpy.pl.pca_loadings

#### Contents

### scanpy.pl.pca_loadings #

scanpy.pl. pca_loadings ( adata , components = None , * , include_lowest = True , n_points = None , show = None , save = None ) [source] #
Rank genes according to contributions to PCs.
Examples
Parameters :

adata `AnnData`
Annotated data matrix.
components `str` | `Sequence` [ `int` ] | `None` (default: `None` )
For example, `'1,2,3'` means `[1, 2, 3]` , first, second, third principal component.
include_lowest `bool` (default: `True` )
Whether to show the variables with both highest and lowest loadings.
show `bool` | `None` (default: `None` )
Show the plot, do not return axis.
n_points `int` | `None` (default: `None` )
Number of variables to plot for each component.
save `str` | `bool` | `None` (default: `None` )
If `True` or a `str` , save the figure. A string is appended to the default filename. Infer the filetype if ending on { `'.pdf'` , `'.png'` , `'.svg'` }.

```
import scanpy as sc
adata = sc.datasets.pbmc3k_processed()
```

Show first 3 components loadings

```
sc.pl.pca_loadings(adata, components = '1,2,3')
```

### scanpy.pl.pca_overview

#### Contents

### scanpy.pl.pca_overview #

scanpy.pl. pca_overview ( adata , ** params ) [source] #
Plot PCA results.
The parameters are the ones of the scatter plot. Call pca_ranking separately if you want to change the default settings.

Parameters :

adata `AnnData`
Annotated data matrix.
color
Keys for observation/cell annotation either as list `["ann1", "ann2"]` or string `"ann1,ann2,..."` .
use_raw
Use `raw` attribute of `adata` if present.
sort_order
For continuous annotations used as color parameter, plot data points with higher values on top of others.
groups
Restrict to a few categories in categorical observation annotation. The default is not to restrict to any groups.
dimensions
0-indexed dimensions of the embedding to plot as integers. E.g. [(0, 1), (1, 2)]. Unlike `components` , this argument is used in the same way as `colors` , e.g. is used to specify a single plot at a time. Will eventually replace the components argument.
components
For instance, `['1,2', '2,3']` . To plot all available components use `components='all'` .
projection
Projection of plot (default: `'2d'` ).
legend_loc
Location of legend, either `'on data'` , `'right margin'` , `None` , or a valid keyword for the `loc` parameter of `Legend` .
legend_fontsize
Numeric size in pt or string describing the size. See `set_fontsize()` .
legend_fontweight
Legend font weight. A numeric value in range 0-1000 or a string. Defaults to `'bold'` if `legend_loc == 'on data'` , otherwise to `'normal'` . See `set_fontweight()` .
legend_fontoutline
Line width of the legend font outline in pt. Draws a white outline using the path effect `withStroke` .
size
Point size. If `None` , is automatically computed as 120000 / n_cells. Can be a sequence containing the size for each cell. The order should be the same as in adata.obs.
color_map
Color map to use for continous variables. Can be a name or a `Colormap` instance (e.g. `"magma` ”, `"viridis"` or `mpl.cm.cividis` ), see `get_cmap()` . If `None` , the value of `mpl.rcParams["image.cmap"]` is used. The default `color_map` can be set using `set_figure_params()` .
palette
Colors to use for plotting categorical annotation groups. The palette can be a valid `ListedColormap` name ( `'Set2'` , `'tab20'` , …), a `Cycler` object, a dict mapping categories to colors, or a sequence of colors. Colors must be valid to matplotlib. (see `is_color_like()` ). If `None` , `mpl.rcParams["axes.prop_cycle"]` is used unless the categorical variable already has colors stored in `adata.uns["{var}_colors"]` . If provided, values of `adata.uns["{var}_colors"]` will be set.
frameon
Draw a frame around the scatter plot. Defaults to value set in `set_figure_params()` , defaults to `True` .
title
Provide title for panels either as string or list of strings, e.g. `['title1', 'title2', ...]` .
colorbar_loc
Where to place the colorbar for continous variables. If `None` , no colorbar is added.
na_color
Color to use for null or masked values. Can be anything matplotlib accepts as a color. Used for all points if `color=None` .
na_in_legend
If there are missing values, whether they get an entry in the legend. Currently only implemented for categorical legends.
vmin
The value representing the lower limit of the color scale. Values smaller than vmin are plotted with the same color as vmin. vmin can be a number, a string, a function or `None` . If vmin is a string and has the format `pN` , this is interpreted as a vmin=percentile(N). For example vmin=’p1.5’ is interpreted as the 1.5 percentile. If vmin is function, then vmin is interpreted as the return value of the function over the list of values to plot. For example to set vmin tp the mean of the values to plot,

```
def my_vmin(values): returnnp.mean(values)
```

Examples

and then set `vmin=my_vmin` . If vmin is None (default) an automatic minimum value is used as defined by matplotlib `scatter` function. When making multiple plots, vmin can be a list of values, one for each plot. For example `vmin=[0.1, 'p1', None, my_vmin]`
vmax
The value representing the upper limit of the color scale. The format is the same as for `vmin` .
vcenter
The value representing the center of the color scale. Useful for diverging colormaps. The format is the same as for `vmin` . Example: `sc.pl.umap(adata, color='TREM2', vcenter='p50', cmap='RdBu_r')`
add_outline
If set to True, this will add a thin border around groups of dots. In some situations this can enhance the aesthetics of the resulting image
outline_color
Tuple with two valid color names used to adjust the add_outline. The first color is the border color (default: black), while the second color is a gap color between the border color and the scatter dot (default: white).
outline_width
Tuple with two width numbers used to adjust the outline. The first value is the width of the border color as a fraction of the scatter dot size (default: 0.3). The second value is width of the gap color (default: 0.05).
ncols
Number of panels per row.
wspace
Adjust the width of the space between multiple panels.
hspace
Adjust the height of the space between multiple panels.
return_fig
Return the matplotlib figure.
kwargs
Arguments to pass to `matplotlib.pyplot.scatter()` , for instance: the maximum and minimum values (e.g. `vmin=-2, vmax=5` ).
show
Show the plot, do not return axis.
save
If `True` or a `str` , save the figure. A string is appended to the default filename. Infer the filetype if ending on { `'.pdf'` , `'.png'` , `'.svg'` }.

```
import scanpy as sc
adata = sc.datasets.pbmc3k_processed()
sc.pl.pca_overview(adata, color="louvain")
```

See also

```
pp.pca
```

### scanpy.pl.pca_variance_ratio

#### Contents

### scanpy.pl.pca_variance_ratio #

scanpy.pl. pca_variance_ratio ( adata , n_pcs = 30 , * , log = False , show = None , save = None ) [source] #
Plot the variance ratio.
Examples
Plot the variance ratio for the first 30 PCs.
Parameters :

n_pcs `int` (default: `30` )
Number of PCs to show.
log `bool` (default: `False` )
Plot on logarithmic scale..
show `bool` | `None` (default: `None` )
Show the plot, do not return axis.
save `bool` | `str` | `None` (default: `None` )
If `True` or a `str` , save the figure. A string is appended to the default filename. Infer the filetype if ending on { `'.pdf'` , `'.png'` , `'.svg'` }.

```
import scanpy as sc
adata = sc.datasets.pbmc3k_processed()
sc.pl.pca_variance_ratio(adata)
```

Plot on a logarithmic scale.

```
sc.pl.pca_variance_ratio(adata, log=True)
```

### scanpy.pl.rank_genes_groups

#### Contents

### scanpy.pl.rank_genes_groups #

scanpy.pl. rank_genes_groups ( adata , groups = None , * , n_genes = 20 , gene_symbols = None , key = 'rank_genes_groups' , fontsize = 8 , ncols = 4 , sharey = True , show = None , ax = None , save = None , ** kwds ) [source] #
Plot ranking of genes.
Examples
Parameters :

adata `AnnData`
Annotated data matrix.
groups `str` | `Sequence` [ `str` ] | `None` (default: `None` )
The groups for which to show the gene ranking.
gene_symbols `str` | `None` (default: `None` )
Key for field in `.var` that stores gene symbols if you do not want to use `.var_names` .
n_genes `int` (default: `20` )
Number of genes to show.
fontsize `int` (default: `8` )
Fontsize for gene names.
ncols `int` (default: `4` )
Number of panels shown per row.
sharey `bool` (default: `True` )
Controls if the y-axis of each panels should be shared. But passing `sharey=False` , each panel has its own y-axis range.
show `bool` | `None` (default: `None` )
Show the plot, do not return axis.
save `bool` | `None` (default: `None` )
If `True` or a `str` , save the figure. A string is appended to the default filename. Infer the filetype if ending on { `'.pdf'` , `'.png'` , `'.svg'` }. (deprecated in favour of `sc.pl.plot(show=False).figure.savefig()` ).
ax `Axes` | `None` (default: `None` )
A matplotlib axes object. Only works if plotting a single component.
Return type :
`list` [ `Axes` ] | `None`
Returns :
List of each group’s matplotlib axis or `None` if `show=True` .

```
import scanpy as sc
adata = sc.datasets.pbmc68k_reduced()
sc.pl.rank_genes_groups(adata)
```

Plot top 10 genes (default 20 genes)

```
sc.pl.rank_genes_groups(adata, n_genes=10)
```

See also

```
tl.rank_genes_groups
```

### scanpy.pl.rank_genes_groups_dotplot

#### Contents

### scanpy.pl.rank_genes_groups_dotplot #

scanpy.pl. rank_genes_groups_dotplot ( adata , groups = None , * , n_genes = None , groupby = None , values_to_plot = None , var_names = None , gene_symbols = None , min_logfoldchange = None , key = None , show = None , return_fig = False , save = None , ** kwds ) [source] #
Plot ranking of genes using dotplot plot (see `dotplot()` ).
Examples
Parameters :

adata `AnnData`
Annotated data matrix.
groups `str` | `Sequence` [ `str` ] | `None` (default: `None` )
The groups for which to show the gene ranking.
n_genes `int` | `None` (default: `None` )
Number of genes to show. This can be a negative number to show for example the down regulated genes. eg: num_genes=-10. Is ignored if `gene_names` is passed.
gene_symbols `str` | `None` (default: `None` )
Column name in `.var` DataFrame that stores gene symbols. By default `var_names` refer to the index column of the `.var` DataFrame. Setting this option allows alternative names to be used.
groupby `str` | `None` (default: `None` )
The key of the observation grouping to consider. By default, the groupby is chosen from the rank genes groups parameter but other groupby options can be used. It is expected that groupby is a categorical. If groupby is not a categorical observation, it would be subdivided into `num_categories` (see `dotplot()` ).
min_logfoldchange `float` | `None` (default: `None` )
Value to filter genes in groups if their logfoldchange is less than the min_logfoldchange
key `str` | `None` (default: `None` )
Key used to store the ranking results in `adata.uns` .
values_to_plot `Literal` [ `'scores'` , `'logfoldchanges'` , `'pvals'` , `'pvals_adj'` , `'log10_pvals'` , `'log10_pvals_adj'` ] | `None` (default: `None` )
Instead of the mean gene value, plot the values computed by `sc.rank_genes_groups` . The options are: [‘scores’, ‘logfoldchanges’, ‘pvals’, ‘pvals_adj’, ‘log10_pvals’, ‘log10_pvals_adj’]. When plotting logfoldchanges a divergent colormap is recommended. See examples below.
var_names `Sequence` [ `str` ] | `Mapping` [ `str` , `Sequence` [ `str` ]] | `None` (default: `None` )
Genes to plot. Sometimes is useful to pass a specific list of var names (e.g. genes) to check their fold changes or p-values, instead of the top/bottom genes. The var_names could be a dictionary or a list as in `dotplot()` or `matrixplot()` . See examples below.
show `bool` | `None` (default: `None` )
Show the plot, do not return axis.
save `bool` | `None` (default: `None` )
If `True` or a `str` , save the figure. A string is appended to the default filename. Infer the filetype if ending on { `'.pdf'` , `'.png'` , `'.svg'` }. (deprecated in favour of `sc.pl.plot(show=False).figure.savefig()` ).
ax
A matplotlib axes object. Only works if plotting a single component.
return_fig `bool` (default: `False` )
Returns `DotPlot` object. Useful for fine-tuning the plot. Takes precedence over `show=False` .
**kwds
Are passed to `dotplot()` .
Returns :
If `return_fig` is `True` , returns a `DotPlot` object, else if `show` is false, return axes dict

```
import scanpy as sc
adata = sc.datasets.pbmc68k_reduced()
sc.tl.rank_genes_groups(adata, 'bulk_labels', n_genes=adata.raw.shape[1])
```

Plot top 2 genes per group.

```
sc.pl.rank_genes_groups_dotplot(adata,n_genes=2)
```

Plot with scaled expressions for easier identification of differences.

```
sc.pl.rank_genes_groups_dotplot(adata, n_genes=2, standard_scale='var')
```

Plot `logfoldchanges` instead of gene expression. In this case a diverging colormap like `bwr` or `seismic` works better. To center the colormap in zero, the minimum and maximum values to plot are set to -4 and 4 respectively. Also, only genes with a log fold change of 3 or more are shown.

```
sc.pl.rank_genes_groups_dotplot(
    adata,
    n_genes=4,
    values_to_plot="logfoldchanges", cmap='bwr',
    vmin=-4,
    vmax=4,
    min_logfoldchange=3,
    colorbar_title='log fold change'
)
```

Also, the last genes can be plotted. This can be useful to identify genes that are lowly expressed in a group. For this `n_genes=-4` is used

```
sc.pl.rank_genes_groups_dotplot(
    adata,
    n_genes=-4,
    values_to_plot="logfoldchanges",
    cmap='bwr',
    vmin=-4,
    vmax=4,
    min_logfoldchange=3,
    colorbar_title='log fold change',
)
```

A list specific genes can be given to check their log fold change. If a dictionary, the dictionary keys will be added as labels in the plot.

```
var_names = {'T-cell': ['CD3D', 'CD3E', 'IL32'],
              'B-cell': ['CD79A', 'CD79B', 'MS4A1'],
              'myeloid': ['CST3', 'LYZ'] }
sc.pl.rank_genes_groups_dotplot(
    adata,
    var_names=var_names,
    values_to_plot="logfoldchanges",
    cmap='bwr',
    vmin=-4,
    vmax=4,
    min_logfoldchange=3,
    colorbar_title='log fold change',
)
```

See also

```
tl.rank_genes_groups
```

### scanpy.pl.rank_genes_groups_heatmap

#### Contents

### scanpy.pl.rank_genes_groups_heatmap #

scanpy.pl. rank_genes_groups_heatmap ( adata , groups = None , * , n_genes = None , groupby = None , gene_symbols = None , var_names = None , min_logfoldchange = None , key = None , show = None , save = None , ** kwds ) [source] #
Plot ranking of genes using heatmap plot (see `heatmap()` ).
Examples
Parameters :

adata `AnnData`
Annotated data matrix.
groups `str` | `Sequence` [ `str` ] | `None` (default: `None` )
The groups for which to show the gene ranking.
n_genes `int` | `None` (default: `None` )
Number of genes to show. This can be a negative number to show for example the down regulated genes. eg: num_genes=-10. Is ignored if `gene_names` is passed.
gene_symbols `str` | `None` (default: `None` )
Column name in `.var` DataFrame that stores gene symbols. By default `var_names` refer to the index column of the `.var` DataFrame. Setting this option allows alternative names to be used.
groupby `str` | `None` (default: `None` )
The key of the observation grouping to consider. By default, the groupby is chosen from the rank genes groups parameter but other groupby options can be used. It is expected that groupby is a categorical. If groupby is not a categorical observation, it would be subdivided into `num_categories` (see `dotplot()` ).
min_logfoldchange `float` | `None` (default: `None` )
Value to filter genes in groups if their logfoldchange is less than the min_logfoldchange
key `str` | `None` (default: `None` )
Key used to store the ranking results in `adata.uns` .
show `bool` | `None` (default: `None` )
Show the plot, do not return axis.
save `bool` | `None` (default: `None` )
If `True` or a `str` , save the figure. A string is appended to the default filename. Infer the filetype if ending on { `'.pdf'` , `'.png'` , `'.svg'` }. (deprecated in favour of `sc.pl.plot(show=False).figure.savefig()` ).
ax
A matplotlib axes object. Only works if plotting a single component.
**kwds
Are passed to `heatmap()` .

```
import scanpy as sc
adata = sc.datasets.pbmc68k_reduced()
sc.tl.rank_genes_groups(adata, 'bulk_labels')
sc.pl.rank_genes_groups_heatmap(adata)
```

Show gene names per group on the heatmap

```
sc.pl.rank_genes_groups_heatmap(adata, show_gene_labels=True)
```

Plot top 5 genes per group (default 10 genes)

```
sc.pl.rank_genes_groups_heatmap(adata, n_genes=5, show_gene_labels=True)
```

See also
`tl.rank_genes_groups` , `tl.dendrogram`

### scanpy.pl.rank_genes_groups_matrixplot

#### Contents

### scanpy.pl.rank_genes_groups_matrixplot #

scanpy.pl. rank_genes_groups_matrixplot ( adata , groups = None , * , n_genes = None , groupby = None , values_to_plot = None , var_names = None , gene_symbols = None , min_logfoldchange = None , key = None , show = None , return_fig = False , save = None , ** kwds ) [source] #
Plot ranking of genes using matrixplot plot (see `matrixplot()` ).
Examples
Parameters :

adata `AnnData`
Annotated data matrix.
groups `str` | `Sequence` [ `str` ] | `None` (default: `None` )
The groups for which to show the gene ranking.
n_genes `int` | `None` (default: `None` )
Number of genes to show. This can be a negative number to show for example the down regulated genes. eg: num_genes=-10. Is ignored if `gene_names` is passed.
gene_symbols `str` | `None` (default: `None` )
Column name in `.var` DataFrame that stores gene symbols. By default `var_names` refer to the index column of the `.var` DataFrame. Setting this option allows alternative names to be used.
groupby `str` | `None` (default: `None` )
The key of the observation grouping to consider. By default, the groupby is chosen from the rank genes groups parameter but other groupby options can be used. It is expected that groupby is a categorical. If groupby is not a categorical observation, it would be subdivided into `num_categories` (see `dotplot()` ).
min_logfoldchange `float` | `None` (default: `None` )
Value to filter genes in groups if their logfoldchange is less than the min_logfoldchange
key `str` | `None` (default: `None` )
Key used to store the ranking results in `adata.uns` .
values_to_plot `Literal` [ `'scores'` , `'logfoldchanges'` , `'pvals'` , `'pvals_adj'` , `'log10_pvals'` , `'log10_pvals_adj'` ] | `None` (default: `None` )
Instead of the mean gene value, plot the values computed by `sc.rank_genes_groups` . The options are: [‘scores’, ‘logfoldchanges’, ‘pvals’, ‘pvals_adj’, ‘log10_pvals’, ‘log10_pvals_adj’]. When plotting logfoldchanges a divergent colormap is recommended. See examples below.
var_names `Sequence` [ `str` ] | `Mapping` [ `str` , `Sequence` [ `str` ]] | `None` (default: `None` )
Genes to plot. Sometimes is useful to pass a specific list of var names (e.g. genes) to check their fold changes or p-values, instead of the top/bottom genes. The var_names could be a dictionary or a list as in `dotplot()` or `matrixplot()` . See examples below.
show `bool` | `None` (default: `None` )
Show the plot, do not return axis.
save `bool` | `None` (default: `None` )
If `True` or a `str` , save the figure. A string is appended to the default filename. Infer the filetype if ending on { `'.pdf'` , `'.png'` , `'.svg'` }. (deprecated in favour of `sc.pl.plot(show=False).figure.savefig()` ).
ax
A matplotlib axes object. Only works if plotting a single component.
return_fig `bool` (default: `False` )
Returns `MatrixPlot` object. Useful for fine-tuning the plot. Takes precedence over `show=False` .
**kwds
Are passed to `matrixplot()` .
Returns :
If `return_fig` is `True` , returns a `MatrixPlot` object, else if `show` is false, return axes dict

```
import scanpy as sc
adata = sc.datasets.pbmc68k_reduced()
sc.tl.rank_genes_groups(adata, 'bulk_labels', n_genes=adata.raw.shape[1])
```

Plot `logfoldchanges` instead of gene expression. In this case a diverging colormap like `bwr` or `seismic` works better. To center the colormap in zero, the minimum and maximum values to plot are set to -4 and 4 respectively. Also, only genes with a log fold change of 3 or more are shown.

```
sc.pl.rank_genes_groups_matrixplot(
    adata,
    n_genes=4,
    values_to_plot="logfoldchanges",
    cmap='bwr',
    vmin=-4,
    vmax=4,
    min_logfoldchange=3,
    colorbar_title='log fold change',
)
```

Also, the last genes can be plotted. This can be useful to identify genes that are lowly expressed in a group. For this `n_genes=-4` is used

```
sc.pl.rank_genes_groups_matrixplot(
    adata,
    n_genes=-4,
    values_to_plot="logfoldchanges",
    cmap='bwr',
    vmin=-4,
    vmax=4,
    min_logfoldchange=3,
    colorbar_title='log fold change',
)
```

A list specific genes can be given to check their log fold change. If a dictionary, the dictionary keys will be added as labels in the plot.

```
var_names = {"T-cell": ['CD3D', 'CD3E', 'IL32'],
              'B-cell': ['CD79A', 'CD79B', 'MS4A1'],
              'myeloid': ['CST3', 'LYZ'] }
sc.pl.rank_genes_groups_matrixplot(
    adata,
    var_names=var_names,
    values_to_plot="logfoldchanges",
    cmap='bwr',
    vmin=-4,
    vmax=4,
    min_logfoldchange=3,
    colorbar_title='log fold change',
)
```

### scanpy.pl.rank_genes_groups_stacked_violin

#### Contents

### scanpy.pl.rank_genes_groups_stacked_violin #

scanpy.pl. rank_genes_groups_stacked_violin ( adata , groups = None , * , n_genes = None , groupby = None , gene_symbols = None , var_names = None , min_logfoldchange = None , key = None , show = None , return_fig = False , save = None , ** kwds ) [source] #
Plot ranking of genes using stacked_violin plot.
(See `stacked_violin()` )
Examples
Plot top marker genes per group as a stacked violin.
Parameters :

adata `AnnData`
Annotated data matrix.
groups `str` | `Sequence` [ `str` ] | `None` (default: `None` )
The groups for which to show the gene ranking.
n_genes `int` | `None` (default: `None` )
Number of genes to show. This can be a negative number to show for example the down regulated genes. eg: num_genes=-10. Is ignored if `gene_names` is passed.
gene_symbols `str` | `None` (default: `None` )
Column name in `.var` DataFrame that stores gene symbols. By default `var_names` refer to the index column of the `.var` DataFrame. Setting this option allows alternative names to be used.
groupby `str` | `None` (default: `None` )
The key of the observation grouping to consider. By default, the groupby is chosen from the rank genes groups parameter but other groupby options can be used. It is expected that groupby is a categorical. If groupby is not a categorical observation, it would be subdivided into `num_categories` (see `dotplot()` ).
min_logfoldchange `float` | `None` (default: `None` )
Value to filter genes in groups if their logfoldchange is less than the min_logfoldchange
key `str` | `None` (default: `None` )
Key used to store the ranking results in `adata.uns` .
show `bool` | `None` (default: `None` )
Show the plot, do not return axis.
save `bool` | `None` (default: `None` )
If `True` or a `str` , save the figure. A string is appended to the default filename. Infer the filetype if ending on { `'.pdf'` , `'.png'` , `'.svg'` }. (deprecated in favour of `sc.pl.plot(show=False).figure.savefig()` ).
ax
A matplotlib axes object. Only works if plotting a single component.
return_fig `bool` (default: `False` )
Returns `StackedViolin` object. Useful for fine-tuning the plot. Takes precedence over `show=False` .
**kwds
Are passed to `stacked_violin()` .
Returns :
If `return_fig` is `True` , returns a `StackedViolin` object, else if `show` is false, return axes dict

```
import scanpy as sc
adata = sc.datasets.pbmc68k_reduced()
sc.tl.rank_genes_groups(adata, "bulk_labels")
sc.pl.rank_genes_groups_stacked_violin(adata, n_genes=4, min_logfoldchange=4, figsize=(8, 6))
```

### scanpy.pl.rank_genes_groups_tracksplot

#### Contents

### scanpy.pl.rank_genes_groups_tracksplot #

scanpy.pl. rank_genes_groups_tracksplot ( adata , groups = None , * , n_genes = None , groupby = None , var_names = None , gene_symbols = None , min_logfoldchange = None , key = None , show = None , save = None , ** kwds ) [source] #
Plot ranking of genes using heatmap plot (see `heatmap()` ).
Examples
Parameters :

adata `AnnData`
Annotated data matrix.
groups `str` | `Sequence` [ `str` ] | `None` (default: `None` )
The groups for which to show the gene ranking.
n_genes `int` | `None` (default: `None` )
Number of genes to show. This can be a negative number to show for example the down regulated genes. eg: num_genes=-10. Is ignored if `gene_names` is passed.
gene_symbols `str` | `None` (default: `None` )
Column name in `.var` DataFrame that stores gene symbols. By default `var_names` refer to the index column of the `.var` DataFrame. Setting this option allows alternative names to be used.
groupby `str` | `None` (default: `None` )
The key of the observation grouping to consider. By default, the groupby is chosen from the rank genes groups parameter but other groupby options can be used. It is expected that groupby is a categorical. If groupby is not a categorical observation, it would be subdivided into `num_categories` (see `dotplot()` ).
min_logfoldchange `float` | `None` (default: `None` )
Value to filter genes in groups if their logfoldchange is less than the min_logfoldchange
key `str` | `None` (default: `None` )
Key used to store the ranking results in `adata.uns` .
show `bool` | `None` (default: `None` )
Show the plot, do not return axis.
save `bool` | `None` (default: `None` )
If `True` or a `str` , save the figure. A string is appended to the default filename. Infer the filetype if ending on { `'.pdf'` , `'.png'` , `'.svg'` }. (deprecated in favour of `sc.pl.plot(show=False).figure.savefig()` ).
ax
A matplotlib axes object. Only works if plotting a single component.
**kwds
Are passed to `tracksplot()` .

```
import scanpy as sc
adata = sc.datasets.pbmc68k_reduced()
sc.tl.rank_genes_groups(adata, 'bulk_labels')
sc.pl.rank_genes_groups_tracksplot(adata)
```

### scanpy.pl.rank_genes_groups_violin

#### Contents

### scanpy.pl.rank_genes_groups_violin #

scanpy.pl. rank_genes_groups_violin ( adata , groups = None , * , n_genes = 20 , gene_names = None , gene_symbols = None , use_raw = None , key = None , split = True , density_norm = 'width' , strip = True , jitter = True , size = 1 , ax = None , show = None , save = None , scale = _empty ) [source] #
Plot ranking of genes for all tested comparisons.
Examples
Plot violin distributions of top-ranked genes per group.
Parameters :

adata `AnnData`
Annotated data matrix.
groups `Sequence` [ `str` ] | `None` (default: `None` )
List of group names.
n_genes `int` (default: `20` )
Number of genes to show. Is ignored if `gene_names` is passed.
gene_names `Iterable` [ `str` ] | `None` (default: `None` )
List of genes to plot. Is only useful if interested in a custom gene list, which is not the result of `scanpy.tl.rank_genes_groups()` .
gene_symbols `str` | `None` (default: `None` )
Key for field in `.var` that stores gene symbols if you do not want to use `.var_names` displayed in the plot.
use_raw `bool` | `None` (default: `None` )
Use `raw` attribute of `adata` if present. Defaults to the value that was used in `rank_genes_groups()` .
split `bool` (default: `True` )
Whether to split the violins or not.
density_norm `Literal` [ `'area'` , `'count'` , `'width'` ] (default: `'width'` )
See `violinplot()` .
strip `bool` (default: `True` )
Show a strip plot on top of the violin plot.
jitter `float` | `bool` (default: `True` )
If set to 0, no points are drawn. See `stripplot()` .
size `int` (default: `1` )
Size of the jitter points.
show `bool` | `None` (default: `None` )
Show the plot, do not return axis.
save `bool` | `None` (default: `None` )
If `True` or a `str` , save the figure. A string is appended to the default filename. Infer the filetype if ending on { `'.pdf'` , `'.png'` , `'.svg'` }. (deprecated in favour of `sc.pl.plot(show=False).figure.savefig()` ).
ax `Axes` | `None` (default: `None` )
A matplotlib axes object. Only works if plotting a single component.

```
import scanpy as sc
adata = sc.datasets.pbmc68k_reduced()
sc.tl.rank_genes_groups(adata, "bulk_labels")
sc.pl.rank_genes_groups_violin(adata, groups=["CD34+"], n_genes=5)
```

### scanpy.pl.scrublet_score_distribution

#### Contents

### scanpy.pl.scrublet_score_distribution #

scanpy.pl. scrublet_score_distribution ( adata , * , scale_hist_obs = 'log' , scale_hist_sim = 'linear' , figsize = (8, 3) , return_fig = False , show = True , save = None ) [source] #
Plot histogram of doublet scores for observed transcriptomes and simulated doublets.
The histogram for simulated doublets is useful for determining the correct doublet score threshold.
Scrublet must have been run previously with the input object.
See also
Parameters :

adata `AnnData`
An AnnData object resulting from `scrublet()` .
scale_hist_obs `Literal` [ `'linear'` , `'log'` , `'symlog'` , `'logit'` ] | `str` (default: `'log'` )
Set y axis scale transformation in matplotlib for the plot of observed transcriptomes
scale_hist_sim `Literal` [ `'linear'` , `'log'` , `'symlog'` , `'logit'` ] | `str` (default: `'linear'` )
Set y axis scale transformation in matplotlib for the plot of simulated doublets
figsize `tuple` [ `float` | `int` , `float` | `int` ] (default: `(8, 3)` )
width, height
show `bool` (default: `True` )
Show the plot, do not return axis.
save `str` | `bool` | `None` (default: `None` )
If `True` or a `str` , save the figure. A string is appended to the default filename. Infer the filetype if ending on { `'.pdf'` , `'.png'` , `'.svg'` }.
Return type :
`Figure` | `Sequence` [ `tuple` [ `Axes` , `Axes` ]] | `tuple` [ `Axes` , `Axes` ] | `None`
Returns :
If `return_fig` is True, a `Figure` . If `show==False` a list of `Axes` .

```
scrublet()
```
Main way of running Scrublet, runs preprocessing, doublet simulation and calling.

```
scrublet_simulate_doublets()
```
Run Scrublet’s doublet simulation separately for advanced usage.

### scanpy.pl.sim

#### Contents

### scanpy.pl.sim #

scanpy.pl. sim ( adata , * , tmax_realization = None , as_heatmap = False , shuffle = False , show = None , marker = '.' , save = None ) [source] #
Plot results of simulation.

Parameters :

tmax_realization `int` | `None` (default: `None` )
Number of observations in one realization of the time series. The data matrix adata.X consists in concatenated realizations.
as_heatmap `bool` (default: `False` )
Plot the timeseries as heatmap.
shuffle `bool` (default: `False` )
Shuffle the data.
show `bool` | `None` (default: `None` )
Show the plot, do not return axis.
save `bool` | `str` | `None` (default: `None` )
If `True` or a `str` , save the figure. A string is appended to the default filename. Infer the filetype if ending on {{ `'.pdf'` , `'.png'` , `'.svg'` }}.
Return type :

```
None
```

### scanpy.pl.spatial

#### Contents

### scanpy.pl.spatial #

scanpy.pl. spatial ( adata , * , color = None , mask_obs = None , gene_symbols = None , use_raw = None , sort_order = True , edges = False , edges_width = 0.1 , edges_color = 'grey' , neighbors_key = None , arrows = False , arrows_kwds = None , groups = None , components = None , dimensions = None , layer = None , projection = '2d' , scale_factor = None , color_map = None , cmap = None , palette = None , na_color = None , na_in_legend = True , size = 1.0 , frameon = None , legend_fontsize = None , legend_fontweight = 'bold' , legend_loc = 'right margin' , legend_fontoutline = None , colorbar_loc = 'right' , vmax = None , vmin = None , vcenter = None , norm = None , add_outline = False , outline_width = (0.3, 0.05) , outline_color = ('black', 'white') , ncols = 4 , hspace = 0.25 , wspace = None , title = None , show = None , ax = None , return_fig = None , marker = '.' , save = None , basis = 'spatial' , img = None , img_key = _empty , library_id = _empty , crop_coord = None , alpha_img = 1.0 , bw = False , spot_size = None , ** kwargs ) [source] #
Scatter plot in spatial coordinates.
This function allows overlaying data on top of images. Use the parameter `img_key` to see the image in the background And the parameter `library_id` to select the image. By default, `'hires'` and `'lowres'` are attempted.
Use `crop_coord` , `alpha_img` , and `bw` to control how it is displayed. Use `size` to scale the size of the Visium spots plotted on top.
As this function is designed to for imaging data, there are two key assumptions about how coordinates are handled:
1. The origin (e.g `(0, 0)` ) is at the top left – as is common convention with image data.
2. Coordinates are in the pixel space of the source image, so an equal aspect ratio is assumed.
If your anndata object has a `"spatial"` entry in `.uns` , the `img_key` and `library_id` parameters to find values for `img` , `scale_factor` , and `spot_size` arguments. Alternatively, these values be passed directly.
Parameters :

adata `AnnData`
Annotated data matrix.
color `str` | `Sequence` [ `str` ] | `None` (default: `None` )
Keys for annotations of observations/cells or variables/genes, e.g., `'ann1'` or `['ann1', 'ann2']` .
gene_symbols `str` | `None` (default: `None` )
Column name in `.var` DataFrame that stores gene symbols. By default `var_names` refer to the index column of the `.var` DataFrame. Setting this option allows alternative names to be used.
use_raw `bool` | `None` (default: `None` )
Use `.raw` attribute of `adata` for coloring with gene expression. If `None` , defaults to `True` if `layer` isn’t provided and `adata.raw` is present.
layer `str` | `None` (default: `None` )
Name of the AnnData object layer that wants to be plotted. By default adata.raw.X is plotted. If `use_raw=False` is set, then `adata.X` is plotted. If `layer` is set to a valid layer name, then the layer is plotted. `layer` takes precedence over `use_raw` .
library_id `str` | `Empty` | `None` (default: `_empty` )
library_id for Visium data, e.g. key in `adata.uns["spatial"]` .
img_key `str` | `Empty` | `None` (default: `_empty` )
Key for image data, used to get `img` and `scale_factor` from `"images"` and `"scalefactors"` entires for this library. To use spatial coordinates, but not plot an image, pass `img_key=None` .
img `ndarray` | `None` (default: `None` )
image data to plot, overrides `img_key` .
scale_factor `float` | `None` (default: `None` )
Scaling factor used to map from coordinate space to pixel space. Found by default if `library_id` and `img_key` can be resolved. Otherwise defaults to `1.` .
spot_size `float` | `None` (default: `None` )
Diameter of spot (in coordinate space) for each point. Diameter in pixels of the spots will be `size * spot_size * scale_factor` . This argument is required if it cannot be resolved from library info.
crop_coord `tuple` [ `int` , `int` , `int` , `int` ] | `None` (default: `None` )
Coordinates to use for cropping the image (left, right, top, bottom). These coordinates are expected to be in pixel space (same as `basis` ) and will be transformed by `scale_factor` . If not provided, image is automatically cropped to bounds of `basis` , plus a border.
alpha_img `float` (default: `1.0` )
Alpha value for image.
bw `bool` | `None` (default: `False` )
Plot image data in gray scale.
sort_order `bool` (default: `True` )
For continuous annotations used as color parameter, plot data points with higher values on top of others.
groups `str` | `Sequence` [ `str` ] | `None` (default: `None` )
Restrict to a few categories in categorical observation annotation. The default is not to restrict to any groups.
dimensions `tuple` [ `int` , `int` ] | `Sequence` [ `tuple` [ `int` , `int` ]] | `None` (default: `None` )
0-indexed dimensions of the embedding to plot as integers. E.g. [(0, 1), (1, 2)]. Unlike `components` , this argument is used in the same way as `colors` , e.g. is used to specify a single plot at a time. Will eventually replace the components argument.
components `str` | `Sequence` [ `str` ] | `None` (default: `None` )
For instance, `['1,2', '2,3']` . To plot all available components use `components='all'` .
projection `Literal` [ `'2d'` , `'3d'` ] (default: `'2d'` )
Projection of plot (default: `'2d'` ).
legend_loc `Literal` [ `'none'` , `'right margin'` , `'on data'` , `'on data export'` , `'best'` , `'upper right'` , `'upper left'` , `'lower left'` , `'lower right'` , `'right'` , `'center left'` , `'center right'` , `'lower center'` , `'upper center'` , `'center'` ] | `None` (default: `'right margin'` )
Location of legend, either `'on data'` , `'right margin'` , `None` , or a valid keyword for the `loc` parameter of `Legend` .
legend_fontsize `float` | `Literal` [ `'xx-small'` , `'x-small'` , `'small'` , `'medium'` , `'large'` , `'x-large'` , `'xx-large'` ] | `None` (default: `None` )
Numeric size in pt or string describing the size. See `set_fontsize()` .
legend_fontweight `int` | `Literal` [ `'light'` , `'normal'` , `'medium'` , `'semibold'` , `'bold'` , `'heavy'` , `'black'` ] (default: `'bold'` )
Legend font weight. A numeric value in range 0-1000 or a string. Defaults to `'bold'` if `legend_loc == 'on data'` , otherwise to `'normal'` . See `set_fontweight()` .
legend_fontoutline `int` | `None` (default: `None` )
Line width of the legend font outline in pt. Draws a white outline using the path effect `withStroke` .
size `float` (default: `1.0` )
Point size. If `None` , is automatically computed as 120000 / n_cells. Can be a sequence containing the size for each cell. The order should be the same as in adata.obs.
color_map `Colormap` | `str` | `None` (default: `None` )
Color map to use for continous variables. Can be a name or a `Colormap` instance (e.g. `"magma` ”, `"viridis"` or `mpl.cm.cividis` ), see `get_cmap()` . If `None` , the value of `mpl.rcParams["image.cmap"]` is used. The default `color_map` can be set using `set_figure_params()` .
palette `str` | `Sequence` [ `str` ] | `Cycler` | `None` (default: `None` )
Colors to use for plotting categorical annotation groups. The palette can be a valid `ListedColormap` name ( `'Set2'` , `'tab20'` , …), a `Cycler` object, a dict mapping categories to colors, or a sequence of colors. Colors must be valid to matplotlib. (see `is_color_like()` ). If `None` , `mpl.rcParams["axes.prop_cycle"]` is used unless the categorical variable already has colors stored in `adata.uns["{var}_colors"]` . If provided, values of `adata.uns["{var}_colors"]` will be set.
frameon `bool` | `None` (default: `None` )
Draw a frame around the scatter plot. Defaults to value set in `set_figure_params()` , defaults to `True` .
title `str` | `Sequence` [ `str` ] | `None` (default: `None` )
Provide title for panels either as string or list of strings, e.g. `['title1', 'title2', ...]` .
colorbar_loc `Literal` [ `'right'` , `'left'` , `'top'` , `'bottom'` ] | `None` (default: `'right'` )
Where to place the colorbar for continous variables. If `None` , no colorbar is added.
na_color `str` | `tuple` [ `float` , `float` , `float` ] | `tuple` [ `float` , `float` , `float` , `float` ] | `None` (default: `None` )
Color to use for null or masked values. Can be anything matplotlib accepts as a color. Used for all points if `color=None` .
na_in_legend `bool` (default: `True` )
If there are missing values, whether they get an entry in the legend. Currently only implemented for categorical legends.
vmin `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ] | `Sequence` [ `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ]] | `None` (default: `None` )
The value representing the lower limit of the color scale. Values smaller than vmin are plotted with the same color as vmin. vmin can be a number, a string, a function or `None` . If vmin is a string and has the format `pN` , this is interpreted as a vmin=percentile(N). For example vmin=’p1.5’ is interpreted as the 1.5 percentile. If vmin is function, then vmin is interpreted as the return value of the function over the list of values to plot. For example to set vmin tp the mean of the values to plot,

```
def my_vmin(values): returnnp.mean(values)
```

Examples
This function behaves very similarly to other embedding plots like `umap()`

and then set `vmin=my_vmin` . If vmin is None (default) an automatic minimum value is used as defined by matplotlib `scatter` function. When making multiple plots, vmin can be a list of values, one for each plot. For example `vmin=[0.1, 'p1', None, my_vmin]`
vmax `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ] | `Sequence` [ `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ]] | `None` (default: `None` )
The value representing the upper limit of the color scale. The format is the same as for `vmin` .
vcenter `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ] | `Sequence` [ `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ]] | `None` (default: `None` )
The value representing the center of the color scale. Useful for diverging colormaps. The format is the same as for `vmin` . Example: `sc.pl.umap(adata, color='TREM2', vcenter='p50', cmap='RdBu_r')`
add_outline `bool` | `None` (default: `False` )
If set to True, this will add a thin border around groups of dots. In some situations this can enhance the aesthetics of the resulting image
outline_color `tuple` [ `str` , `str` ] (default: `('black', 'white')` )
Tuple with two valid color names used to adjust the add_outline. The first color is the border color (default: black), while the second color is a gap color between the border color and the scatter dot (default: white).
outline_width `tuple` [ `float` , `float` ] (default: `(0.3, 0.05)` )
Tuple with two width numbers used to adjust the outline. The first value is the width of the border color as a fraction of the scatter dot size (default: 0.3). The second value is width of the gap color (default: 0.05).
ncols `int` (default: `4` )
Number of panels per row.
wspace `float` | `None` (default: `None` )
Adjust the width of the space between multiple panels.
hspace `float` (default: `0.25` )
Adjust the height of the space between multiple panels.
return_fig `bool` | `None` (default: `None` )
Return the matplotlib figure.
kwargs
Arguments to pass to `matplotlib.pyplot.scatter()` , for instance: the maximum and minimum values (e.g. `vmin=-2, vmax=5` ).
show `bool` | `None` (default: `None` )
Show the plot, do not return axis.
save `bool` | `str` | `None` (default: `None` )
If `True` or a `str` , save the figure. A string is appended to the default filename. Infer the filetype if ending on { `'.pdf'` , `'.png'` , `'.svg'` }. (deprecated in favour of `sc.pl.plot(show=False).figure.savefig()` ).
ax `Axes` | `None` (default: `None` )
A matplotlib axes object. Only works if plotting a single component.
Return type :
`Figure` | `Axes` | `list` [ `Axes` ] | `None`
Returns :
If `show==False` a `Axes` or a list of it.

```
>>> import scanpy as sc
>>> adata = sc.datasets.visium_sge("Targeted_Visium_Human_Glioblastoma_Pan_Cancer")
FutureWarning: The function visium_sge is deprecated and will be removed in the future. Use :func:`squidpy.datasets.visium` instead.
    adata = sc.datasets.visium_sge("Targeted_Visium_Human_Glioblastoma_Pan_Cancer")
>>> sc.pp.calculate_qc_metrics(adata, inplace=True)
>>> sc.pl.spatial(adata, color="log1p_n_genes_by_counts")
FutureWarning: The function spatial is deprecated and will be removed in the future. Use :func:`squidpy.pl.spatial_scatter` instead.
    sc.pl.spatial(adata, color="log1p_n_genes_by_counts")
```

See also

```
scanpy.datasets.visium_sge()
```
Example visium data.

### scanpy.pl.tsne

#### Contents

### scanpy.pl.tsne #

scanpy.pl. tsne ( adata , * , color = None , mask_obs = None , gene_symbols = None , use_raw = None , sort_order = True , edges = False , edges_width = 0.1 , edges_color = 'grey' , neighbors_key = None , arrows = False , arrows_kwds = None , groups = None , components = None , dimensions = None , layer = None , projection = '2d' , scale_factor = None , color_map = None , cmap = None , palette = None , na_color = 'lightgray' , na_in_legend = True , size = None , frameon = None , legend_fontsize = None , legend_fontweight = 'bold' , legend_loc = 'right margin' , legend_fontoutline = None , colorbar_loc = 'right' , vmax = None , vmin = None , vcenter = None , norm = None , add_outline = False , outline_width = (0.3, 0.05) , outline_color = ('black', 'white') , ncols = 4 , hspace = 0.25 , wspace = None , title = None , show = None , ax = None , return_fig = None , marker = '.' , save = None , ** kwargs ) [source] #
Scatter plot in tSNE basis.

Parameters :

adata `AnnData`
Annotated data matrix.
color `str` | `Sequence` [ `str` ] | `None` (default: `None` )
Keys for annotations of observations/cells or variables/genes, e.g., `'ann1'` or `['ann1', 'ann2']` .
gene_symbols `str` | `None` (default: `None` )
Column name in `.var` DataFrame that stores gene symbols. By default `var_names` refer to the index column of the `.var` DataFrame. Setting this option allows alternative names to be used.
use_raw `bool` | `None` (default: `None` )
Use `.raw` attribute of `adata` for coloring with gene expression. If `None` , defaults to `True` if `layer` isn’t provided and `adata.raw` is present.
layer `str` | `None` (default: `None` )
Name of the AnnData object layer that wants to be plotted. By default adata.raw.X is plotted. If `use_raw=False` is set, then `adata.X` is plotted. If `layer` is set to a valid layer name, then the layer is plotted. `layer` takes precedence over `use_raw` .
edges `bool` (default: `False` )
Show edges.
edges_width `float` (default: `0.1` )
Width of edges.
edges_color `str` | `Sequence` [ `float` ] | `Sequence` [ `str` ] (default: `'grey'` )
Color of edges. See `draw_networkx_edges()` .
neighbors_key `str` | `None` (default: `None` )
Where to look for neighbors connectivities. If not specified, this retrieves `.obsp['connectivities']` for connectivities (default storage place for `neighbors()` ). If specified, this retrieves `.obsp[.uns[neighbors_key]['connectivities_key']]` for connectivities.
arrows `bool` (default: `False` )
Show arrows (deprecated in favour of `scvelo.pl.velocity_embedding` ).
arrows_kwds `Mapping` [ `str` , `Any` ] | `None` (default: `None` )
Passed to `quiver()`
sort_order `bool` (default: `True` )
For continuous annotations used as color parameter, plot data points with higher values on top of others.
groups `str` | `Sequence` [ `str` ] | `None` (default: `None` )
Restrict to a few categories in categorical observation annotation. The default is not to restrict to any groups.
dimensions `tuple` [ `int` , `int` ] | `Sequence` [ `tuple` [ `int` , `int` ]] | `None` (default: `None` )
0-indexed dimensions of the embedding to plot as integers. E.g. [(0, 1), (1, 2)]. Unlike `components` , this argument is used in the same way as `colors` , e.g. is used to specify a single plot at a time. Will eventually replace the components argument.
components `str` | `Sequence` [ `str` ] | `None` (default: `None` )
For instance, `['1,2', '2,3']` . To plot all available components use `components='all'` .
projection `Literal` [ `'2d'` , `'3d'` ] (default: `'2d'` )
Projection of plot (default: `'2d'` ).
legend_loc `Literal` [ `'none'` , `'right margin'` , `'on data'` , `'on data export'` , `'best'` , `'upper right'` , `'upper left'` , `'lower left'` , `'lower right'` , `'right'` , `'center left'` , `'center right'` , `'lower center'` , `'upper center'` , `'center'` ] | `None` (default: `'right margin'` )
Location of legend, either `'on data'` , `'right margin'` , `None` , or a valid keyword for the `loc` parameter of `Legend` .
legend_fontsize `float` | `Literal` [ `'xx-small'` , `'x-small'` , `'small'` , `'medium'` , `'large'` , `'x-large'` , `'xx-large'` ] | `None` (default: `None` )
Numeric size in pt or string describing the size. See `set_fontsize()` .
legend_fontweight `int` | `Literal` [ `'light'` , `'normal'` , `'medium'` , `'semibold'` , `'bold'` , `'heavy'` , `'black'` ] (default: `'bold'` )
Legend font weight. A numeric value in range 0-1000 or a string. Defaults to `'bold'` if `legend_loc == 'on data'` , otherwise to `'normal'` . See `set_fontweight()` .
legend_fontoutline `int` | `None` (default: `None` )
Line width of the legend font outline in pt. Draws a white outline using the path effect `withStroke` .
size `float` | `Sequence` [ `float` ] | `None` (default: `None` )
Point size. If `None` , is automatically computed as 120000 / n_cells. Can be a sequence containing the size for each cell. The order should be the same as in adata.obs.
color_map `Colormap` | `str` | `None` (default: `None` )
Color map to use for continous variables. Can be a name or a `Colormap` instance (e.g. `"magma` ”, `"viridis"` or `mpl.cm.cividis` ), see `get_cmap()` . If `None` , the value of `mpl.rcParams["image.cmap"]` is used. The default `color_map` can be set using `set_figure_params()` .
palette `str` | `Sequence` [ `str` ] | `Cycler` | `None` (default: `None` )
Colors to use for plotting categorical annotation groups. The palette can be a valid `ListedColormap` name ( `'Set2'` , `'tab20'` , …), a `Cycler` object, a dict mapping categories to colors, or a sequence of colors. Colors must be valid to matplotlib. (see `is_color_like()` ). If `None` , `mpl.rcParams["axes.prop_cycle"]` is used unless the categorical variable already has colors stored in `adata.uns["{var}_colors"]` . If provided, values of `adata.uns["{var}_colors"]` will be set.
frameon `bool` | `None` (default: `None` )
Draw a frame around the scatter plot. Defaults to value set in `set_figure_params()` , defaults to `True` .
title `str` | `Sequence` [ `str` ] | `None` (default: `None` )
Provide title for panels either as string or list of strings, e.g. `['title1', 'title2', ...]` .
colorbar_loc `Literal` [ `'right'` , `'left'` , `'top'` , `'bottom'` ] | `None` (default: `'right'` )
Where to place the colorbar for continous variables. If `None` , no colorbar is added.
na_color `str` | `tuple` [ `float` , `float` , `float` ] | `tuple` [ `float` , `float` , `float` , `float` ] (default: `'lightgray'` )
Color to use for null or masked values. Can be anything matplotlib accepts as a color. Used for all points if `color=None` .
na_in_legend `bool` (default: `True` )
If there are missing values, whether they get an entry in the legend. Currently only implemented for categorical legends.
vmin `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ] | `Sequence` [ `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ]] | `None` (default: `None` )
The value representing the lower limit of the color scale. Values smaller than vmin are plotted with the same color as vmin. vmin can be a number, a string, a function or `None` . If vmin is a string and has the format `pN` , this is interpreted as a vmin=percentile(N). For example vmin=’p1.5’ is interpreted as the 1.5 percentile. If vmin is function, then vmin is interpreted as the return value of the function over the list of values to plot. For example to set vmin tp the mean of the values to plot,

```
def my_vmin(values): returnnp.mean(values)
```

Examples

and then set `vmin=my_vmin` . If vmin is None (default) an automatic minimum value is used as defined by matplotlib `scatter` function. When making multiple plots, vmin can be a list of values, one for each plot. For example `vmin=[0.1, 'p1', None, my_vmin]`
vmax `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ] | `Sequence` [ `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ]] | `None` (default: `None` )
The value representing the upper limit of the color scale. The format is the same as for `vmin` .
vcenter `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ] | `Sequence` [ `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ]] | `None` (default: `None` )
The value representing the center of the color scale. Useful for diverging colormaps. The format is the same as for `vmin` . Example: `sc.pl.umap(adata, color='TREM2', vcenter='p50', cmap='RdBu_r')`
add_outline `bool` | `None` (default: `False` )
If set to True, this will add a thin border around groups of dots. In some situations this can enhance the aesthetics of the resulting image
outline_color `tuple` [ `str` , `str` ] (default: `('black', 'white')` )
Tuple with two valid color names used to adjust the add_outline. The first color is the border color (default: black), while the second color is a gap color between the border color and the scatter dot (default: white).
outline_width `tuple` [ `float` , `float` ] (default: `(0.3, 0.05)` )
Tuple with two width numbers used to adjust the outline. The first value is the width of the border color as a fraction of the scatter dot size (default: 0.3). The second value is width of the gap color (default: 0.05).
ncols `int` (default: `4` )
Number of panels per row.
wspace `float` | `None` (default: `None` )
Adjust the width of the space between multiple panels.
hspace `float` (default: `0.25` )
Adjust the height of the space between multiple panels.
return_fig `bool` | `None` (default: `None` )
Return the matplotlib figure.
kwargs
Arguments to pass to `matplotlib.pyplot.scatter()` , for instance: the maximum and minimum values (e.g. `vmin=-2, vmax=5` ).
show `bool` | `None` (default: `None` )
Show the plot, do not return axis.
save `bool` | `str` | `None` (default: `None` )
If `True` or a `str` , save the figure. A string is appended to the default filename. Infer the filetype if ending on { `'.pdf'` , `'.png'` , `'.svg'` }. (deprecated in favour of `sc.pl.plot(show=False).figure.savefig()` ).
ax `Axes` | `None` (default: `None` )
A matplotlib axes object. Only works if plotting a single component.
Return type :
`Figure` | `Axes` | `list` [ `Axes` ] | `None`
Returns :
If `show==False` a `Axes` or a list of it.

```
import scanpy as sc
adata = sc.datasets.pbmc68k_reduced()
sc.tl.tsne(adata)
sc.pl.tsne(adata, color='bulk_labels')
```

### scanpy.pl.umap

#### Contents

### scanpy.pl.umap #

scanpy.pl. umap ( adata , * , color = None , mask_obs = None , gene_symbols = None , use_raw = None , sort_order = True , edges = False , edges_width = 0.1 , edges_color = 'grey' , neighbors_key = None , arrows = False , arrows_kwds = None , groups = None , components = None , dimensions = None , layer = None , projection = '2d' , scale_factor = None , color_map = None , cmap = None , palette = None , na_color = 'lightgray' , na_in_legend = True , size = None , frameon = None , legend_fontsize = None , legend_fontweight = 'bold' , legend_loc = 'right margin' , legend_fontoutline = None , colorbar_loc = 'right' , vmax = None , vmin = None , vcenter = None , norm = None , add_outline = False , outline_width = (0.3, 0.05) , outline_color = ('black', 'white') , ncols = 4 , hspace = 0.25 , wspace = None , title = None , show = None , ax = None , return_fig = None , marker = '.' , save = None , ** kwargs ) [source] #
Scatter plot in UMAP basis.

Parameters :

adata `AnnData`
Annotated data matrix.
color `str` | `Sequence` [ `str` ] | `None` (default: `None` )
Keys for annotations of observations/cells or variables/genes, e.g., `'ann1'` or `['ann1', 'ann2']` .
gene_symbols `str` | `None` (default: `None` )
Column name in `.var` DataFrame that stores gene symbols. By default `var_names` refer to the index column of the `.var` DataFrame. Setting this option allows alternative names to be used.
use_raw `bool` | `None` (default: `None` )
Use `.raw` attribute of `adata` for coloring with gene expression. If `None` , defaults to `True` if `layer` isn’t provided and `adata.raw` is present.
layer `str` | `None` (default: `None` )
Name of the AnnData object layer that wants to be plotted. By default adata.raw.X is plotted. If `use_raw=False` is set, then `adata.X` is plotted. If `layer` is set to a valid layer name, then the layer is plotted. `layer` takes precedence over `use_raw` .
edges `bool` (default: `False` )
Show edges.
edges_width `float` (default: `0.1` )
Width of edges.
edges_color `str` | `Sequence` [ `float` ] | `Sequence` [ `str` ] (default: `'grey'` )
Color of edges. See `draw_networkx_edges()` .
neighbors_key `str` | `None` (default: `None` )
Where to look for neighbors connectivities. If not specified, this retrieves `.obsp['connectivities']` for connectivities (default storage place for `neighbors()` ). If specified, this retrieves `.obsp[.uns[neighbors_key]['connectivities_key']]` for connectivities.
arrows `bool` (default: `False` )
Show arrows (deprecated in favour of `scvelo.pl.velocity_embedding` ).
arrows_kwds `Mapping` [ `str` , `Any` ] | `None` (default: `None` )
Passed to `quiver()`
sort_order `bool` (default: `True` )
For continuous annotations used as color parameter, plot data points with higher values on top of others.
groups `str` | `Sequence` [ `str` ] | `None` (default: `None` )
Restrict to a few categories in categorical observation annotation. The default is not to restrict to any groups.
dimensions `tuple` [ `int` , `int` ] | `Sequence` [ `tuple` [ `int` , `int` ]] | `None` (default: `None` )
0-indexed dimensions of the embedding to plot as integers. E.g. [(0, 1), (1, 2)]. Unlike `components` , this argument is used in the same way as `colors` , e.g. is used to specify a single plot at a time. Will eventually replace the components argument.
components `str` | `Sequence` [ `str` ] | `None` (default: `None` )
For instance, `['1,2', '2,3']` . To plot all available components use `components='all'` .
projection `Literal` [ `'2d'` , `'3d'` ] (default: `'2d'` )
Projection of plot (default: `'2d'` ).
legend_loc `Literal` [ `'none'` , `'right margin'` , `'on data'` , `'on data export'` , `'best'` , `'upper right'` , `'upper left'` , `'lower left'` , `'lower right'` , `'right'` , `'center left'` , `'center right'` , `'lower center'` , `'upper center'` , `'center'` ] | `None` (default: `'right margin'` )
Location of legend, either `'on data'` , `'right margin'` , `None` , or a valid keyword for the `loc` parameter of `Legend` .
legend_fontsize `float` | `Literal` [ `'xx-small'` , `'x-small'` , `'small'` , `'medium'` , `'large'` , `'x-large'` , `'xx-large'` ] | `None` (default: `None` )
Numeric size in pt or string describing the size. See `set_fontsize()` .
legend_fontweight `int` | `Literal` [ `'light'` , `'normal'` , `'medium'` , `'semibold'` , `'bold'` , `'heavy'` , `'black'` ] (default: `'bold'` )
Legend font weight. A numeric value in range 0-1000 or a string. Defaults to `'bold'` if `legend_loc == 'on data'` , otherwise to `'normal'` . See `set_fontweight()` .
legend_fontoutline `int` | `None` (default: `None` )
Line width of the legend font outline in pt. Draws a white outline using the path effect `withStroke` .
size `float` | `Sequence` [ `float` ] | `None` (default: `None` )
Point size. If `None` , is automatically computed as 120000 / n_cells. Can be a sequence containing the size for each cell. The order should be the same as in adata.obs.
color_map `Colormap` | `str` | `None` (default: `None` )
Color map to use for continous variables. Can be a name or a `Colormap` instance (e.g. `"magma` ”, `"viridis"` or `mpl.cm.cividis` ), see `get_cmap()` . If `None` , the value of `mpl.rcParams["image.cmap"]` is used. The default `color_map` can be set using `set_figure_params()` .
palette `str` | `Sequence` [ `str` ] | `Cycler` | `None` (default: `None` )
Colors to use for plotting categorical annotation groups. The palette can be a valid `ListedColormap` name ( `'Set2'` , `'tab20'` , …), a `Cycler` object, a dict mapping categories to colors, or a sequence of colors. Colors must be valid to matplotlib. (see `is_color_like()` ). If `None` , `mpl.rcParams["axes.prop_cycle"]` is used unless the categorical variable already has colors stored in `adata.uns["{var}_colors"]` . If provided, values of `adata.uns["{var}_colors"]` will be set.
frameon `bool` | `None` (default: `None` )
Draw a frame around the scatter plot. Defaults to value set in `set_figure_params()` , defaults to `True` .
title `str` | `Sequence` [ `str` ] | `None` (default: `None` )
Provide title for panels either as string or list of strings, e.g. `['title1', 'title2', ...]` .
colorbar_loc `Literal` [ `'right'` , `'left'` , `'top'` , `'bottom'` ] | `None` (default: `'right'` )
Where to place the colorbar for continous variables. If `None` , no colorbar is added.
na_color `str` | `tuple` [ `float` , `float` , `float` ] | `tuple` [ `float` , `float` , `float` , `float` ] (default: `'lightgray'` )
Color to use for null or masked values. Can be anything matplotlib accepts as a color. Used for all points if `color=None` .
na_in_legend `bool` (default: `True` )
If there are missing values, whether they get an entry in the legend. Currently only implemented for categorical legends.
vmin `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ] | `Sequence` [ `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ]] | `None` (default: `None` )
The value representing the lower limit of the color scale. Values smaller than vmin are plotted with the same color as vmin. vmin can be a number, a string, a function or `None` . If vmin is a string and has the format `pN` , this is interpreted as a vmin=percentile(N). For example vmin=’p1.5’ is interpreted as the 1.5 percentile. If vmin is function, then vmin is interpreted as the return value of the function over the list of values to plot. For example to set vmin tp the mean of the values to plot,

```
def my_vmin(values): returnnp.mean(values)
```

Examples

and then set `vmin=my_vmin` . If vmin is None (default) an automatic minimum value is used as defined by matplotlib `scatter` function. When making multiple plots, vmin can be a list of values, one for each plot. For example `vmin=[0.1, 'p1', None, my_vmin]`
vmax `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ] | `Sequence` [ `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ]] | `None` (default: `None` )
The value representing the upper limit of the color scale. The format is the same as for `vmin` .
vcenter `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ] | `Sequence` [ `str` | `float` | `Callable` [[ `Sequence` [ `float` ]], `float` ]] | `None` (default: `None` )
The value representing the center of the color scale. Useful for diverging colormaps. The format is the same as for `vmin` . Example: `sc.pl.umap(adata, color='TREM2', vcenter='p50', cmap='RdBu_r')`
add_outline `bool` | `None` (default: `False` )
If set to True, this will add a thin border around groups of dots. In some situations this can enhance the aesthetics of the resulting image
outline_color `tuple` [ `str` , `str` ] (default: `('black', 'white')` )
Tuple with two valid color names used to adjust the add_outline. The first color is the border color (default: black), while the second color is a gap color between the border color and the scatter dot (default: white).
outline_width `tuple` [ `float` , `float` ] (default: `(0.3, 0.05)` )
Tuple with two width numbers used to adjust the outline. The first value is the width of the border color as a fraction of the scatter dot size (default: 0.3). The second value is width of the gap color (default: 0.05).
ncols `int` (default: `4` )
Number of panels per row.
wspace `float` | `None` (default: `None` )
Adjust the width of the space between multiple panels.
hspace `float` (default: `0.25` )
Adjust the height of the space between multiple panels.
return_fig `bool` | `None` (default: `None` )
Return the matplotlib figure.
kwargs
Arguments to pass to `matplotlib.pyplot.scatter()` , for instance: the maximum and minimum values (e.g. `vmin=-2, vmax=5` ).
show `bool` | `None` (default: `None` )
Show the plot, do not return axis.
save `bool` | `str` | `None` (default: `None` )
If `True` or a `str` , save the figure. A string is appended to the default filename. Infer the filetype if ending on { `'.pdf'` , `'.png'` , `'.svg'` }. (deprecated in favour of `sc.pl.plot(show=False).figure.savefig()` ).
ax `Axes` | `None` (default: `None` )
A matplotlib axes object. Only works if plotting a single component.
Return type :
`Figure` | `Axes` | `list` [ `Axes` ] | `None`
Returns :
If `show==False` a `Axes` or a list of it.

```
import scanpy as sc
adata = sc.datasets.pbmc68k_reduced()
sc.pl.umap(adata)
```

Colour points by discrete variable (Louvain clusters).

```
sc.pl.umap(adata, color="louvain")
```

Colour points by gene expression.

```
sc.pl.umap(adata, color="HES4")
```

Plot muliple umaps for different gene expressions.

```
sc.pl.umap(adata, color=["HES4", "TNFRSF4"])
```

See also

```
tl.umap
```

### scanpy.pp.combat

#### Contents

### scanpy.pp.combat #

scanpy.pp. combat ( adata , key = 'batch' , * , covariates = None , inplace = True ) [source] #
ComBat function for batch effect correction [ Johnson et al. , 2006 , Leek et al. , 2017 , Pedersen, 2012 ] .
Corrects for batch effects by fitting linear models, gains statistical power via an EB framework where information is borrowed across genes. This uses the implementation combat.py [ Pedersen, 2012 ] .

| Array type | supported | … experimentally in dask `Array` |
|---|---|---|
|  |  |  |

```
numpy.ndarray
```

|  | ✅ | ❌ |
|---|---|---|
|  |  |  |

```
scipy.sparse.{csr,csc}_{array,matrix}
```

|  | ❌ | ❌ |
|---|---|---|
Parameters :

adata `AnnData`
Annotated data matrix
key `str` (default: `'batch'` )
Key to a categorical annotation from `obs` that will be used for batch effect removal.
covariates `Collection` [ `str` ] | `None` (default: `None` )
Additional covariates besides the batch variable such as adjustment variables or biological condition. This parameter refers to the design matrix `X` in Equation 2.1 in Johnson et al. [ 2006 ] and to the `mod` argument in the original combat function in the sva R package. Note that not including covariates may introduce bias or lead to the removal of biological signal in unbalanced designs.
inplace `bool` (default: `True` )
Whether to replace adata.X or to return the corrected data
Return type :
`ndarray` | `None`
Returns :
Returns `numpy.ndarray` if `inplace=False` , else returns `None` and sets the following field in the `adata` object:
`adata.X` `numpy.ndarray` (dtype `float` )
Corrected data matrix.

### scanpy.pp.neighbors

#### Contents

### scanpy.pp.neighbors #

scanpy.pp. neighbors ( adata , n_neighbors = 15 , n_pcs = None , * , distances = None , use_rep = None , knn = True , method = 'umap' , transformer = None , metric = None , metric_kwds = mappingproxy({}) , random_state = 0 , key_added = None , copy = False ) [source] #
Compute the nearest neighbors distance matrix and a neighborhood graph of observations [ McInnes et al. , 2018 ] .
The computation proceeds in two independent stages. First, a k-nearest neighbor (kNN) search produces the distance matrix via the estimator passed as `transformer` . Second, connectivities are derived from the kNN search output by the kernel selected via `method` . The two stages are controlled by independent parameters: `transformer` selects the kNN search backend, `method` selects the connectivity kernel.

| Array type | supported | … experimentally in dask `Array` |
|---|---|---|
|  |  |  |

```
numpy.ndarray
```

|  | ✅ | ❌ |
|---|---|---|
|  |  |  |

```
scipy.sparse.{csr,csc}_{array,matrix}
```

|  | ✅ | ❌ |
|---|---|---|
Parameters :

adata `AnnData`
Annotated data matrix.
n_neighbors `int` (default: `15` )
The size of local neighborhood (in terms of number of neighboring data points) used for manifold approximation. Larger values result in more global views of the manifold, while smaller values result in more local data being preserved. In general values should be in the range 2 to 100. If `knn` is `True` , number of nearest neighbors to be searched. If `knn` is `False` , a Gaussian kernel width is set to the distance of the `n_neighbors` neighbor.
ignored if ``transformer`` is an instance.
n_pcs `int` | `None` (default: `None` )
Use this many PCs. If `n_pcs==0` use `.X` if `use_rep is None` .
use_rep `str` | `None` (default: `None` )
Use the indicated representation. `'X'` or any key for `.obsm` is valid. If `None` , the representation is chosen automatically: For `.n_vars` < `N_PCS` (default: 50), `.X` is used, otherwise ‘X_pca’ is used. If ‘X_pca’ is not present, it’s computed with default parameters or `n_pcs` if present.
knn `bool` (default: `True` )
If `True` , use a hard threshold to restrict the number of neighbors to `n_neighbors` , that is, consider a knn graph. Otherwise, use a Gaussian Kernel to assign low weights to neighbors more distant than the `n_neighbors` nearest neighbor.
method `Literal` [ `'umap'` , `'gauss'` , `'jaccard'` ] (default: `'umap'` )
Kernel that derives connectivities from the kNN search output. The choice is independent of the kNN search backend, which is controlled by `transformer` . Use ‘umap’ [ McInnes et al. , 2018 ] , ‘gauss’ (Gauss kernel following Coifman et al. [ 2005 ] with adaptive width Haghverdi et al. [ 2016 ] ), or ‘jaccard’ (Jaccard kernel as in PhenoGraph, Levine et al. [ 2015 ] ).
transformer `KnnTransformerLike` | `Literal` [ `'pynndescent'` , `'sklearn'` , `'rapids'` ] | `None` (default: `None` )
kNN search backend following the API of `KNeighborsTransformer` . See Using other kNN libraries in Scanpy for more details. Also accepts the following known options:
`None` (the default)
Behavior depends on data size. For small data, we will calculate exact kNN, otherwise we use `PyNNDescentTransformer`

```
'pynndescent'
```

```
PyNNDescentTransformer
```

```
'rapids'
```


A transformer based on `cuml.neighbors.NearestNeighbors` .
Deprecated since version 1.10.0: Use `rapids_singlecell.pp.neighbors()` instead.
metric `Literal` [ `'cityblock'` , `'cosine'` , `'euclidean'` , `'l1'` , `'l2'` , `'manhattan'` ] | `Literal` [ `'braycurtis'` , `'canberra'` , `'chebyshev'` , `'correlation'` , `'dice'` , `'hamming'` , `'jaccard'` , `'kulsinski'` , `'mahalanobis'` , `'minkowski'` , `'rogerstanimoto'` , `'russellrao'` , `'seuclidean'` , `'sokalmichener'` , `'sokalsneath'` , `'sqeuclidean'` , `'yule'` ] | `Callable` [[ `ndarray` , `ndarray` ], `float` ] | `None` (default: `None` )
A known metric’s name or a callable that returns a distance. If `distances` is given, this parameter is simply stored in `.uns` (see below), otherwise defaults to `'euclidean'` .
ignored if ``transformer`` is an instance.
metric_kwds `Mapping` [ `str` , `Any` ] (default: `mappingproxy({})` )
Options for the metric.
ignored if ``transformer`` is an instance.
random_state `int` | `RandomState` | `None` (default: `0` )
A numpy random seed.
ignored if ``transformer`` is an instance.
key_added `str` | `None` (default: `None` )
If not specified, the neighbors data is stored in `.uns['neighbors']` , distances and connectivities are stored in `.obsp['distances']` and `.obsp['connectivities']` respectively. If specified, the neighbors data is added to .uns[key_added], distances are stored in `.obsp[f'{key_added}_distances']` and connectivities in `.obsp[f'{key_added}_connectivities']` .
copy `bool` (default: `False` )
Return a copy instead of writing to adata.
Return type :
`AnnData` | `None`
Returns :
Returns `None` if `copy=False` , else returns an `AnnData` object. Sets the following fields:
`adata.obsp['distances' | f'{key_added}_distances']` `scipy.sparse.csr_matrix` (dtype `float` )
Distance matrix of the nearest neighbors search. Each row (cell) has `n_neighbors` -1 non-zero entries. These are the distances to their `n_neighbors` -1 nearest neighbors (excluding the cell itself).
`adata.obsp['connectivities' | f'{key_added}_connectivities']` `scipy.sparse._csr.csr_matrix` (dtype `float` )
Weighted adjacency matrix of the neighborhood graph of data points. Weights should be interpreted as connectivities.

```
adata.uns['neighbors' | key_added]dict
```

Examples

neighbors parameters.

```
>>> import scanpy as sc
>>> adata = sc.datasets.pbmc68k_reduced()
>>> # Basic usage
>>> sc.pp.neighbors(adata, 20, metric="cosine")
>>> # Provide your own transformer for more control and flexibility
>>> from sklearn.neighbors import KNeighborsTransformer
>>> transformer = KNeighborsTransformer(
...     n_neighbors=10, metric="manhattan", algorithm="kd_tree"
... )
>>> sc.pp.neighbors(adata, transformer=transformer)
>>> # now you can e.g. access the index: `transformer._tree`
```

See also
Using other kNN libraries in Scanpy

### scanpy.pp.recipe_seurat

#### Contents

### scanpy.pp.recipe_seurat #

scanpy.pp. recipe_seurat ( adata , * , log = True , plot = False , copy = False ) [source] #
Normalize and filter as of Seurat [ Satija et al. , 2015 ] .
This uses a particular preprocessing.
Expects non-logarithmized data. If using logarithmized data, pass `log=False` .
Parameters :

adata `AnnData`
Annotated data matrix.
log `bool` (default: `True` )
Logarithmize data?
plot `bool` (default: `False` )
Show a plot of the gene dispersion vs. mean relation.
copy `bool` (default: `False` )
Return a copy if true.
Return type :
`AnnData` | `None`

### scanpy.pp.recipe_weinreb17

#### Contents

### scanpy.pp.recipe_weinreb17 #

scanpy.pp. recipe_weinreb17 ( adata , * , log = True , mean_threshold = 0.01 , cv_threshold = 2 , n_pcs = 50 , svd_solver = 'randomized' , random_state = 0 , copy = False ) [source] #
Normalize and filter as of [ Weinreb et al. , 2017 ] .
Expects non-logarithmized data. If using logarithmized data, pass `log=False` .
Parameters :

adata `AnnData`
Annotated data matrix.
log `bool` (default: `True` )
Logarithmize data?
copy `bool` (default: `False` )
Return a copy if true.
Return type :
`AnnData` | `None`

### scanpy.pp.recipe_zheng17

#### Contents

### scanpy.pp.recipe_zheng17 #

scanpy.pp. recipe_zheng17 ( adata , * , n_top_genes = 1000 , log = True , plot = False , copy = False ) [source] #
Normalize and filter as of Zheng et al. [ 2017 ] .
Reproduces the preprocessing of Zheng et al. [ 2017 ] – the Cell Ranger R Kit of 10x Genomics.
Expects non-logarithmized data. If using logarithmized data, pass `log=False` .
The recipe runs the following steps

```
sc.pp.filter_genes(adata, min_counts=1)         # only consider genes with more than 1 count
sc.pp.normalize_per_cell(                       # normalize with total UMI count per cell
     adata, key_n_counts='n_counts_all'
)
filter_result = sc.pp.filter_genes_dispersion(  # select highly-variable genes
    adata.X, flavor='cell_ranger', n_top_genes=n_top_genes, log=False
)
adata = adata[:, filter_result.gene_subset]     # subset the genes
sc.pp.normalize_per_cell(adata)                 # renormalize after filtering
if log: sc.pp.log1p(adata)                      # log transform: adata.X = log(adata.X + 1)
sc.pp.scale(adata)                              # scale to unit variance and shift to zero mean
```
Parameters :

adata `AnnData`
Annotated data matrix.
n_top_genes `int` (default: `1000` )
Number of genes to keep.
log `bool` (default: `True` )
Take logarithm.
plot `bool` (default: `False` )
Show a plot of the gene dispersion vs. mean relation.
copy `bool` (default: `False` )
Return a copy of `adata` instead of updating it.
Return type :
`AnnData` | `None`
Returns :
Returns or updates `adata` depending on `copy` .

### scanpy.pp.scrublet

#### Contents

### scanpy.pp.scrublet #

scanpy.pp. scrublet ( adata , adata_sim = None , * , batch_key = None , sim_doublet_ratio = 2.0 , expected_doublet_rate = 0.05 , stdev_doublet_rate = 0.02 , synthetic_doublet_umi_subsampling = 1.0 , knn_dist_metric = 'euclidean' , normalize_variance = True , log_transform = False , mean_center = True , n_prin_comps = 30 , use_approx_neighbors = None , get_doublet_neighbor_parents = False , n_neighbors = None , threshold = None , verbose = True , copy = False , random_state = 0 ) [source] #
Predict doublets using Scrublet [ Wolock et al. , 2019 ] .
Predict cell doublets using a nearest-neighbor classifier of observed transcriptomes and simulated doublets. Works best if the input is a raw (unnormalized) counts matrix from a single sample or a collection of similar samples from the same experiment. This function is a wrapper around functions that pre-process using Scanpy and directly call functions of Scrublet(). You may also undertake your own preprocessing, simulate doublets with `scrublet_simulate_doublets()` , and run the core scrublet function `scrublet()` with `adata_sim` set.

| Array type | supported | … experimentally in dask `Array` |
|---|---|---|
|  |  |  |

```
numpy.ndarray
```

|  | ✅ | ❌ |
|---|---|---|
|  |  |  |

```
scipy.sparse.{csr,csc}_{array,matrix}
```

|  | ✅ | ❌ |
|---|---|---|
Parameters :

adata `AnnData`
The annotated data matrix of shape `n_obs` × `n_vars` . Rows correspond to cells and columns to genes. Expected to be un-normalised where adata_sim is not supplied, in which case doublets will be simulated and pre-processing applied to both objects. If adata_sim is supplied, this should be the observed transcriptomes processed consistently (filtering, transform, normalisaton, hvg) with adata_sim.
adata_sim `AnnData` | `None` (default: `None` )
(Advanced use case) Optional annData object generated by `scrublet_simulate_doublets()` , with same number of vars as adata. This should have been built from adata_obs after filtering genes and cells and selcting highly-variable genes.
batch_key `str` | `None` (default: `None` )
Optional `obs` column name discriminating between batches.
sim_doublet_ratio `float` (default: `2.0` )
Number of doublets to simulate relative to the number of observed transcriptomes.
expected_doublet_rate `float` (default: `0.05` )
Where adata_sim not suplied, the estimated doublet rate for the experiment.
stdev_doublet_rate `float` (default: `0.02` )
Where adata_sim not suplied, uncertainty in the expected doublet rate.
synthetic_doublet_umi_subsampling `float` (default: `1.0` )
Where adata_sim not suplied, rate for sampling UMIs when creating synthetic doublets. If 1.0, each doublet is created by simply adding the UMI counts from two randomly sampled observed transcriptomes. For values less than 1, the UMI counts are added and then randomly sampled at the specified rate.
knn_dist_metric `Literal` [ `'cityblock'` , `'cosine'` , `'euclidean'` , `'l1'` , `'l2'` , `'manhattan'` ] | `Literal` [ `'braycurtis'` , `'canberra'` , `'chebyshev'` , `'correlation'` , `'dice'` , `'hamming'` , `'jaccard'` , `'kulsinski'` , `'mahalanobis'` , `'minkowski'` , `'rogerstanimoto'` , `'russellrao'` , `'seuclidean'` , `'sokalmichener'` , `'sokalsneath'` , `'sqeuclidean'` , `'yule'` ] | `Callable` [[ `ndarray` , `ndarray` ], `float` ] (default: `'euclidean'` )
Distance metric used when finding nearest neighbors. For list of valid values, see the documentation for annoy (if `use_approx_neighbors` is True) or sklearn.neighbors.NearestNeighbors (if `use_approx_neighbors` is False).
normalize_variance `bool` (default: `True` )
If True, normalize the data such that each gene has a variance of 1. `sklearn.decomposition.TruncatedSVD` will be used for dimensionality reduction, unless `mean_center` is True.
log_transform `bool` (default: `False` )
Whether to use `log1p()` to log-transform the data prior to PCA.
mean_center `bool` (default: `True` )
If True, center the data such that each gene has a mean of 0. `sklearn.decomposition.PCA` will be used for dimensionality reduction.
n_prin_comps `int` (default: `30` )
Number of principal components used to embed the transcriptomes prior to k-nearest-neighbor graph construction.
use_approx_neighbors `bool` | `None` (default: `None` )
Use approximate nearest neighbor method (annoy) for the KNN classifier.
get_doublet_neighbor_parents `bool` (default: `False` )
If True, return (in .uns) the parent transcriptomes that generated the doublet neighbors of each observed transcriptome. This information can be used to infer the cell states that generated a given doublet state.
n_neighbors `int` | `None` (default: `None` )
Number of neighbors used to construct the KNN graph of observed transcriptomes and simulated doublets. If `None` , this is automatically set to `np.round(0.5 * np.sqrt(n_obs))` .
threshold `float` | `None` (default: `None` )
Doublet score threshold for calling a transcriptome a doublet. If `None` , this is set automatically by looking for the minimum between the two modes of the `doublet_scores_sim_` histogram. It is best practice to check the threshold visually using the `doublet_scores_sim_` histogram and/or based on co-localization of predicted doublets in a 2-D embedding.
verbose `bool` (default: `True` )
If `True` , log progress updates.
copy `bool` (default: `False` )
If `True` , return a copy of the input `adata` with Scrublet results added. Otherwise, Scrublet results are added in place.
random_state `int` | `RandomState` | `None` (default: `0` )
Initial state for doublet simulation and nearest neighbors.
Return type :
`AnnData` | `None`
Returns :
if `copy=True` it returns or else adds fields to `adata` . Those fields:

```
.obs['doublet_score']
```

Doublet scores for each observed transcriptome

```
.obs['predicted_doublet']
```

Boolean indicating predicted doublet status

```
.uns['scrublet']['doublet_scores_sim']
```

Doublet scores for each simulated doublet transcriptome

```
.uns['scrublet']['doublet_parents']
```

Pairs of `.obs_names` used to generate each simulated doublet transcriptome

```
.uns['scrublet']['parameters']
```

See also

Dictionary of Scrublet parameters

```
scrublet_simulate_doublets()
```
Run Scrublet’s doublet simulation separately for advanced usage.

```
scrublet_score_distribution()
```
Plot histogram of doublet scores for observed transcriptomes and simulated doublets.

### scanpy.pp.scrublet_simulate_doublets

#### Contents

### scanpy.pp.scrublet_simulate_doublets #

scanpy.pp. scrublet_simulate_doublets ( adata , * , layer = None , sim_doublet_ratio = 2.0 , synthetic_doublet_umi_subsampling = 1.0 , random_seed = 0 ) [source] #
Simulate doublets by adding the counts of random observed transcriptome pairs.

| Array type | supported | … experimentally in dask `Array` |
|---|---|---|
|  |  |  |

```
numpy.ndarray
```

|  | ✅ | ❌ |
|---|---|---|
|  |  |  |

```
scipy.sparse.{csr,csc}_{array,matrix}
```

|  | ✅ | ❌ |
|---|---|---|
Parameters :

adata `AnnData`
The annotated data matrix of shape `n_obs` × `n_vars` . Rows correspond to cells and columns to genes. Genes should have been filtered for expression and variability, and the object should contain raw expression of the same dimensions.
layer `str` | `None` (default: `None` )
Layer of adata where raw values are stored, or ‘X’ if values are in .X.
sim_doublet_ratio `float` (default: `2.0` )
Number of doublets to simulate relative to the number of observed transcriptomes. If `None` , self.sim_doublet_ratio is used.
synthetic_doublet_umi_subsampling `float` (default: `1.0` )
Rate for sampling UMIs when creating synthetic doublets. If 1.0, each doublet is created by simply adding the UMIs from two randomly sampled observed transcriptomes. For values less than 1, the UMI counts are added and then randomly sampled at the specified rate.
Return type :

```
AnnData
```
Returns :
adata : anndata.AnnData with simulated doublets in .X Adds fields to `adata` :

```
.obsm['scrublet']['doublet_parents']
```

Pairs of `.obs_names` used to generate each simulated doublet transcriptome

```
.uns['scrublet']['parameters']
```

See also

Dictionary of Scrublet parameters

```
scrublet()
```
Main way of running Scrublet, runs preprocessing, doublet simulation (this function) and calling.

```
scrublet_score_distribution()
```
Plot histogram of doublet scores for observed transcriptomes and simulated doublets.

### scanpy.pl.DotPlot.DEFAULT_COLORMAP

#### Contents

### scanpy.pl.DotPlot.DEFAULT_COLORMAP #

DotPlot. DEFAULT_COLORMAP = 'Reds' [source] #

### scanpy.pl.DotPlot.DEFAULT_COLOR_LEGEND_TITLE

### scanpy.pl.DotPlot.DEFAULT_COLOR_LEGEND_TITLE #

DotPlot. DEFAULT_COLOR_LEGEND_TITLE = 'Mean expression\nin group' [source] #

### scanpy.pl.DotPlot.DEFAULT_COLOR_ON

#### Contents

### scanpy.pl.DotPlot.DEFAULT_COLOR_ON #

DotPlot. DEFAULT_COLOR_ON = 'dot' [source] #

### scanpy.pl.DotPlot.DEFAULT_DOT_EDGECOLOR

#### Contents

### scanpy.pl.DotPlot.DEFAULT_DOT_EDGECOLOR #

DotPlot. DEFAULT_DOT_EDGECOLOR = 'black' [source] #

### scanpy.pl.DotPlot.DEFAULT_DOT_EDGELW

#### Contents

### scanpy.pl.DotPlot.DEFAULT_DOT_EDGELW #

DotPlot. DEFAULT_DOT_EDGELW = 0.2 [source] #

### scanpy.pl.DotPlot.DEFAULT_DOT_MAX

#### Contents

### scanpy.pl.DotPlot.DEFAULT_DOT_MAX #

DotPlot. DEFAULT_DOT_MAX = None [source] #

### scanpy.pl.DotPlot.DEFAULT_DOT_MIN

#### Contents

### scanpy.pl.DotPlot.DEFAULT_DOT_MIN #

DotPlot. DEFAULT_DOT_MIN = None [source] #

### scanpy.pl.DotPlot.DEFAULT_LARGEST_DOT

#### Contents

### scanpy.pl.DotPlot.DEFAULT_LARGEST_DOT #

DotPlot. DEFAULT_LARGEST_DOT = 200.0 [source] #

### scanpy.pl.DotPlot.DEFAULT_LEGENDS_WIDTH

#### Contents

### scanpy.pl.DotPlot.DEFAULT_LEGENDS_WIDTH #

DotPlot. DEFAULT_LEGENDS_WIDTH = 1.5 [source] #

### scanpy.pl.DotPlot.DEFAULT_PLOT_X_PADDING

#### Contents

### scanpy.pl.DotPlot.DEFAULT_PLOT_X_PADDING #

DotPlot. DEFAULT_PLOT_X_PADDING = 0.8 [source] #

### scanpy.pl.DotPlot.DEFAULT_PLOT_Y_PADDING

#### Contents

### scanpy.pl.DotPlot.DEFAULT_PLOT_Y_PADDING #

DotPlot. DEFAULT_PLOT_Y_PADDING = 1.0 [source] #

### scanpy.pl.DotPlot.DEFAULT_SAVE_PREFIX

#### Contents

### scanpy.pl.DotPlot.DEFAULT_SAVE_PREFIX #

DotPlot. DEFAULT_SAVE_PREFIX = 'dotplot_' [source] #

### scanpy.pl.DotPlot.DEFAULT_SIZE_EXPONENT

#### Contents

### scanpy.pl.DotPlot.DEFAULT_SIZE_EXPONENT #

DotPlot. DEFAULT_SIZE_EXPONENT = 1.5 [source] #

### scanpy.pl.DotPlot.DEFAULT_SIZE_LEGEND_TITLE

### scanpy.pl.DotPlot.DEFAULT_SIZE_LEGEND_TITLE #

DotPlot. DEFAULT_SIZE_LEGEND_TITLE = 'Fraction of cells\nin group (%)' [source] #

### scanpy.pl.DotPlot.DEFAULT_SMALLEST_DOT

#### Contents

### scanpy.pl.DotPlot.DEFAULT_SMALLEST_DOT #

DotPlot. DEFAULT_SMALLEST_DOT = 0.0 [source] #

### scanpy.pl.DotPlot.legend

#### Contents

### scanpy.pl.DotPlot.legend #

DotPlot. legend ( * , show = True , show_size_legend = True , show_colorbar = True , size_title = 'Fraction of cells\\nin group (%)' , colorbar_title = 'Mean expression\\nin group' , width = 1.5 ) [source] #
Configure dot size and the colorbar legends.

Parameters :

show `bool` | `None` (default: `True` )
Set to `False` to hide the default plot of the legends. This sets the legend width to zero, which will result in a wider main plot.
show_size_legend `bool` | `None` (default: `True` )
Set to `False` to hide the dot size legend
show_colorbar `bool` | `None` (default: `True` )
Set to `False` to hide the colorbar legend
size_title `str` | `None` (default: `'Fraction of cells\\nin group (%)'` )
Title for the dot size legend. Use `\n` to add line breaks. Appears on top of dot sizes
colorbar_title `str` | `None` (default: `'Mean expression\\nin group'` )
Title for the color bar. Use `\n` to add line breaks. Appears on top of the color bar
width `float` | `None` (default: `1.5` )
Width of the legends area. The unit is the same as in matplotlib (inches).
Return type :

```
Self
```
Returns :

```
DotPlot
```

Examples
Set color bar title:

```
>>> import scanpy as sc
>>> adata = sc.datasets.pbmc68k_reduced()
>>> markers = {"T-cell": "CD3D", "B-cell": "CD79A", "myeloid": "CST3"}
>>> dp = sc.pl.DotPlot(adata, markers, groupby="bulk_labels")
>>> dp.legend(colorbar_title="log(UMI counts + 1)").show()
```

### scanpy.pl.DotPlot

#### Contents

### scanpy.pl.DotPlot #

class scanpy.pl. DotPlot ( adata , var_names , groupby , * , use_raw = None , log = False , num_categories = 7 , categories_order = None , title = None , figsize = None , gene_symbols = None , var_group_positions = None , var_group_labels = None , var_group_rotation = None , layer = None , expression_cutoff = 0.0 , mean_only_expressed = False , standard_scale = None , dot_color_df = None , dot_size_df = None , ax = None , vmin = None , vmax = None , vcenter = None , norm = None , group_colors = None , ** kwds ) [source] #
Bases: `BasePlot`
Allows the visualization of two values that are encoded as dot size and color.
The size usually represents the fraction of cells (obs) that have a non-zero value for genes (var).
For each var_name and each `groupby` category a dot is plotted. Each dot represents two values: mean expression within each category (visualized by color) and fraction of cells expressing the `var_name` in the category (visualized by the size of the dot). If `groupby` is not given, the dotplot assumes that all data belongs to a single category.
Note
A gene is considered expressed if the expression value in the `adata` (or `adata.raw` ) is above the specified threshold which is zero by default.
An example of dotplot usage is to visualize, for multiple marker genes, the mean value and the percentage of cells expressing the gene across multiple clusters.
See also
Parameters :

adata `AnnData`
Annotated data matrix.
var_names `str` | `Sequence` [ `str` ] | `Mapping` [ `str` , `str` | `Sequence` [ `str` ]]
`var_names` should be a valid subset of `adata.var_names` . If `var_names` is a mapping, then the key is used as label to group the values (see `var_group_labels` ). The mapping values should be sequences of valid `adata.var_names` . In this case either coloring or ‘brackets’ are used for the grouping of var names depending on the plot. When `var_names` is a mapping, then the `var_group_labels` and `var_group_positions` are set.
groupby `str` | `Sequence` [ `str` ]
The key of the observation grouping to consider.
use_raw `bool` | `None` (default: `None` )
Use `raw` attribute of `adata` if present.
log `bool` (default: `False` )
Plot on logarithmic axis.
num_categories `int` (default: `7` )
Only used if groupby observation is not categorical. This value determines the number of groups into which the groupby observation should be subdivided.
categories_order `Sequence` [ `str` ] | `None` (default: `None` )
Order in which to show the categories. Note: add_dendrogram or add_totals can change the categories order.
figsize `tuple` [ `float` , `float` ] | `None` (default: `None` )
Figure size when `multi_panel=True` . Otherwise the `rcParam['figure.figsize]` value is used. Format is (width, height)
dendrogram
If True or a valid dendrogram key, a dendrogram based on the hierarchical clustering between the `groupby` categories is added. The dendrogram information is computed using `scanpy.tl.dendrogram()` . If `tl.dendrogram` has not been called previously the function is called with default parameters.
gene_symbols `str` | `None` (default: `None` )
Column name in `.var` DataFrame that stores gene symbols. By default `var_names` refer to the index column of the `.var` DataFrame. Setting this option allows alternative names to be used.
var_group_positions `Sequence` [ `tuple` [ `int` , `int` ]] | `None` (default: `None` )
Use this parameter to highlight groups of `var_names` . This will draw a ‘bracket’ or a color block between the given start and end positions. If the parameter `var_group_labels` is set, the corresponding labels are added on top/left. E.g. `var_group_positions=[(4,10)]` will add a bracket between the fourth `var_name` and the tenth `var_name` . By giving more positions, more brackets/color blocks are drawn.
var_group_labels `Sequence` [ `str` ] | `None` (default: `None` )
Labels for each of the `var_group_positions` that want to be highlighted.
var_group_rotation `float` | `None` (default: `None` )
Label rotation degrees. By default, labels larger than 4 characters are rotated 90 degrees.
layer `str` | `None` (default: `None` )
Name of the AnnData object layer that wants to be plotted. By default adata.raw.X is plotted. If `use_raw=False` is set, then `adata.X` is plotted. If `layer` is set to a valid layer name, then the layer is plotted. `layer` takes precedence over `use_raw` .
title `str` | `None` (default: `None` )
Title for the figure
expression_cutoff `float` (default: `0.0` )
Expression cutoff that is used for binarizing the gene expression and determining the fraction of cells expressing given genes. A gene is expressed only if the expression value is greater than this threshold.
mean_only_expressed `bool` (default: `False` )
If True, gene expression is averaged only over the cells expressing the given genes.
standard_scale `Literal` [ `'var'` , `'group'` ] | `None` (default: `None` )
Whether or not to standardize that dimension between 0 and 1, meaning for each variable or group, subtract the minimum and divide each by its maximum.
kwds
Are passed to `matplotlib.pyplot.scatter()` .

```
dotplot()
```
Simpler way to call DotPlot but with less options.

```
rank_genes_groups_dotplot()
```

Examples
to plot marker genes identified using the `rank_genes_groups()` function.

```
>>> import scanpy as sc
>>> adata = sc.datasets.pbmc68k_reduced()
>>> markers = ["C1QA", "PSAP", "CD79A", "CD79B", "CST3", "LYZ"]
>>> sc.pl.DotPlot(adata, markers, groupby="bulk_labels").show()
```

Using var_names as dict:

```
>>> markers = {"T-cell": "CD3D", "B-cell": "CD79A", "myeloid": "CST3"}
>>> sc.pl.DotPlot(adata, markers, groupby="bulk_labels").show()
```

Attributes

```
DEFAULT_COLORMAP
DEFAULT_COLOR_LEGEND_TITLE
DEFAULT_COLOR_ON
DEFAULT_DOT_EDGECOLOR
DEFAULT_DOT_EDGELW
DEFAULT_DOT_MAX
DEFAULT_DOT_MIN
DEFAULT_LARGEST_DOT
DEFAULT_LEGENDS_WIDTH
DEFAULT_PLOT_X_PADDING
DEFAULT_PLOT_Y_PADDING
DEFAULT_SAVE_PREFIX
DEFAULT_SIZE_EXPONENT
DEFAULT_SIZE_LEGEND_TITLE
DEFAULT_SMALLEST_DOT
```

Methods

| `legend` (*[, show, show_size_legend, ...]) | Configure dot size and the colorbar legends. |
|---|---|
| `style` (*[, cmap, color_on, dot_max, dot_min, ...]) | Modify plot visual parameters. |

### scanpy.pl.DotPlot.style

#### Contents

### scanpy.pl.DotPlot.style #

DotPlot. style ( * , cmap = _empty , color_on = _empty , dot_max = _empty , dot_min = _empty , smallest_dot = _empty , largest_dot = _empty , dot_edge_color = _empty , dot_edge_lw = _empty , size_exponent = _empty , grid = _empty , x_padding = _empty , y_padding = _empty ) [source] #
Modify plot visual parameters.

Parameters :

cmap `Colormap` | `str` | `Empty` | `None` (default: `_empty` )
String denoting matplotlib color map.
color_on `Literal` [ `'dot'` , `'square'` ] | `Empty` (default: `_empty` )
By default the color map is applied to the color of the `"dot"` . Optionally, the colormap can be applied to a `"square"` behind the dot, in which case the dot is transparent and only the edge is shown.
dot_max `float` | `Empty` | `None` (default: `_empty` )
If `None` , the maximum dot size is set to the maximum fraction value found (e.g. 0.6). If given, the value should be a number between 0 and 1. All fractions larger than dot_max are clipped to this value.
dot_min `float` | `Empty` | `None` (default: `_empty` )
If `None` , the minimum dot size is set to 0. If given, the value should be a number between 0 and 1. All fractions smaller than dot_min are clipped to this value.
smallest_dot `float` | `Empty` (default: `_empty` )
All expression fractions with `dot_min` are plotted with this size.
largest_dot `float` | `Empty` (default: `_empty` )
All expression fractions with `dot_max` are plotted with this size.
dot_edge_color `str` | `tuple` [ `float` , `float` , `float` ] | `tuple` [ `float` , `float` , `float` , `float` ] | `Empty` | `None` (default: `_empty` )
Dot edge color. When `color_on='dot'` , `None` means no edge. When `color_on='square'` , `None` means that the edge color is white for darker colors and black for lighter background square colors.
dot_edge_lw `float` | `Empty` | `None` (default: `_empty` )
Dot edge line width. When `color_on='dot'` , `None` means no edge. When `color_on='square'` , `None` means a line width of 1.5.
size_exponent `float` | `Empty` (default: `_empty` )
Dot size is computed as: fraction ** size exponent and afterwards scaled to match the `smallest_dot` and `largest_dot` size parameters. Using a different size exponent changes the relative sizes of the dots to each other.
grid `bool` | `Empty` (default: `_empty` )
Set to true to show grid lines. By default grid lines are not shown. Further configuration of the grid lines can be achieved directly on the returned ax.
x_padding `float` | `Empty` (default: `_empty` )
Space between the plot left/right borders and the dots center. A unit is the distance between the x ticks. Only applied when color_on = dot
y_padding `float` | `Empty` (default: `_empty` )
Space between the plot top/bottom borders and the dots center. A unit is the distance between the y ticks. Only applied when color_on = dot
Return type :

```
Self
```
Returns :

```
DotPlot
```

Examples

```
>>> import scanpy as sc
>>> adata = sc.datasets.pbmc68k_reduced()
>>> markers = ['C1QA', 'PSAP', 'CD79A', 'CD79B', 'CST3', 'LYZ']
```

Change color map and apply it to the square behind the dot

```
>>> sc.pl.DotPlot(adata, markers, groupby='bulk_labels') \
...     .style(cmap='RdBu_r', color_on='square').show()
```

Add edge to dots and plot a grid

```
>>> sc.pl.DotPlot(adata, markers, groupby='bulk_labels') \
...     .style(dot_edge_color='black', dot_edge_lw=1, grid=True) \
...     .show()
```

### scanpy.pl.MatrixPlot.DEFAULT_COLORMAP

#### Contents

### scanpy.pl.MatrixPlot.DEFAULT_COLORMAP #

MatrixPlot. DEFAULT_COLORMAP = 'viridis' [source] #

### scanpy.pl.MatrixPlot.DEFAULT_COLOR_LEGEND_TITLE

### scanpy.pl.MatrixPlot.DEFAULT_COLOR_LEGEND_TITLE #

MatrixPlot. DEFAULT_COLOR_LEGEND_TITLE = 'Mean expression\nin group' [source] #

### scanpy.pl.MatrixPlot.DEFAULT_EDGE_COLOR

#### Contents

### scanpy.pl.MatrixPlot.DEFAULT_EDGE_COLOR #

MatrixPlot. DEFAULT_EDGE_COLOR = 'gray' [source] #

### scanpy.pl.MatrixPlot.DEFAULT_EDGE_LW

#### Contents

### scanpy.pl.MatrixPlot.DEFAULT_EDGE_LW #

MatrixPlot. DEFAULT_EDGE_LW = 0.1 [source] #

### scanpy.pl.MatrixPlot.DEFAULT_SAVE_PREFIX

#### Contents

### scanpy.pl.MatrixPlot.DEFAULT_SAVE_PREFIX #

MatrixPlot. DEFAULT_SAVE_PREFIX = 'matrixplot_' [source] #

### scanpy.pl.MatrixPlot

#### Contents

### scanpy.pl.MatrixPlot #

class scanpy.pl. MatrixPlot ( adata , var_names , groupby , * , use_raw = None , log = False , num_categories = 7 , categories_order = None , title = None , figsize = None , gene_symbols = None , var_group_positions = None , var_group_labels = None , var_group_rotation = None , layer = None , standard_scale = None , ax = None , values_df = None , vmin = None , vmax = None , vcenter = None , norm = None , ** kwds ) [source] #
Bases: `BasePlot`
Allows the visualization of values using a color map.
See also
Parameters :

adata `AnnData`
Annotated data matrix.
var_names `str` | `Sequence` [ `str` ] | `Mapping` [ `str` , `str` | `Sequence` [ `str` ]]
`var_names` should be a valid subset of `adata.var_names` . If `var_names` is a mapping, then the key is used as label to group the values (see `var_group_labels` ). The mapping values should be sequences of valid `adata.var_names` . In this case either coloring or ‘brackets’ are used for the grouping of var names depending on the plot. When `var_names` is a mapping, then the `var_group_labels` and `var_group_positions` are set.
groupby `str` | `Sequence` [ `str` ]
The key of the observation grouping to consider.
use_raw `bool` | `None` (default: `None` )
Use `raw` attribute of `adata` if present.
log `bool` (default: `False` )
Plot on logarithmic axis.
num_categories `int` (default: `7` )
Only used if groupby observation is not categorical. This value determines the number of groups into which the groupby observation should be subdivided.
categories_order `Sequence` [ `str` ] | `None` (default: `None` )
Order in which to show the categories. Note: add_dendrogram or add_totals can change the categories order.
figsize `tuple` [ `float` , `float` ] | `None` (default: `None` )
Figure size when `multi_panel=True` . Otherwise the `rcParam['figure.figsize]` value is used. Format is (width, height)
dendrogram
If True or a valid dendrogram key, a dendrogram based on the hierarchical clustering between the `groupby` categories is added. The dendrogram information is computed using `scanpy.tl.dendrogram()` . If `tl.dendrogram` has not been called previously the function is called with default parameters.
gene_symbols `str` | `None` (default: `None` )
Column name in `.var` DataFrame that stores gene symbols. By default `var_names` refer to the index column of the `.var` DataFrame. Setting this option allows alternative names to be used.
var_group_positions `Sequence` [ `tuple` [ `int` , `int` ]] | `None` (default: `None` )
Use this parameter to highlight groups of `var_names` . This will draw a ‘bracket’ or a color block between the given start and end positions. If the parameter `var_group_labels` is set, the corresponding labels are added on top/left. E.g. `var_group_positions=[(4,10)]` will add a bracket between the fourth `var_name` and the tenth `var_name` . By giving more positions, more brackets/color blocks are drawn.
var_group_labels `Sequence` [ `str` ] | `None` (default: `None` )
Labels for each of the `var_group_positions` that want to be highlighted.
var_group_rotation `float` | `None` (default: `None` )
Label rotation degrees. By default, labels larger than 4 characters are rotated 90 degrees.
layer `str` | `None` (default: `None` )
Name of the AnnData object layer that wants to be plotted. By default adata.raw.X is plotted. If `use_raw=False` is set, then `adata.X` is plotted. If `layer` is set to a valid layer name, then the layer is plotted. `layer` takes precedence over `use_raw` .
title `str` | `None` (default: `None` )
Title for the figure.
expression_cutoff
Expression cutoff that is used for binarizing the gene expression and determining the fraction of cells expressing given genes. A gene is expressed only if the expression value is greater than this threshold.
mean_only_expressed
If True, gene expression is averaged only over the cells expressing the given genes.
standard_scale `Literal` [ `'var'` , `'group'` ] | `None` (default: `None` )
Whether or not to standardize that dimension between 0 and 1, meaning for each variable or group, subtract the minimum and divide each by its maximum.
values_df `DataFrame` | `None` (default: `None` )
Optionally, a dataframe with the values to plot can be given. The index should be the grouby categories and the columns the genes names.
kwds
Are passed to `matplotlib.pyplot.scatter()` .

```
matrixplot()
```
Simpler way to call MatrixPlot but with less options.

```
rank_genes_groups_matrixplot()
```

Examples
Simple visualization of the average expression of a few genes grouped by the category ‘bulk_labels’.
to plot marker genes identified using the `rank_genes_groups()` function.

```
import scanpy as sc
adata = sc.datasets.pbmc68k_reduced()
markers = ['C1QA', 'PSAP', 'CD79A', 'CD79B', 'CST3', 'LYZ']
sc.pl.MatrixPlot(adata, markers, groupby='bulk_labels').show()
```

Same visualization but passing var_names as dict, which adds a grouping of the genes on top of the image:

```
markers = {'T-cell': 'CD3D', 'B-cell': 'CD79A', 'myeloid': 'CST3'}
sc.pl.MatrixPlot(adata, markers, groupby='bulk_labels').show()
```

Attributes

```
DEFAULT_COLORMAP
DEFAULT_COLOR_LEGEND_TITLE
DEFAULT_EDGE_COLOR
DEFAULT_EDGE_LW
DEFAULT_SAVE_PREFIX
```

Methods

| `style` ([cmap, edge_color, edge_lw]) | Modify plot visual parameters. |
|---|---|

### scanpy.pl.MatrixPlot.style

#### Contents

### scanpy.pl.MatrixPlot.style #

MatrixPlot. style ( cmap = _empty , edge_color = _empty , edge_lw = _empty ) [source] #
Modify plot visual parameters.

Parameters :

cmap `Colormap` | `str` | `Empty` | `None` (default: `_empty` )
Matplotlib color map, specified by name or directly. If `None` , use `matplotlib.rcParams` `["image.cmap"]`
edge_color `str` | `tuple` [ `float` , `float` , `float` ] | `tuple` [ `float` , `float` , `float` , `float` ] | `Empty` | `None` (default: `_empty` )
Edge color between the squares of matrix plot. If `None` , use `matplotlib.rcParams` `["patch.edgecolor"]`
edge_lw `float` | `Empty` | `None` (default: `_empty` )
Edge line width. If `None` , use `matplotlib.rcParams` `["lines.linewidth"]`
Return type :

```
Self
```
Returns :

```
MatrixPlot
```

Examples

```
import scanpy as sc

adata = sc.datasets.pbmc68k_reduced()
markers = ['C1QA', 'PSAP', 'CD79A', 'CD79B', 'CST3', 'LYZ']
```

Change color map and turn off edges:

```
(
    sc.pl.MatrixPlot(adata, markers, groupby='bulk_labels')
    .style(cmap='Blues', edge_color='none')
    .show()
)
```

### scanpy.pl.StackedViolin.DEFAULT_COLORMAP

#### Contents

### scanpy.pl.StackedViolin.DEFAULT_COLORMAP #

StackedViolin. DEFAULT_COLORMAP = 'Blues' [source] #

### scanpy.pl.StackedViolin.DEFAULT_COLOR_LEGEND_TITLE

### scanpy.pl.StackedViolin.DEFAULT_COLOR_LEGEND_TITLE #

StackedViolin. DEFAULT_COLOR_LEGEND_TITLE = 'Median expression\nin group' [source] #

### scanpy.pl.StackedViolin.DEFAULT_CUT

#### Contents

### scanpy.pl.StackedViolin.DEFAULT_CUT #

StackedViolin. DEFAULT_CUT = 0 [source] #

### scanpy.pl.StackedViolin.DEFAULT_DENSITY_NORM

#### Contents

### scanpy.pl.StackedViolin.DEFAULT_DENSITY_NORM #

StackedViolin. DEFAULT_DENSITY_NORM = 'width' [source] #

### scanpy.pl.StackedViolin.DEFAULT_INNER

#### Contents

### scanpy.pl.StackedViolin.DEFAULT_INNER #

StackedViolin. DEFAULT_INNER = None [source] #

### scanpy.pl.StackedViolin.DEFAULT_JITTER

#### Contents

### scanpy.pl.StackedViolin.DEFAULT_JITTER #

StackedViolin. DEFAULT_JITTER = False [source] #

### scanpy.pl.StackedViolin.DEFAULT_JITTER_SIZE

#### Contents

### scanpy.pl.StackedViolin.DEFAULT_JITTER_SIZE #

StackedViolin. DEFAULT_JITTER_SIZE = 1 [source] #

### scanpy.pl.StackedViolin.DEFAULT_LINE_WIDTH

#### Contents

### scanpy.pl.StackedViolin.DEFAULT_LINE_WIDTH #

StackedViolin. DEFAULT_LINE_WIDTH = 0.2 [source] #

### scanpy.pl.StackedViolin.DEFAULT_PLOT_X_PADDING

#### Contents

### scanpy.pl.StackedViolin.DEFAULT_PLOT_X_PADDING #

StackedViolin. DEFAULT_PLOT_X_PADDING = 0.5 [source] #

### scanpy.pl.StackedViolin.DEFAULT_PLOT_YTICKLABELS

#### Contents

### scanpy.pl.StackedViolin.DEFAULT_PLOT_YTICKLABELS #

StackedViolin. DEFAULT_PLOT_YTICKLABELS = False [source] #

### scanpy.pl.StackedViolin.DEFAULT_PLOT_Y_PADDING

#### Contents

### scanpy.pl.StackedViolin.DEFAULT_PLOT_Y_PADDING #

StackedViolin. DEFAULT_PLOT_Y_PADDING = 0.5 [source] #

### scanpy.pl.StackedViolin.DEFAULT_ROW_PALETTE

#### Contents

### scanpy.pl.StackedViolin.DEFAULT_ROW_PALETTE #

StackedViolin. DEFAULT_ROW_PALETTE = None [source] #

### scanpy.pl.StackedViolin.DEFAULT_SAVE_PREFIX

#### Contents

### scanpy.pl.StackedViolin.DEFAULT_SAVE_PREFIX #

StackedViolin. DEFAULT_SAVE_PREFIX = 'stacked_violin_' [source] #

### scanpy.pl.StackedViolin.DEFAULT_STRIPPLOT

#### Contents

### scanpy.pl.StackedViolin.DEFAULT_STRIPPLOT #

StackedViolin. DEFAULT_STRIPPLOT = False [source] #

### scanpy.pl.StackedViolin.DEFAULT_YLIM

#### Contents

### scanpy.pl.StackedViolin.DEFAULT_YLIM #

StackedViolin. DEFAULT_YLIM = None [source] #

### scanpy.pl.StackedViolin

#### Contents

### scanpy.pl.StackedViolin #

class scanpy.pl. StackedViolin ( adata , var_names , groupby , * , use_raw = None , log = False , num_categories = 7 , categories_order = None , title = None , figsize = None , gene_symbols = None , var_group_positions = None , var_group_labels = None , var_group_rotation = None , layer = None , standard_scale = None , ax = None , vmin = None , vmax = None , vcenter = None , norm = None , ** kwds ) [source] #
Bases: `BasePlot`
Stacked violin plots.
Makes a compact image composed of individual violin plots (from `violinplot()` ) stacked on top of each other. Useful to visualize gene expression per cluster.
Wraps `seaborn.violinplot()` for `AnnData` .
See also
Parameters :

adata `AnnData`
Annotated data matrix.
var_names `str` | `Sequence` [ `str` ] | `Mapping` [ `str` , `str` | `Sequence` [ `str` ]]
`var_names` should be a valid subset of `adata.var_names` . If `var_names` is a mapping, then the key is used as label to group the values (see `var_group_labels` ). The mapping values should be sequences of valid `adata.var_names` . In this case either coloring or ‘brackets’ are used for the grouping of var names depending on the plot. When `var_names` is a mapping, then the `var_group_labels` and `var_group_positions` are set.
groupby `str` | `Sequence` [ `str` ]
The key of the observation grouping to consider.
use_raw `bool` | `None` (default: `None` )
Use `raw` attribute of `adata` if present.
log `bool` (default: `False` )
Plot on logarithmic axis.
num_categories `int` (default: `7` )
Only used if groupby observation is not categorical. This value determines the number of groups into which the groupby observation should be subdivided.
categories_order `Sequence` [ `str` ] | `None` (default: `None` )
Order in which to show the categories. Note: add_dendrogram or add_totals can change the categories order.
figsize `tuple` [ `float` , `float` ] | `None` (default: `None` )
Figure size when `multi_panel=True` . Otherwise the `rcParam['figure.figsize]` value is used. Format is (width, height)
dendrogram
If True or a valid dendrogram key, a dendrogram based on the hierarchical clustering between the `groupby` categories is added. The dendrogram information is computed using `scanpy.tl.dendrogram()` . If `tl.dendrogram` has not been called previously the function is called with default parameters.
gene_symbols `str` | `None` (default: `None` )
Column name in `.var` DataFrame that stores gene symbols. By default `var_names` refer to the index column of the `.var` DataFrame. Setting this option allows alternative names to be used.
var_group_positions `Sequence` [ `tuple` [ `int` , `int` ]] | `None` (default: `None` )
Use this parameter to highlight groups of `var_names` . This will draw a ‘bracket’ or a color block between the given start and end positions. If the parameter `var_group_labels` is set, the corresponding labels are added on top/left. E.g. `var_group_positions=[(4,10)]` will add a bracket between the fourth `var_name` and the tenth `var_name` . By giving more positions, more brackets/color blocks are drawn.
var_group_labels `Sequence` [ `str` ] | `None` (default: `None` )
Labels for each of the `var_group_positions` that want to be highlighted.
var_group_rotation `float` | `None` (default: `None` )
Label rotation degrees. By default, labels larger than 4 characters are rotated 90 degrees.
layer `str` | `None` (default: `None` )
Name of the AnnData object layer that wants to be plotted. By default adata.raw.X is plotted. If `use_raw=False` is set, then `adata.X` is plotted. If `layer` is set to a valid layer name, then the layer is plotted. `layer` takes precedence over `use_raw` .
title `str` | `None` (default: `None` )
Title for the figure
stripplot
Add a stripplot on top of the violin plot. See `stripplot()` .
jitter
Add jitter to the stripplot (only when stripplot is True) See `stripplot()` .
size
Size of the jitter points.
order
Order in which to show the categories. Note: if `dendrogram=True` the categories order will be given by the dendrogram and `order` will be ignored.
density_norm
The method used to scale the width of each violin. If ‘width’ (the default), each violin will have the same width. If ‘area’, each violin will have the same area. If ‘count’, a violin’s width corresponds to the number of observations.
row_palette
The row palette determines the colors to use for the stacked violins. The value should be a valid seaborn or matplotlib palette name (see `color_palette()` ). Alternatively, a single color name or hex value can be passed, e.g. `'red'` or `'#cc33ff'` .
standard_scale `Literal` [ `'var'` , `'group'` ] | `None` (default: `None` )
Whether or not to standardize a dimension between 0 and 1, meaning for each variable or observation, subtract the minimum and divide each by its maximum.
swap_axes
By default, the x axis contains `var_names` (e.g. genes) and the y axis the `groupby` categories. By setting `swap_axes` then x are the `groupby` categories and y the `var_names` . When swapping axes var_group_positions are no longer used
kwds
Are passed to `violinplot()` .

```
stacked_violin()
```
simpler way to call StackedViolin but with less options.

```
violin()
```

Examples
to plot marker genes identified using `rank_genes_groups()`

```
>>> import scanpy as sc
>>> adata = sc.datasets.pbmc68k_reduced()
>>> markers = ["C1QA", "PSAP", "CD79A", "CD79B", "CST3", "LYZ"]
>>> sc.pl.StackedViolin(
...     adata, markers, groupby="bulk_labels", dendrogram=True
... )
<scanpy.plotting._stacked_violin.StackedViolin object at 0x...>
```

Using var_names as dict:

```
>>> markers = {"T-cell": "CD3D", "B-cell": "CD79A", "myeloid": "CST3"}
>>> sc.pl.StackedViolin(
...     adata, markers, groupby="bulk_labels", dendrogram=True
... )
<scanpy.plotting._stacked_violin.StackedViolin object at 0x...>
```

Attributes

```
DEFAULT_COLORMAP
DEFAULT_COLOR_LEGEND_TITLE
DEFAULT_CUT
DEFAULT_DENSITY_NORM
DEFAULT_INNER
DEFAULT_JITTER
DEFAULT_JITTER_SIZE
DEFAULT_LINE_WIDTH
DEFAULT_PLOT_X_PADDING
DEFAULT_PLOT_YTICKLABELS
DEFAULT_PLOT_Y_PADDING
DEFAULT_ROW_PALETTE
DEFAULT_SAVE_PREFIX
DEFAULT_STRIPPLOT
DEFAULT_YLIM
```

Methods

| `style` (*[, cmap, stripplot, jitter, ...]) | Modify plot visual parameters. |
|---|---|

### scanpy.pl.StackedViolin.style

#### Contents

### scanpy.pl.StackedViolin.style #

StackedViolin. style ( * , cmap = _empty , stripplot = _empty , jitter = _empty , jitter_size = _empty , linewidth = _empty , row_palette = _empty , density_norm = _empty , yticklabels = _empty , ylim = _empty , x_padding = _empty , y_padding = _empty , scale = _empty ) [source] #
Modify plot visual parameters.

Parameters :

cmap `Colormap` | `str` | `Empty` | `None` (default: `_empty` )
Matplotlib color map, specified by name or directly. If `None` , use `matplotlib.rcParams` `["image.cmap"]`
stripplot `bool` | `Empty` (default: `_empty` )
Add a stripplot on top of the violin plot. See `stripplot()` .
jitter `float` | `bool` | `Empty` (default: `_empty` )
Add jitter to the stripplot (only when stripplot is True) See `stripplot()` .
jitter_size `float` | `Empty` (default: `_empty` )
Size of the jitter points.
linewidth `float` | `Empty` | `None` (default: `_empty` )
line width for the violin plots. If None, use `matplotlib.rcParams` `["lines.linewidth"]`
row_palette `str` | `Empty` | `None` (default: `_empty` )
The row palette determines the colors to use for the stacked violins. If `None` , use `matplotlib.rcParams` `["axes.prop_cycle"]` The value should be a valid seaborn or matplotlib palette name (see `color_palette()` ). Alternatively, a single color name or hex value can be passed, e.g. `'red'` or `'#cc33ff'` .
density_norm `Literal` [ `'area'` , `'count'` , `'width'` ] | `Empty` (default: `_empty` )
The method used to scale the width of each violin. If ‘width’ (the default), each violin will have the same width. If ‘area’, each violin will have the same area. If ‘count’, a violin’s width corresponds to the number of observations.
yticklabels `bool` | `Empty` (default: `_empty` )
Set to true to view the y tick labels.
ylim `tuple` [ `float` , `float` ] | `Empty` | `None` (default: `_empty` )
minimum and maximum values for the y-axis. If not `None` , all rows will have the same y-axis range. Example: `ylim=(0, 5)`
x_padding `float` | `Empty` (default: `_empty` )
Space between the plot left/right borders and the violins. A unit is the distance between the x ticks.
y_padding `float` | `Empty` (default: `_empty` )
Space between the plot top/bottom borders and the violins. A unit is the distance between the y ticks.
Return type :

```
Self
```
Returns :

```
StackedViolin
```

Examples

```
>>> import scanpy as sc
>>> adata = sc.datasets.pbmc68k_reduced()
>>> markers = ['C1QA', 'PSAP', 'CD79A', 'CD79B', 'CST3', 'LYZ']
```

Change color map and turn off edges

```
>>> sc.pl.StackedViolin(adata, markers, groupby='bulk_labels') \
...     .style(row_palette='Blues', linewidth=0).show()
```

{% endraw %}{% dropdown 来源与延伸 open:true %}
- `scanpy:api/classes.md` Classes
- `scanpy:api/datasets.md` Datasets
- `scanpy:api/experimental.md` Experimental
- `scanpy:api/get.md` Get object from AnnData: get
- `scanpy:api/index.md` API
- `scanpy:api/io.md` Reading and Writing
- `scanpy:api/metrics.md` Metrics
- `scanpy:api/plotting.md` Plotting: pl
- `scanpy:api/preprocessing.md` Preprocessing: pp
- `scanpy:api/queries.md` Queries
- `scanpy:api/settings.md` Settings
- `scanpy:api/tools.md` Tools: tl
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.DEFAULT_COLORMAP.md` scanpy.pl.DotPlot.DEFAULT_COLORMAP
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.DEFAULT_COLOR_LEGEND_TITLE.md` scanpy.pl.DotPlot.DEFAULT_COLOR_LEGEND_TITLE
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.DEFAULT_COLOR_ON.md` scanpy.pl.DotPlot.DEFAULT_COLOR_ON
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.DEFAULT_DOT_EDGECOLOR.md` scanpy.pl.DotPlot.DEFAULT_DOT_EDGECOLOR
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.DEFAULT_DOT_EDGELW.md` scanpy.pl.DotPlot.DEFAULT_DOT_EDGELW
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.DEFAULT_DOT_MAX.md` scanpy.pl.DotPlot.DEFAULT_DOT_MAX
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.DEFAULT_DOT_MIN.md` scanpy.pl.DotPlot.DEFAULT_DOT_MIN
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.DEFAULT_LARGEST_DOT.md` scanpy.pl.DotPlot.DEFAULT_LARGEST_DOT
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.DEFAULT_LEGENDS_WIDTH.md` scanpy.pl.DotPlot.DEFAULT_LEGENDS_WIDTH
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.DEFAULT_PLOT_X_PADDING.md` scanpy.pl.DotPlot.DEFAULT_PLOT_X_PADDING
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.DEFAULT_PLOT_Y_PADDING.md` scanpy.pl.DotPlot.DEFAULT_PLOT_Y_PADDING
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.DEFAULT_SAVE_PREFIX.md` scanpy.pl.DotPlot.DEFAULT_SAVE_PREFIX
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.DEFAULT_SIZE_EXPONENT.md` scanpy.pl.DotPlot.DEFAULT_SIZE_EXPONENT
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.DEFAULT_SIZE_LEGEND_TITLE.md` scanpy.pl.DotPlot.DEFAULT_SIZE_LEGEND_TITLE
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.DEFAULT_SMALLEST_DOT.md` scanpy.pl.DotPlot.DEFAULT_SMALLEST_DOT
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.legend.md` scanpy.pl.DotPlot.legend
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.md` scanpy.pl.DotPlot
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.style.md` scanpy.pl.DotPlot.style
- `scanpy:api/generated/classes/scanpy.pl.MatrixPlot.DEFAULT_COLORMAP.md` scanpy.pl.MatrixPlot.DEFAULT_COLORMAP
- `scanpy:api/generated/classes/scanpy.pl.MatrixPlot.DEFAULT_COLOR_LEGEND_TITLE.md` scanpy.pl.MatrixPlot.DEFAULT_COLOR_LEGEND_TITLE
- `scanpy:api/generated/classes/scanpy.pl.MatrixPlot.DEFAULT_EDGE_COLOR.md` scanpy.pl.MatrixPlot.DEFAULT_EDGE_COLOR
- `scanpy:api/generated/classes/scanpy.pl.MatrixPlot.DEFAULT_EDGE_LW.md` scanpy.pl.MatrixPlot.DEFAULT_EDGE_LW
- `scanpy:api/generated/classes/scanpy.pl.MatrixPlot.DEFAULT_SAVE_PREFIX.md` scanpy.pl.MatrixPlot.DEFAULT_SAVE_PREFIX
- `scanpy:api/generated/classes/scanpy.pl.MatrixPlot.md` scanpy.pl.MatrixPlot
- `scanpy:api/generated/classes/scanpy.pl.MatrixPlot.style.md` scanpy.pl.MatrixPlot.style
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.DEFAULT_COLORMAP.md` scanpy.pl.StackedViolin.DEFAULT_COLORMAP
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.DEFAULT_COLOR_LEGEND_TITLE.md` scanpy.pl.StackedViolin.DEFAULT_COLOR_LEGEND_TITLE
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.DEFAULT_CUT.md` scanpy.pl.StackedViolin.DEFAULT_CUT
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.DEFAULT_DENSITY_NORM.md` scanpy.pl.StackedViolin.DEFAULT_DENSITY_NORM
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.DEFAULT_INNER.md` scanpy.pl.StackedViolin.DEFAULT_INNER
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.DEFAULT_JITTER.md` scanpy.pl.StackedViolin.DEFAULT_JITTER
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.DEFAULT_JITTER_SIZE.md` scanpy.pl.StackedViolin.DEFAULT_JITTER_SIZE
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.DEFAULT_LINE_WIDTH.md` scanpy.pl.StackedViolin.DEFAULT_LINE_WIDTH
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.DEFAULT_PLOT_X_PADDING.md` scanpy.pl.StackedViolin.DEFAULT_PLOT_X_PADDING
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.DEFAULT_PLOT_YTICKLABELS.md` scanpy.pl.StackedViolin.DEFAULT_PLOT_YTICKLABELS
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.DEFAULT_PLOT_Y_PADDING.md` scanpy.pl.StackedViolin.DEFAULT_PLOT_Y_PADDING
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.DEFAULT_ROW_PALETTE.md` scanpy.pl.StackedViolin.DEFAULT_ROW_PALETTE
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.DEFAULT_SAVE_PREFIX.md` scanpy.pl.StackedViolin.DEFAULT_SAVE_PREFIX
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.DEFAULT_STRIPPLOT.md` scanpy.pl.StackedViolin.DEFAULT_STRIPPLOT
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.DEFAULT_YLIM.md` scanpy.pl.StackedViolin.DEFAULT_YLIM
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.md` scanpy.pl.StackedViolin
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.style.md` scanpy.pl.StackedViolin.style
- `scanpy:api/generated/scanpy.pl.correlation_matrix.md` scanpy.pl.correlation_matrix
- `scanpy:api/generated/scanpy.pl.diffmap.md` scanpy.pl.diffmap
- `scanpy:api/generated/scanpy.pl.dpt_groups_pseudotime.md` scanpy.pl.dpt_groups_pseudotime
- `scanpy:api/generated/scanpy.pl.dpt_timeseries.md` scanpy.pl.dpt_timeseries
- `scanpy:api/generated/scanpy.pl.draw_graph.md` scanpy.pl.draw_graph
- `scanpy:api/generated/scanpy.pl.embedding.md` scanpy.pl.embedding
- `scanpy:api/generated/scanpy.pl.embedding_density.md` scanpy.pl.embedding_density
- `scanpy:api/generated/scanpy.pl.highest_expr_genes.md` scanpy.pl.highest_expr_genes
- `scanpy:api/generated/scanpy.pl.highly_variable_genes.md` scanpy.pl.highly_variable_genes
- `scanpy:api/generated/scanpy.pl.paga.md` scanpy.pl.paga
- `scanpy:api/generated/scanpy.pl.paga_compare.md` scanpy.pl.paga_compare
- `scanpy:api/generated/scanpy.pl.paga_path.md` scanpy.pl.paga_path
- `scanpy:api/generated/scanpy.pl.pca.md` scanpy.pl.pca
- `scanpy:api/generated/scanpy.pl.pca_loadings.md` scanpy.pl.pca_loadings
- `scanpy:api/generated/scanpy.pl.pca_overview.md` scanpy.pl.pca_overview
- `scanpy:api/generated/scanpy.pl.pca_variance_ratio.md` scanpy.pl.pca_variance_ratio
- `scanpy:api/generated/scanpy.pl.rank_genes_groups.md` scanpy.pl.rank_genes_groups
- `scanpy:api/generated/scanpy.pl.rank_genes_groups_dotplot.md` scanpy.pl.rank_genes_groups_dotplot
- `scanpy:api/generated/scanpy.pl.rank_genes_groups_heatmap.md` scanpy.pl.rank_genes_groups_heatmap
- `scanpy:api/generated/scanpy.pl.rank_genes_groups_matrixplot.md` scanpy.pl.rank_genes_groups_matrixplot
- `scanpy:api/generated/scanpy.pl.rank_genes_groups_stacked_violin.md` scanpy.pl.rank_genes_groups_stacked_violin
- `scanpy:api/generated/scanpy.pl.rank_genes_groups_tracksplot.md` scanpy.pl.rank_genes_groups_tracksplot
- `scanpy:api/generated/scanpy.pl.rank_genes_groups_violin.md` scanpy.pl.rank_genes_groups_violin
- `scanpy:api/generated/scanpy.pl.scrublet_score_distribution.md` scanpy.pl.scrublet_score_distribution
- `scanpy:api/generated/scanpy.pl.sim.md` scanpy.pl.sim
- `scanpy:api/generated/scanpy.pl.spatial.md` scanpy.pl.spatial
- `scanpy:api/generated/scanpy.pl.tsne.md` scanpy.pl.tsne
- `scanpy:api/generated/scanpy.pl.umap.md` scanpy.pl.umap
- `scanpy:api/generated/scanpy.pp.combat.md` scanpy.pp.combat
- `scanpy:api/generated/scanpy.pp.neighbors.md` scanpy.pp.neighbors
- `scanpy:api/generated/scanpy.pp.recipe_seurat.md` scanpy.pp.recipe_seurat
- `scanpy:api/generated/scanpy.pp.recipe_weinreb17.md` scanpy.pp.recipe_weinreb17
- `scanpy:api/generated/scanpy.pp.recipe_zheng17.md` scanpy.pp.recipe_zheng17
- `scanpy:api/generated/scanpy.pp.scrublet.md` scanpy.pp.scrublet
- `scanpy:api/generated/scanpy.pp.scrublet_simulate_doublets.md` scanpy.pp.scrublet_simulate_doublets
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.DEFAULT_COLORMAP.md` scanpy.pl.DotPlot.DEFAULT_COLORMAP
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.DEFAULT_COLOR_LEGEND_TITLE.md` scanpy.pl.DotPlot.DEFAULT_COLOR_LEGEND_TITLE
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.DEFAULT_COLOR_ON.md` scanpy.pl.DotPlot.DEFAULT_COLOR_ON
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.DEFAULT_DOT_EDGECOLOR.md` scanpy.pl.DotPlot.DEFAULT_DOT_EDGECOLOR
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.DEFAULT_DOT_EDGELW.md` scanpy.pl.DotPlot.DEFAULT_DOT_EDGELW
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.DEFAULT_DOT_MAX.md` scanpy.pl.DotPlot.DEFAULT_DOT_MAX
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.DEFAULT_DOT_MIN.md` scanpy.pl.DotPlot.DEFAULT_DOT_MIN
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.DEFAULT_LARGEST_DOT.md` scanpy.pl.DotPlot.DEFAULT_LARGEST_DOT
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.DEFAULT_LEGENDS_WIDTH.md` scanpy.pl.DotPlot.DEFAULT_LEGENDS_WIDTH
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.DEFAULT_PLOT_X_PADDING.md` scanpy.pl.DotPlot.DEFAULT_PLOT_X_PADDING
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.DEFAULT_PLOT_Y_PADDING.md` scanpy.pl.DotPlot.DEFAULT_PLOT_Y_PADDING
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.DEFAULT_SAVE_PREFIX.md` scanpy.pl.DotPlot.DEFAULT_SAVE_PREFIX
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.DEFAULT_SIZE_EXPONENT.md` scanpy.pl.DotPlot.DEFAULT_SIZE_EXPONENT
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.DEFAULT_SIZE_LEGEND_TITLE.md` scanpy.pl.DotPlot.DEFAULT_SIZE_LEGEND_TITLE
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.DEFAULT_SMALLEST_DOT.md` scanpy.pl.DotPlot.DEFAULT_SMALLEST_DOT
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.legend.md` scanpy.pl.DotPlot.legend
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.md` scanpy.pl.DotPlot
- `scanpy:api/generated/classes/scanpy.pl.DotPlot.style.md` scanpy.pl.DotPlot.style
- `scanpy:api/generated/classes/scanpy.pl.MatrixPlot.DEFAULT_COLORMAP.md` scanpy.pl.MatrixPlot.DEFAULT_COLORMAP
- `scanpy:api/generated/classes/scanpy.pl.MatrixPlot.DEFAULT_COLOR_LEGEND_TITLE.md` scanpy.pl.MatrixPlot.DEFAULT_COLOR_LEGEND_TITLE
- `scanpy:api/generated/classes/scanpy.pl.MatrixPlot.DEFAULT_EDGE_COLOR.md` scanpy.pl.MatrixPlot.DEFAULT_EDGE_COLOR
- `scanpy:api/generated/classes/scanpy.pl.MatrixPlot.DEFAULT_EDGE_LW.md` scanpy.pl.MatrixPlot.DEFAULT_EDGE_LW
- `scanpy:api/generated/classes/scanpy.pl.MatrixPlot.DEFAULT_SAVE_PREFIX.md` scanpy.pl.MatrixPlot.DEFAULT_SAVE_PREFIX
- `scanpy:api/generated/classes/scanpy.pl.MatrixPlot.md` scanpy.pl.MatrixPlot
- `scanpy:api/generated/classes/scanpy.pl.MatrixPlot.style.md` scanpy.pl.MatrixPlot.style
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.DEFAULT_COLORMAP.md` scanpy.pl.StackedViolin.DEFAULT_COLORMAP
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.DEFAULT_COLOR_LEGEND_TITLE.md` scanpy.pl.StackedViolin.DEFAULT_COLOR_LEGEND_TITLE
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.DEFAULT_CUT.md` scanpy.pl.StackedViolin.DEFAULT_CUT
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.DEFAULT_DENSITY_NORM.md` scanpy.pl.StackedViolin.DEFAULT_DENSITY_NORM
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.DEFAULT_INNER.md` scanpy.pl.StackedViolin.DEFAULT_INNER
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.DEFAULT_JITTER.md` scanpy.pl.StackedViolin.DEFAULT_JITTER
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.DEFAULT_JITTER_SIZE.md` scanpy.pl.StackedViolin.DEFAULT_JITTER_SIZE
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.DEFAULT_LINE_WIDTH.md` scanpy.pl.StackedViolin.DEFAULT_LINE_WIDTH
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.DEFAULT_PLOT_X_PADDING.md` scanpy.pl.StackedViolin.DEFAULT_PLOT_X_PADDING
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.DEFAULT_PLOT_YTICKLABELS.md` scanpy.pl.StackedViolin.DEFAULT_PLOT_YTICKLABELS
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.DEFAULT_PLOT_Y_PADDING.md` scanpy.pl.StackedViolin.DEFAULT_PLOT_Y_PADDING
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.DEFAULT_ROW_PALETTE.md` scanpy.pl.StackedViolin.DEFAULT_ROW_PALETTE
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.DEFAULT_SAVE_PREFIX.md` scanpy.pl.StackedViolin.DEFAULT_SAVE_PREFIX
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.DEFAULT_STRIPPLOT.md` scanpy.pl.StackedViolin.DEFAULT_STRIPPLOT
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.DEFAULT_YLIM.md` scanpy.pl.StackedViolin.DEFAULT_YLIM
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.md` scanpy.pl.StackedViolin
- `scanpy:api/generated/classes/scanpy.pl.StackedViolin.style.md` scanpy.pl.StackedViolin.style
{% enddropdown %}
