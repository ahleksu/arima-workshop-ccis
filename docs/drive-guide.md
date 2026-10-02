# Run the workshop notebooks from Google Drive

This folder holds everything you need for the ARIMA workshop. You run the notebooks in Google Colab, which is free. You do not install anything.

## What is in this folder

- `notebooks/`: seven notebooks, `00` to `06`. Each one already shows its results, so you can read it without running it.
- `data/`: the synthetic daily energy demand file, `energy_demand_daily.csv`, and a note on its source.
- `slides/`: the lecture slides as PDF and HTML.
- `guides/`: the agenda, the lecture guide, the glossary, and the take-home guides for your own research data.
- `requirements.txt`: the Python packages for a local install. Colab does not need it.

## Open a notebook in Colab

1. Upload this whole folder to Google Drive.
2. In Drive, open `notebooks` and right-click `01_fundamentals_stationarity.ipynb`.
3. Choose Open with, then Google Colaboratory.
4. If Google Colaboratory is not in the list, choose Connect more apps. Search for Colaboratory and install it.
5. In Colab, choose Runtime, then Run all.

Keep the runtime type on CPU. The notebooks do not use a GPU.

## Where the data comes from

Each notebook looks for `energy_demand_daily.csv` next to itself first. Then it downloads the file from the project page on GitHub. You need an internet connection for the download.

If the download fails, Colab shows a file picker. Choose `data/energy_demand_daily.csv` from your computer. The notebook then continues.

## The path for the session

You run three notebooks, in this order:

1. `01_fundamentals_stationarity.ipynb`
2. `02_ar_ma_acf_pacf.ipynb`
3. `03_arima_energy_demand.ipynb`

Notebooks `04`, `05`, and `06` are for after the session. Notebook `06` is a template for your own data.

## Free tier limits

Colab free tier gives about 12 GB of memory and 2 CPU cores. A session ends after a period of inactivity. If it ends, choose Runtime, then Run all again.

We ran every notebook on a laptop with the newest pandas, numpy, and statsmodels. The laptop has 14 CPU cores. Colab free tier has fewer, so expect Colab to be slower.

| Notebook | Run time on the laptop | Peak memory |
| --- | --- | --- |
| `00`, `01`, `02`, `03`, `06` | about 3 seconds each | under 300 MB |
| `04` | about 20 seconds | under 800 MB |
| `05` | about 2 minutes | under 600 MB |

We have not timed a run on Colab itself. Open and run notebooks `01` and `03` on Colab once before the session.

## If something goes wrong

- If a cell says `No module named statsmodels`, run the first code cell again. It installs the package.
- If the notebook `04` cell for `pmdarima` prints that the package is not available, continue. That cell is optional.
- If the runtime disconnects in the middle of a notebook, choose Runtime, then Run all.
