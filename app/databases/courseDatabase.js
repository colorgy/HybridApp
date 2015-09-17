import WebSQL from '../utils/WebSQL';
import colorgyAPI from '../utils/colorgyAPI';

var migartions = {
  '1.0': 'CREATE TABLE info(ID INTEGER PRIMARY KEY, key TEXT, value TEXT);',
  '1.1': 'CREATE INDEX info_key_index ON info (key);',
  '2.1': 'CREATE TABLE courses(ID INTEGER PRIMARY KEY, code CHARACTER(255), general_code CHARACTER(255), full_semester TINYINT, year SMALLINT, term TINYINT, name CHARACTER(255), name_en CHARACTER(255), lecturer CHARACTER(255), credits TINYINT, required TINYINT, url CHARACTER(255), website CHARACTER(255), prerequisites CHARACTER(255), day_1 TINYINT, day_2 TINYINT, day_3 TINYINT, day_4 TINYINT, day_5 TINYINT, day_6 TINYINT, day_7 TINYINT, day_8 TINYINT, day_9 TINYINT, period_1 TINYINT, period_2 TINYINT, period_3 TINYINT, period_4 TINYINT, period_5 TINYINT, period_6 TINYINT, period_7 TINYINT, period_8 TINYINT, period_9 TINYINT, location_1 CHARACTER(255), location_2 CHARACTER(255), location_3 CHARACTER(255), location_4 CHARACTER(255), location_5 CHARACTER(255), location_6 CHARACTER(255), location_7 CHARACTER(255), location_8 CHARACTER(255), location_9 CHARACTER(255), students_enrolled SMALLINT);',
  '2.2': 'ALTER TABLE courses ADD COLUMN search_keywords TEXT;',
  '2.3': 'CREATE TABLE period_data("order" INTEGER PRIMARY KEY, code CHARACTER(255), time CHARACTER(255));'
};

if (window.sqlitePlugin) {
  var courseDatabase = new WebSQL(null, null, null, migartions, sqlitePlugin, { name: 'course.db', location: 2, androidDatabaseImplementation: (window.sqlitePluginAndroidDatabaseImplementation || 1) });
} else {
  var courseDatabase = new WebSQL('course', 'course', 3*1024*1024, migartions);
}

courseDatabase.migrate();

