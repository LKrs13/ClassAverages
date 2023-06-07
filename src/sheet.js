function addAverages(averages) {
    const sheetId = '';
    const sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
    const existingRows = sheet.getDataRange().getValues();
    const nonDuplicateRows = getNonDuplicateRows(averages, existingRows);
    const newRows = processNewRows(nonDuplicateRows);
    addNewRowsToSheet(sheet, existingRows, newRows);
    sortSheet(sheet);
  }
  
  function getNonDuplicateRows(averages, existingRows) {
    const rowSet = new Set(existingRows.map(row => JSON.stringify([row[0], row[1], row[2]])));
  
    // Format averages to sheet rows
    const rows = Object.entries(averages)
      .flatMap(([semester, courseGrades]) =>
        Object.entries(courseGrades).map(([course, grade]) => {
          course = course.replace(/\s+/g, '')
          const courseCode = course.slice(0, 3) + "-" + course.slice(3);
          return [courseCode, semester, grade];
        })
      )
    return rows.filter(row => !rowSet.has(JSON.stringify([row[0], row[1], row[2]])));
  }
  
  function processNewRows(nonDuplicateRows) {
    return nonDuplicateRows.map((row) => {
      [courseCode, semester, grade] = row;
      const classUrl = "https://admission.umontreal.ca/cours-et-horaires/cours/" + courseCode;
      const [credits, cycle] = getCreditsAndCycle(classUrl);
      return [addCourseLink(courseCode), semester, grade, getNumericalGrade(grade), credits, cycle];
    }).filter(row => row.every(val => val != null));
  }
  
  function addNewRowsToSheet(sheet, existingRows, newRows) {
    if (newRows.length > 0) {
      try {
        LockService.getScriptLock().waitLock(900000);
      } catch (e) {
        Logger.log('Could not obtain lock after 15 minutes.');
      }
      sheet.getRange(existingRows.length + 1, 1, newRows.length, newRows[0].length).setValues(newRows);
    }
  }
  
  function sortSheet(sheet) {
    const range = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
    const SORT_ORDER = [
      {column: 1, ascending: true},
      {column: 2, ascending: true},
      {column: 3, ascending: true},
      {column: 4, ascending: true}
    ];
    range.sort(SORT_ORDER);
  }
  
  function countPdf() {
    const sheetId = '';
    const sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
    let currentValue = sheet.getRange("A2").getValue();
    let newValue = currentValue + 1;
    sheet.getRange("A2").setValue(newValue);
  }
  
  function countParagraph() {
    const sheetId = '';
    const sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
    let currentValue = sheet.getRange("B2").getValue();
    let newValue = currentValue + 1;
    sheet.getRange("B2").setValue(newValue);
    }