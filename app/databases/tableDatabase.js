import WebSQL from '../utils/WebSQL';
import colorgyAPI from '../utils/colorgyAPI';

var migartions = {
  '1.0': 'CREATE TABLE user_courses(uuid CHARACTER(255) PRIMARY KEY, user_id INTEGER, course_code CHARACTER(255), course_organization_code CHARACTER(255), year INTEGER, term INTEGER, deleted_at DATETIME, synced_at DATETIME);'
}

if (window.sqlitePlugin) {
  var tableDatabase = new WebSQL(null, null, null, migartions, sqlitePlugin, { name: 'table.db', location: 2 });
} else {
  var tableDatabase = new WebSQL('table', 'table', 3*1024*1024, migartions);
}

tableDatabase.migrate();

tableDatabase.syncUserCourses = (userID, orgCode, year = colorgyAPI.getCurrentYear(), term = colorgyAPI.getCurrentTerm()) => {
  var sqlValue = tableDatabase.sqlValue;

  return new Promise( (syncResolve, syncReject) => {
    // Get scoped data from DB
    tableDatabase.executeSql("SELECT * FROM user_courses WHERE user_id = ? AND course_organization_code = ? AND year = ? AND term = ?", [userID, orgCode, year, term]).then( (r) => {

      // Convert the results into an array
      var localDataCollection = [];
      if (r.results.rows.length) {
        for (let i=0; i<r.results.rows.length; i++) {
          let row = r.results.rows.item(i);
          localDataCollection.push(row);
        }
      }

      return localDataCollection;

    }).then( (localDataCollection) => {

      // Map the local data array into an object using its uuid as key
      var localDataCollectionObject = localDataCollection.reduce( (obj, item) => { obj[item.uuid] = item; return obj; }, {});

      // Get the remote data collection
      var remoteDataCollectionURL = `/me/user_courses.json?per_page=1000&filter[course_organization_code]=${orgCode}&filter[year]=${year}&filter[term]=${term}`;

      colorgyAPI.request({ url: remoteDataCollectionURL }).then( (response) => {

        var remoteDataCollection = response.body.map( (item) => {
          if (item.updated_at) item.updated_at = (new Date(item.updated_at)).getTime();
          if (item.created_at) item.created_at = (new Date(item.created_at)).getTime();
          return item;
        });

        // Clone the remoteDataCollection to record the finalDataCollection
        var finalDataCollection = remoteDataCollection.slice(0);

        // Map the remote data array into an object using its uuid as key
        var remoteDataCollectionObject = remoteDataCollection.reduce( (obj, item) => { obj[item.uuid] = item; return obj; }, {});

        // Filter out data that should be deleted on the remote server, and to be restore locally
        var deleteIDsOnRemote = localDataCollection.filter( (data) => {
          var remoteData = remoteDataCollectionObject[data.uuid];

          return (data.deleted_at &&
                 remoteData &&
                 (!remoteData.updated_at || remoteData.updated_at < data.deleted_at));

        }).map( (data) => data.uuid );

        finalDataCollection = finalDataCollection.filter( (data) => deleteIDsOnRemote.indexOf(data.uuid) < 0 );

        var restoreIDsOnLocal = localDataCollection.filter( (data) => {
          var remoteData = remoteDataCollectionObject[data.uuid];

          return (data.deleted_at &&
                  remoteData &&
                  (remoteData.updated_at && remoteData.updated_at > data.deleted_at));

        }).map( (data) => data.uuid );

        // Filter out data that should be created on remote
        var newLocalData = localDataCollection.filter( (data) => !data.synced_at );

        finalDataCollection = finalDataCollection.concat(newLocalData);

        console.log('tableDatabase: syncUserCourses: final data: ', finalDataCollection);

        // Do update!

        var remoteDeletePromise = new Promise( (resolve, reject) => {
          colorgyAPI.request({ method: 'DELETE', url: `/me/user_courses.json?filter[uuid]=${deleteIDsOnRemote.join(',')}` }).then( (response) => {
            if (response.statusType() == 2) {
              resolve(response);
            } else {
              reject(response);
            }
          }).catch( (e) => {
            reject(e);
          });
        });

        var remoteCreatePromise = newLocalData.reduce( (promise, data) => promise.then(new Promise( (resolve, reject) => {

          colorgyAPI.request({ method: 'PUT', url: `/me/user_courses/${data.uuid}.json`, json: true, body: { user_courses: data } }).then( (response) => {
            if (response.statusType() == 2) {
              resolve(response);
            } else {
              reject(response);
            }
          }).catch( (e) => {
            reject(e);
          });

        })), Promise.resolve());

        var insertSQLValues = [];
        finalDataCollection.forEach(function (data) {
          let updatedAt = (new Date()).getTime();

          insertSQLValues.push(`(
            ${sqlValue(data.uuid)},
            ${sqlValue(data.user_id)},
            ${sqlValue(data.year)},
            ${sqlValue(data.term)},
            ${sqlValue(data.course_organization_code)},
            ${sqlValue(data.course_code)},
            ${sqlValue(updatedAt)}
          )`);
        });

        var insertSQL = `INSERT INTO user_courses (
          uuid,
          user_id,
          year,
          term,
          course_organization_code,
          course_code,
          synced_at
        ) VALUES ${insertSQLValues.join(', ')}`;

        var localUpdatePromise = new Promise( (resolve, reject) => {
          tableDatabase.executeSql("DELETE FROM user_courses WHERE user_id = ? AND course_organization_code = ? AND year = ? AND term = ?", [userID, orgCode, year, term])
            .then( () => tableDatabase.executeSql(insertSQL) )
            .then( () => {
              resolve();
            })
            .catch( (e) => {
              reject(e);
            });
        });

        Promise.all([remoteDeletePromise, remoteCreatePromise, localUpdatePromise]).then( () => {
          syncResolve();
        }).catch( (e) => {
          console.error(e);
          syncReject(e);
        });

      }).catch( (e) => {
        console.error(e);
        syncReject(e);
      });

    }).catch( (e) => {
      console.error(e);
      syncReject(e);
    });
  });
}

tableDatabase.findUserCourses = (userID, orgCode, year = colorgyAPI.getCurrentYear(), term = colorgyAPI.getCurrentTerm()) => {
  if (typeof courseCodes === 'string') courseCodes = [courseCodes];

  return new Promise( (resolve, reject) => {
    tableDatabase.executeSql("SELECT * FROM user_courses WHERE user_id = ? AND course_organization_code = ? AND year = ? AND term = ?", [userID, orgCode, year, term]).then( (r) => {
      var userCourses = [];
      if (r.results.rows.length) {
        for (let i=0; i<r.results.rows.length; i++) {
          let row = r.results.rows.item(i);
          userCourses.push(row);
        }
      }
      resolve(userCourses);
    }).catch( (e) => {
      console.error(e);
      reject(e);
    })
  });
}

window.tableDatabase = tableDatabase;

export default tableDatabase;
