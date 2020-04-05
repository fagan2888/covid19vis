import { dataSourceSettings } from "./ReportContext";
import countries from "./datasources/ISO-3166-Countries";

function resolveCountry(name) {
  const country = countries.find((c) => c.name === name);
  if (!country) {
    console.log(name);
    return {
      name: name,
      "alpha-2": null,
      "alpha-3": null
    };
  }
  return country;
}

export async function getLatestReport(daysOffset = 0) {
  dataSourceSettings.reportDate = new Date();
  dataSourceSettings.reportDate.setDate(
    dataSourceSettings.reportDate.getDate() - daysOffset
  );
  let dataSource = await getDailyReport(dataSourceSettings);
  if (!dataSource && daysOffset < 3) {
    daysOffset++;
    return await getLatestReport(daysOffset);
  }
  return dataSource;
}

export async function getDailyReport(dataSourceSettings) {
  const key = getFormattedDate(dataSourceSettings.reportDate, "-");
  const url = dataSourceSettings.url.replace("{reportDate}", key);
  const resp = await fetch(url, buildOptions());
  if (resp.ok) {
    const content = await resp.text();
    const dataTable = parseCSV(dataSourceSettings, content);
    dataTable.rows = groupBy(dataTable.rows, (item) => item.CountryRegion);
    dataTable.rows = transform(dataTable.rows);
    dataTable.properties = {
      ReportDate: dataSourceSettings.reportDate,
    };
    return dataTable;
  }
  return null;
}

function sum(items, prop) {
  return items.reduce(function (result, current) {
    return result + current[prop];
  }, 0);
}

function transform(data) {
  const result = Array.from(data).map(([k, v]) => {
    return {
      CountryRegion: v[0].CountryRegion,
      Confirmed: sum(v, "Confirmed"),
      Recovered: sum(v, "Recovered"),
      Deaths: sum(v, "Deaths"),
    };
  });
  return result;
}

function getFormattedDate(date, delimiter) {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, "0");
  let day = date.getDate().toString().padStart(2, "0");

  return [month, day, year].join(delimiter);
}

function parseCSV(settings, value) {
  let lines = value.split("\n");
  const columns = getColumns(settings, lines[0]);
  lines.shift();
  const rows = lines
    .map((line) => {
      return buildRow(settings, columns, line);
    })
    .filter((r) => r);
  return {
    columns: columns,
    rows: rows.filter((r) => r.CountryRegion),
  };
}

function getColumns(settings, value) {
  return value
    .split(",")
    .map((name, i) => {
      if (Object.keys(settings.columnNameMappings).includes(name)) {
        return {
          name: settings.columnNameMappings[name],
          index: i,
          type: "string",
        };
      }
      return null;
    })
    .filter((c) => c);
}

function buildRow(settings, columns, value) {
  if (value.length < 1) {
    return null;
  }

  value = value
    .split(",")
    .map((v) => {
      if (v.length === 0) v = "Undef";
      return v;
    })
    .join(",");
  let values = value.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
  let row = {};
  for (let column of columns) {
    row[column.name] = values[column.index];
  }
  return normalizeRow(settings, row);
}

function normalizeRow(settings, cells) {
  let countryVal = cells.CountryRegion;
  if (Object.keys(settings.countryMapping).includes(countryVal)) {
    cells.CountryRegion = settings.countryMapping[countryVal];
  }
  cells.CountryRegion = resolveCountry(cells.CountryRegion)

  for (let colName in settings.columnTypeMappings) {
    if (settings.columnTypeMappings[colName] === "number")
      cells[colName] = parseInt(cells[colName]);
  }
  return cells;
}

function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

function buildOptions(options) {
  options = options || {};
  options.headers = options.headers || {};
  options.headers["X-Requested-With"] = "XMLHttpRequest";
  return options;
}