courseDatabase.updateData = (orgCode, courseYear = colorgyAPI.getCurrentYear(), courseTerm = colorgyAPI.getCurrentTerm(), progressCallback) => {
  var sqlValue = courseDatabase.sqlValue;

  return new Promise( (updateResolve, updateReject) => {

    var requestPromises = [];
    var remainingPages = 100;

    function requestAndSaveCourses(url, iterateDoneCallback = () => {}, firstRequest = true) {
      // Fire request then deal with it
      var request = colorgyAPI.request({ url: url }).then((response) => {

        // If the organization has no course data
        if (response.status == 404) {
          updateReject(404);

        } else {
          if (firstRequest) remainingPages = parseInt(response.headers['x-pages-count']);
          var totalPages = parseInt(response.headers['x-pages-count']);
          // Iterate through each next page
          if (response.headers.link) {
            var nextURLMatch = response.headers.link.match(/<([^>]+)>; ?rel="next"/);

            // if next page given
            if (nextURLMatch && nextURLMatch[1]) {
              requestAndSaveCourses(nextURLMatch[1], iterateDoneCallback, false);

            // or if this is the last page
            } else {
              iterateDoneCallback();
            }
          }

          // Parse the data and construct SQL insert query
          var insertSQLValues = [];
          response.body.forEach(function (course) {
            let searchKeywords = `${course.code} ${course.general_code} ${course.name} ${course.name_en} ${course.lecturer}`;

            insertSQLValues.push(`(
              ${sqlValue(course.code)},
              ${sqlValue(course.general_code)},
              ${sqlValue(course.full_semester)},
              ${sqlValue(course.year)},
              ${sqlValue(course.term)},
              ${sqlValue(course.name)},
              ${sqlValue(course.name_en)},
              ${sqlValue(course.lecturer)},
              ${sqlValue(course.credits)},
              ${sqlValue(course.required)},
              ${sqlValue(course.url)},
              ${sqlValue(course.website)},
              ${sqlValue(course.prerequisites)},
              ${sqlValue(course.day_1)},
              ${sqlValue(course.day_2)},
              ${sqlValue(course.day_3)},
              ${sqlValue(course.day_4)},
              ${sqlValue(course.day_5)},
              ${sqlValue(course.day_6)},
              ${sqlValue(course.day_7)},
              ${sqlValue(course.day_8)},
              ${sqlValue(course.day_9)},
              ${sqlValue(course.period_1)},
              ${sqlValue(course.period_2)},
              ${sqlValue(course.period_3)},
              ${sqlValue(course.period_4)},
              ${sqlValue(course.period_5)},
              ${sqlValue(course.period_6)},
              ${sqlValue(course.period_7)},
              ${sqlValue(course.period_8)},
              ${sqlValue(course.period_9)},
              ${sqlValue(course.location_1)},
              ${sqlValue(course.location_2)},
              ${sqlValue(course.location_3)},
              ${sqlValue(course.location_4)},
              ${sqlValue(course.location_5)},
              ${sqlValue(course.location_6)},
              ${sqlValue(course.location_7)},
              ${sqlValue(course.location_8)},
              ${sqlValue(course.location_9)},
              ${sqlValue(course.students_enrolled)},
              ${sqlValue(searchKeywords)}
            )`);
          });

          var insertSQL = `INSERT INTO courses (
            code,
            general_code,
            full_semester,
            year,
            term,
            name,
            name_en,
            lecturer,
            credits,
            required,
            url,
            website,
            prerequisites,
            day_1,
            day_2,
            day_3,
            day_4,
            day_5,
            day_6,
            day_7,
            day_8,
            day_9,
            period_1,
            period_2,
            period_3,
            period_4,
            period_5,
            period_6,
            period_7,
            period_8,
            period_9,
            location_1,
            location_2,
            location_3,
            location_4,
            location_5,
            location_6,
            location_7,
            location_8,
            location_9,
            students_enrolled,
            search_keywords
          ) VALUES ${insertSQLValues.join(', ')}`;

          return new Promise( (resolve, reject) => {
            courseDatabase.executeSql(insertSQL)
              .then( () => {
                remainingPages--;
                let progress = (totalPages - remainingPages) / totalPages;
                if (progressCallback) progressCallback(progress);

                resolve();

              }).catch( (e) => {
                console.error(e);
                updateReject(e);
              });

          }).catch( (e) => {
            console.error(e);
            updateReject(e);
          });
        }
      }).catch( (e) => {
        console.error(e);
        updateReject(e);
      });

      requestPromises.push(request);
      return request;
    }

    // Clear the database and fire first request
    var firstRequestPromise = new Promise( (resolve, reject) => {
      const sql = `DELETE FROM courses WHERE year = ${courseYear} AND term = ${courseTerm}`;
      console.log(sql);
      courseDatabase.executeSql(sql)
        .then(function () {
          requestAndSaveCourses(`/${orgCode.toLowerCase()}/courses?filter[year]=${courseYear}&filter[term]=${courseTerm}&per_page=500`, resolve);
        });
    });

    // Get period data
    var periodDataRequestPromise = new Promise( (resolve, reject) => {
      courseDatabase.executeSql('DELETE FROM period_data')
        .then( () => {
          const url = `/${orgCode.toLowerCase()}/period_data?per_page=500`;
          colorgyAPI.request({ url: url }).then( (response) => {

            // If the organization has no course data
            if (response.status == 404) {
              updateReject(404);

            } else {
              // Parse the data and construct SQL insert query
              var insertSQLValues = response.body.map(function (period) {
                return `(
                  ${sqlValue(period.order)},
                  ${sqlValue(period.code)},
                  ${sqlValue(period.time)}
                )`;
              });

              var insertSQL = `INSERT INTO period_data (
                "order",
                code,
                time
              ) VALUES ${insertSQLValues.join(', ')}`;

              courseDatabase.executeSql(insertSQL)
                .then( () => {
                  resolve();
                }).catch( (e) => {
                  console.error(e);
                  updateReject(e);
                  reject(e);
                });
            }
          });
        }, (e) => {
          console.error(e);
          reject(e);
        }).catch( (e) => {
          console.error(e);
          reject(e);
        });
    });

    requestPromises.push(periodDataRequestPromise);

    // Wait for all request to be done, then resolve the update
    firstRequestPromise.then( () => {
      Promise.all(requestPromises).then( () => {
        courseDatabase.executeSql(`INSERT OR REPLACE INTO info (ID, key, value) VALUES ((SELECT ID FROM info WHERE key = '${courseYear}_${courseTerm}_courses_updated_at'), '${courseYear}_${courseTerm}_courses_updated_at' ,` + (new Date()).getTime() + ")");
        updateResolve();

      }).catch( (e) => {
        console.error(e);
        updateReject(e);
      });

    }).catch( (e) => {
      console.error(e);
      updateReject(e);
    });
  });
};

courseDatabase.getDataUpdatedTime = (courseYear = colorgyAPI.getCurrentYear(), courseTerm = colorgyAPI.getCurrentTerm()) => {
  return courseDatabase.executeSql(`SELECT * FROM info WHERE key = '${courseYear}_${courseTerm}_courses_updated_at'`).then((r) => {
    if (!r.results.rows.length) return null;
    return parseInt(r.results.rows.item(0).value);
  });
};

