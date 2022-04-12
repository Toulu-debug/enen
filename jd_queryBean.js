!(async () => {
  const qb = require('./utils/queryBean')
  let s = await qb.queryBean()
  if (process.env.JD_USERNAME_PRIVATE) {
    if (process.env.JD_USERNAME_PRIVATE.toLowerCase() === 'true') {
      s.forEach((value, index, array) => {
        array[index].name = (index + 1).toString()
      })
    }
  }
  table(s)
})()

function table(rows) {
  const ConsoleGrid = require("console-grid");
  const consoleGrid = new ConsoleGrid();

  const data = {
    columns: [{
      id: "name",
      name: `Name`,
      type: "string",
      minWidth: 20,
      maxWidth: 50
    }, {
      id: "In",
      type: "number",
      name: "In",
      minWidth: 10,
      align: "right"
    }, {
      id: "Out",
      type: "number",
      name: "Out",
      minWidth: 10,
      align: "right"
    }],
    rows: rows
  };
  consoleGrid.render(data);
}