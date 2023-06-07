function getAverages(item) {
    const answer = item.getResponse();
    const type = item.getItem().getType();
    if (type === FormApp.ItemType.PARAGRAPH_TEXT) {
      averages = getAveragesFromStrText(answer);
      countParagraph();
    } else if (type === FormApp.ItemType.FILE_UPLOAD) {
        const fileBlob = DriveApp.getFileById(answer).getBlob();
        if(fileBlob.getContentType() === 'application/pdf') {
          const string = extractPdfText(answer);
          averages = getAveragesFromPdfText(string);
          countPdf();
        }
      }
    return averages;
  }
  
  function getAveragesFromPdfText(text) {
    // Define the regular expression patterns to match course codes, years, and grades
    const yearsRegex = /((Automne|Hiver|Été) 20\d{2})/g;
    const codeRegex = /([A-Z][A-Z][A-Z] \d{4,5}[A-Z]? )/g;
    const gradeRegex = /( [ABCDEF][+-]? |( AC | CMP | EXE | REM | ABA | \(E\) | INC | \(S\) | ACC | EF | ND | SE | AJ | EPR | R | SN | ATN | EQV | REF ))/g;
  
    // Find years and split semesters
    const semesterYears = text.match(yearsRegex);
    const semesters = text.split(yearsRegex);
  
    const averages = {};
    let yearCount = 0;
  
    // Find class lines and split them
    for (let semester of semesters) {
      const codeMatches = semester.match(codeRegex);
      if (!codeMatches) {
        continue;
      }
      let classCount = 0;
      const classRegex = new RegExp(codeMatches.join("|"), "g");
      const classLines = semester.split(classRegex);
  
      // Find averages and map them
      for (const classLine of classLines) {
        let gradeMatches = classLine.match(gradeRegex);
        if (!gradeMatches) {
          continue;
        }
        // Average is the second grade
        let average = gradeMatches.length == 2 ? gradeMatches[1].trim() : null;
        
        if (!average) {
          classCount++;
          continue;
        }
        const year = semesterYears[yearCount].replace('É', 'E')
        const semester = year.charAt(0) + year.slice(-2);
        if (!averages[semester]) {
          averages[semester] = {};
        }
        averages[semester][codeMatches[classCount]] = average;
        classCount++;
      }
      yearCount++;
    }
    return averages;
  }
  
  function getAveragesFromStrText(text) {
    // Define regular expression patterns to match years, course codes, and grades
    const yearRegex = /(A|H|E|É) ?\d{2}?/g;
    const codeRegex = /([A-Z]{3} ?\d{4,5}[A-Z]?)/g;
    const gradeRegex = /((?<![a-zA-Z0-9])[ABCDEF](?![a-zA-Z0-9])[+-]?)/g;
  
    // Find years and split sections by year
    const years = text.match(yearRegex);
    const sections = text.split(yearRegex);
  
    let averages = {};
    let yearCount = 0;
    
    // Map grades to course codes and semesters
    for (const section of sections) {
      if (!section || section.length < 3) {
        continue;
      }
      const codeMatches = section.match(codeRegex);
      const gradeMatches = section.match(gradeRegex);
      const year = years[yearCount].replace('É', 'E');
      
      // Map each grade to its course code and semester
      for (let i = 0; i < codeMatches.length; i++) {
        const courseCode = codeMatches[i].replace(/\s+/g, '');
        const grade = gradeMatches[i];
        if (!averages[year]) {
          averages[year] = {};
        }
        averages[year][courseCode] = grade;
      }
      yearCount++;
    }
    return averages;
  }
  
  function addCourseLink(courseCode) {
    var text = '=HYPERLINK("' + "https://admission.umontreal.ca/cours-et-horaires/cours/" + courseCode + '"; "' + courseCode + '")'
    return text
  }
  
  function getNumericalGrade(letterGrade) {
    let numericalGrade;
    switch (letterGrade) {
      case 'A+':
        numericalGrade = 4.3;
        break;
      case 'A':
        numericalGrade = 4.0;
        break;
      case 'A-':
        numericalGrade = 3.7;
        break;
      case 'B+':
        numericalGrade = 3.3;
        break;
      case 'B':
        numericalGrade = 3.0;
        break;
      case 'B-':
        numericalGrade = 2.7;
        break;
      case 'C+':
        numericalGrade = 2.3;
        break;
      case 'C':
        numericalGrade = 2.0;
        break;
      case 'C-':
        numericalGrade = 1.7;
        break;
      case 'D+':
        numericalGrade = 1.3;
        break;
      case 'D':
        numericalGrade = 1.0;
        break;
      case 'E':
        numericalGrade = 0.5;
        break;
      case 'F':
        numericalGrade = 0.0;
        break;
    }
    return numericalGrade
  }