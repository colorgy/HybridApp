import { createAction } from 'redux-actions';
import store from '../store';
import colorgyAPI from '../utils/colorgyAPI';
import courseDatabase from '../databases/courseDatabase';

export const checkCourseDatabaseDone = createAction('CHECK_COURSE_DATABASE_DONE');
export const updateCourseDatabase = createAction('UPDATE_COURSE_DATABASE');
export const courseDatabaseUpdated = createAction('COURSE_DATABASE_UPDATED');
export const courseDatabaseUpdateFaild = createAction('COURSE_DATABASE_UPDATE_FAILD');
export const userHasNoOrganization = createAction('USER_HAS_NO_ORGANIZATION');
export const organizationHasNoCourseData = createAction('ORGANIZATION_HAS_NO_COURSE_DATA');

export const checkCourseDatabase = () => dispatch => {
  // Check the database update time
  courseDatabase.executeSql("SELECT * FROM info WHERE key = 'current_courses_updated_at'")
    .then(function (result) {
      // if the database has been updated within 6 hours
      if (result.results.rows.length && result.results.rows[0] && ((new Date()) - parseInt(result.results.rows[0].value)) / (60*60*1000) < 6) {
        // dispatch the updated action to update the DB update time in the store
        dispatch(courseDatabaseUpdated(parseInt(result.results.rows[0].value)));

      } else {
        // update the DB
        dispatch(doUpdateCourseDatabase());
      }

      dispatch(checkCourseDatabaseDone());
    });
};

export const doUpdateCourseDatabase = (courseYear = colorgyAPI.getCurrentYear(), courseTerm = colorgyAPI.getCurrentTerm()) => dispatch => {
  dispatch(updateCourseDatabase());
  var orgCode = store.getState().appUser.possible_organization_code;

  function sqlValue(value) {
    if (value === true) {
      return 1;
    } else if (value === false) {
      return 0;
    } else if (typeof value === "string") {
      return "'" + value.replace("'", "''") + "'";
    } else if (typeof value === "number") {
      return value;
    } else {
      return 'NULL';
    }
  }

  if (orgCode) {
    var requestPromises = [];

    function requestAndSaveCourses(url, iterateDoneCallback = () => {}, firstRequest = true) {
      // Fire request then deal with it
      var request = colorgyAPI.request({ url: url }).then( (response) => {

        // If the organization has no course data
        if (response.status == 404) {
          dispatch(organizationHasNoCourseData());

        } else {
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
                resolve();
              }).catch( (e) => {
                dispatch(courseDatabaseUpdateFaild(e));
              });
          }).catch( (e) => {
            dispatch(courseDatabaseUpdateFaild(e));
          });
        }
      }).catch( (e) => {
        dispatch(courseDatabaseUpdateFaild(e));
      });

      requestPromises.push(request);
      return request;
    }

    // Clear the database and fire first request
    var firstRequestPromise = new Promise( (resolve, reject) => {
      let sql = `DELETE FROM courses WHERE year = ${courseYear} AND term = ${courseTerm}`;
      console.log(sql);
      courseDatabase.executeSql(sql)
        .then(function () {
          requestAndSaveCourses(`/${orgCode.toLowerCase()}/courses?filter[year]=${courseYear}&filter[term]=${courseTerm}&per_page=500`, resolve);
        });
    });

    // Wait for all request to be done, then dispatch the done action
    firstRequestPromise.then( () => {
      Promise.all(requestPromises).then( () => {
        courseDatabase.executeSql("INSERT OR REPLACE INTO info (ID, key, value) VALUES ((SELECT ID FROM info WHERE key = 'current_courses_updated_at'), 'current_courses_updated_at' ," + (new Date()).getTime() + ")");
        dispatch(courseDatabaseUpdated((new Date()).getTime()));
      });
    }).catch( (e) => {
      dispatch(courseDatabaseUpdateFaild(e));
    });

  // If the app user has no organization
  } else {
    dispatch(userHasNoOrganization());
  }
};

export const searchCurrentCourses = (query) => dispatch => {
  courseDatabase.executeSql('SELECT * FROM info WHERE key = "updated_at"').then( (r) => {
    if (r.results.rows.length) {
      dispatch(updateCourseDatabase());
      var orgCode = store.getState().appUser.possible_organization_code;
    }
  })
};