// courseDatabase.updateDataIfOlderThen = (seconds, orgCode, courseYear = colorgyAPI.getCurrentYear(), courseTerm = colorgyAPI.getCurrentTerm()) => {
//   return new Promise( (resolve, reject) => {
//     courseDatabase.getDataUpdatedTime(courseYear, courseTerm).then((updatedTime) => {
//       if (updatedTime) resolve();

//       if (!updatedTime || ((new Date()).getTime() - updatedTime) / 1000 > seconds) {
//         courseDatabase.updateData(orgCode, courseYear, courseTerm).then(() => {
//           if (!updatedTime) resolve();
//         }).catch((e) => {
//           console.error(e);
//           if (!updatedTime) reject(e);
//         });
//       }
//     });
//   });
// };

courseDatabase.getPeriodData = (returnObject = false) => {

  return new Promise( (resolve, reject) => {
    courseDatabase.executeSql('SELECT * FROM period_data').then( (r) => {

      if (returnObject) {
        var periodData = {};

        if (r.results.rows.length) {
          for (let i=0; i<r.results.rows.length; i++) {
            let row = r.results.rows.item(i);
            periodData[row.order] = row;
          }
        }

      } else {
        var periodData = [];

        if (r.results.rows.length) {
          for (let i=0; i<r.results.rows.length; i++) {
            let row = r.results.rows.item(i);
            periodData.push(row);
          }
        }
      }

      resolve(periodData);
    }).catch( (e) => {
      console.error(e);
      reject(e);
    });
  });
};

function parseCourseRows (rows, periodData) {
  var courses = {};

  for (let i=0; i<rows.length; i++) {
    let row = rows.item(i);
    row.fullSemester = row.full_semester;
    row.studentsEnrolled = row.students_enrolled;
    let times = [];
    for (let i=1; i<10; i++) {
      if (row[`day_${i}`] && row[`period_${i}`]) {
        let day = '';
        let periodCode = '';
        switch (row[`day_${i}`]) {
          case 1:
            day = 'Mon';
            break;
          case 2:
            day = 'Tue';
            break;
          case 3:
            day = 'Wed';
            break;
          case 4:
            day = 'Thu';
            break;
          case 5:
            day = 'Fri';
            break;
          case 6:
            day = 'Sat';
            break;
          case 7:
            day = 'Mon';
            break;
        }
        if (periodData[row[`period_${i}`]]) periodCode = periodData[row[`period_${i}`]].code;
        times.push(day + periodCode);
      }
    }
    row.times = times.join(' ');
    courses[row.code] = row;
  }

  return courses;
}

courseDatabase.findCourses = (courseCodes) => {
  if (typeof courseCodes === 'string') {
    courseCodes = [courseCodes];
  }

  return new Promise( (resolve, reject) => {
    courseDatabase.getPeriodData(true).then( (periodData) => {
      courseDatabase.executeSql(`SELECT * FROM courses WHERE code IN ('${courseCodes.join("', '")}')`).then( (r) => {
        var courses = {};
        if (r.results.rows.length) {
          courses = parseCourseRows(r.results.rows, periodData);
        }
        resolve(courses);
      }).catch( (e) => {
        console.error(e);
        reject(e);
      });
    }).catch( (e) => {
      console.error(e);
      reject(e);
    });
  });
};

courseDatabase.searchCourse = (query, courseYear = colorgyAPI.getCurrentYear(), courseTerm = colorgyAPI.getCurrentTerm()) => {
  query = query.replace(/[ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙㄧㄨㄩㄚㄛㄜㄝㄞㄟㄠㄡㄢㄣㄤㄥㄦˊˇˋ˙]/mg, '');

  return new Promise( (resolve, reject) => {
    if (query.length < 2) {
      resolve({});
      return;
    }

    courseDatabase.getPeriodData(true).then( (periodData) => {
      courseDatabase.executeSql(`SELECT * FROM courses WHERE year = ${courseYear} AND term = ${courseTerm} AND search_keywords LIKE '%${query}%' LIMIT 25`).then( (r) => {
        var courses = {};
        if (r.results.rows.length) {
          for (let i=0; i<r.results.rows.length; i++) {
            courses = parseCourseRows(r.results.rows, periodData);
          }
        }
        resolve(courses);
      }).catch( (e) => {
        console.error(e);
        reject(e);
      });

    }).catch( (e) => {
      console.error(e);
      reject(e);
    });
  });
};

window.courseDatabase = courseDatabase;

export default courseDatabase;
