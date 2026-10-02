# Start here: run the workshop notebooks

This folder holds everything for the ARIMA workshop. You can run the notebooks in two ways. On Google Colab, which is free, you install nothing. On your own computer, you set up Python once.

## Pick a path

- Google Colab (path A): choose this if you have a Google account and an internet connection. It takes about one minute.
- Your own computer (path B): choose this if you want to work offline, or if your data must stay off Colab.

If you are not sure, choose path A.

## What is in this folder

- `notebooks/`: seven notebooks, `00` to `06`. Each one already shows its results, so you can read it without running it.
- `data/`: the synthetic daily energy demand file, `energy_demand_daily.csv`, and a note on its source.
- `slides/`: the lecture slides as PDF and HTML.
- `guides/`: the agenda, the lecture guide, the glossary, and the take-home guides for your own research data.
- `requirements.txt`, `setup.sh`, `setup.ps1`, `setup.bat`, and `scripts/check_env.py`: the setup for path B. Colab does not need them.

## The path for the session

You run one notebook, `03_arima_energy_demand.ipynb`, in three steps:

1. Prepare the series (sections 1 and 2).
2. Choose and fit (sections 3, 4, and 5).
3. Check and forecast (sections 7 and 8).

Notebooks `01` and `02` give background on stationarity, AR and MA, and the ACF and PACF. Read them before or after the session. Notebooks `04`, `05`, and `06` are for after the session. Notebook `06` is a template for your own data.

## Path A: Google Colab

Open a notebook from this table. Colab loads it from GitHub, so you do not need Drive.

| Notebook | Topic | Link |
| --- | --- | --- |
| `00_setup_check` | Package versions and a small ARIMA fit | [Open in Colab](https://colab.research.google.com/github/ahleksu/arima-workshop-ccis/blob/main/notebooks/00_setup_check.ipynb) |
| `01_fundamentals_stationarity` | Stationarity, the ADF test, and differencing | [Open in Colab](https://colab.research.google.com/github/ahleksu/arima-workshop-ccis/blob/main/notebooks/01_fundamentals_stationarity.ipynb) |
| `02_ar_ma_acf_pacf` | AR and MA processes, the ACF and PACF | [Open in Colab](https://colab.research.google.com/github/ahleksu/arima-workshop-ccis/blob/main/notebooks/02_ar_ma_acf_pacf.ipynb) |
| `03_arima_energy_demand` | Fit, select, and check an ARIMA model (the session notebook) | [Open in Colab](https://colab.research.google.com/github/ahleksu/arima-workshop-ccis/blob/main/notebooks/03_arima_energy_demand.ipynb) |
| `04_sarima_exogenous` | Seasonal terms and outside drivers | [Open in Colab](https://colab.research.google.com/github/ahleksu/arima-workshop-ccis/blob/main/notebooks/04_sarima_exogenous.ipynb) |
| `05_forecasting_validation` | Intervals, metrics, and backtests | [Open in Colab](https://colab.research.google.com/github/ahleksu/arima-workshop-ccis/blob/main/notebooks/05_forecasting_validation.ipynb) |
| `06_your_data_template` | The whole workflow on your own CSV file | [Open in Colab](https://colab.research.google.com/github/ahleksu/arima-workshop-ccis/blob/main/notebooks/06_your_data_template.ipynb) |

Then follow these steps:

1. Sign in to your Google account if Colab asks.
2. Choose Runtime, then Run all.

Keep the runtime type on CPU. The notebooks do not use a GPU.

To open the copy in your own Drive instead, follow these steps:

1. Upload this whole folder to Google Drive.
2. In Drive, open `notebooks` and right-click the notebook.
3. Choose Open with, then Google Colaboratory.
4. If Google Colaboratory is not in the list, choose Connect more apps. Search for Colaboratory and install it.

### Where the data comes from

Each notebook looks for `energy_demand_daily.csv` in `../data`, in `data`, and in its own folder. On Colab, none of these folders holds the file. The notebook then downloads the file from the project page on GitHub. You need an internet connection for the download.

If the download fails, Colab shows a file picker. Choose `data/energy_demand_daily.csv` from your computer. The notebook then continues.

## Path B: your own computer

You need Python 3.10 to 3.13. Python 3.12 is the tested version. If you have none of them, install one from https://www.python.org/downloads/ first.

1. Open a terminal in this folder. On Windows, open Command Prompt in this folder.
2. Run the setup script for your system.
   - On macOS and Linux, run `bash setup.sh`.
   - On Windows, run `setup.bat`.
3. Wait for the last line, "All required checks passed." The setup needs an internet connection and takes about one minute.
4. Start JupyterLab.
   - On macOS and Linux, run `.venv/bin/jupyter lab`.
   - On Windows, run `.\.venv\Scripts\jupyter lab`.
5. In JupyterLab, open the `notebooks` folder and open `03_arima_energy_demand.ipynb`.
6. If JupyterLab asks for a kernel (the Python environment that runs the notebook), choose ARIMA Workshop.
7. Choose Run, then Run All Cells.

Use `bash setup.sh` and not `./setup.sh`. A folder that you download from Drive can lose the permission to run files.

The setup script creates a virtual environment (a private folder of packages) named `.venv` in this folder. It installs the packages from `requirements.txt` and registers the ARIMA Workshop kernel. It then runs `scripts/check_env.py`, which fits a small model and reads the data file.

After the setup, the notebooks read the data from the `data` folder in this folder. They need no internet connection.

The Windows scripts are untested. If they fail, use path A.

## Free tier limits

Colab free tier gives about 12 GB of memory and 2 CPU cores. A session ends after a period of inactivity. If it ends, choose Runtime, then Run all again.

The times below come from a laptop with 14 CPU cores and the newest pandas, numpy, and statsmodels. Colab free tier has fewer cores, so expect Colab to be slower.

| Notebook | Run time on the laptop | Peak memory |
| --- | --- | --- |
| `00`, `01`, `02`, `03`, `06` | about 3 seconds each | under 300 MB |
| `04` | about 20 seconds | under 800 MB |
| `05` | about 2 minutes | under 600 MB |

## If something goes wrong

- If a cell says `No module named statsmodels` on Colab, run the first code cell again. It installs the package.
- If a cell says `No module named statsmodels` on your computer, run the setup script again.
- If `./setup.sh` says "permission denied", run `bash setup.sh`.
- If the setup script prints "Setup failed during", read the step name under it. Then use path A.
- If the script says that it found no Python 3.10 to 3.13, install one from https://www.python.org/downloads/ and run the script again.
- If the notebook `04` cell for `pmdarima` prints that the package is not available, continue. That cell is optional.
- If the Colab runtime disconnects in the middle of a notebook, choose Runtime, then Run all.
