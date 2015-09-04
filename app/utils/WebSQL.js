// usage example:
//
//  var migartions = {
//    '1.0': "CREATE TABLE todos(ID INTEGER PRIMARY KEY, name TEXT);",
//    '1.1': "ALTER TABLE todos ADD done BOOLEAN NOT NULL DEFAULT FALSE;",
//    '2.0': "CREATE TABLE users(ID INTEGER PRIMARY KEY, name TEXT);",
//    '2.1': "ALTER TABLE todos ADD user_id INTEGER;",
//  }
//  var db = new WebSQL('TestDB', 'TestDB', 5*1024*1024, migartions);
//
//  db.migrate()
//    .then(function(db) { return db.executeSql('INSERT INTO users (id, name) VALUES (12, "foo")') } )
//    .then(function (result) { result.db.executeSql('INSERT INTO todos (user_id, name) VALUES (12, "task")') });
//
//  db.executeSql('INSERT INTO users (id, name) VALUES (18, "bar")')
//    .then(function (result) { return result.db.executeSql('INSERT INTO todos (user_id, name) VALUES (18, "task one")') })
//    .then(function (result) { return result.db.executeSql('INSERT INTO todos (user_id, name) VALUES (18, "task two")') });
//
//  db.executeSql('SELECT * FROM users LEFT OUTER JOIN todos ON todos.user_id = users.id WHERE users.id = 12').then(function (result) { console.log(result.results); });
//
//  db.executeSql('SELECT * FROM users LEFT OUTER JOIN todos ON todos.user_id = users.id WHERE users.id = ?', [18]).then(function (result) { console.log(result.results); });

class WebSQL {
  constructor(name, displayName, size, migrations) {
    this.db = window.openDatabase(name, '', displayName, size || 1024 * 1024);
    this.migrations = migrations;
  }

  migrate() {
    var fromVersionIndex = null;
    var currentVersion = this.db.version;
    var versions = Object.keys(this.migrations);
    var latestVersion = versions[versions.length - 1];

    if (currentVersion !== latestVersion) {

      if (!currentVersion || currentVersion === '' || currentVersion === 'null') {
        fromVersionIndex = -1;
      } else {
        console.log(versions, currentVersion)
        fromVersionIndex = versions.indexOf(currentVersion);

        if (fromVersionIndex === -1) {
          console.error(`WebSQL: migration error: Can't locate current version: ${currentVersion} in migrations stack: versions: [${versions.join(', ')}]`);
          return;
        }
      }

      var executeMigrationVersions = versions.slice(fromVersionIndex + 1);

      return executeMigrationVersions.reduce( (previousPromise, version) => {
        return previousPromise.then( () => {
          return new Promise( (resolve, reject) => {
            var lastVersion = versions[versions.indexOf(version) - 1];
            if (!lastVersion) lastVersion = currentVersion;
            this.db.changeVersion(lastVersion, version, (transaction) => {
              transaction.executeSql(this.migrations[version], null, () => {
                resolve();
              });
            });
          });
        });
      }, Promise.resolve(this));
    } else {
      return Promise.resolve(this);
    }
  }

  executeSql(sqlQuery, params = []) {
    return new Promise( (resolve, reject) => this.db.transaction( (t) => t.executeSql(sqlQuery, params, (transcation, results) => {
      resolve({ db: this, transcation: transcation, results: results });
    }) ) );
  }
}

window.WebSQL = WebSQL;

if (module) module.exports = WebSQL;
