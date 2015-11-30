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
//  db.migrate();
//
//  db.executeSql('INSERT INTO users (id, name) VALUES (18, "bar")')
//    .then(function (result) { return result.db.executeSql('INSERT INTO todos (user_id, name) VALUES (18, "task one")') })
//    .then(function (result) { return result.db.executeSql('INSERT INTO todos (user_id, name) VALUES (18, "task two")') });
//
//  db.executeSql('SELECT * FROM users LEFT OUTER JOIN todos ON todos.user_id = users.id WHERE users.id = 12').then(function (result) { console.log(result.results); });
//
//  db.executeSql('SELECT * FROM users LEFT OUTER JOIN todos ON todos.user_id = users.id WHERE users.id = ?', [18]).then(function (result) { console.log(result.results); });

class WebSQL {
  constructor(name, displayName, size, migrations, provider = window, customConstructObject = null) {
    if (customConstructObject) {
      this.db = provider.openDatabase(customConstructObject);
    } else {
      this.db = provider.openDatabase(name, '', displayName, size || 1024 * 1024);
    }
    this.dbName = name;
    this.migrations = migrations;
    let migrationKeys = Object.keys(migrations);
    this.migrationsLastVerison = migrationKeys[migrationKeys.length - 1];

    this.executeSql("CREATE TABLE IF NOT EXISTS _db_info_(key CHAR(255) PRIMARY KEY, value TEXT)", null, false).then( (result) => {
      this.executeSql("SELECT * FROM _db_info_ WHERE key = 'schema_verison'", null, false).then( (result) => {
        if (result.results.rows.length && result.results.rows.item(0)) {
          this.version = result.results.rows.item(0).value;
        }
      });
    });
  }

  migrate() {

    var migrateDB = (currentVersion) => {
      var fromVersionIndex = null;
      var versions = Object.keys(this.migrations);
      var latestVersion = versions[versions.length - 1];

      if (currentVersion !== latestVersion) {

        if (!currentVersion || currentVersion === '' || currentVersion === 'null') {
          fromVersionIndex = -1;
        } else {
          fromVersionIndex = versions.indexOf(currentVersion);

          if (fromVersionIndex === -1) {
            console.error(`WebSQL: migration error: Can't locate current version: ${currentVersion} in migrations stack: versions: [${versions.join(', ')}]`);
            return;
          }
        }

        var executeMigrationVersions = versions.slice(fromVersionIndex + 1);

        return executeMigrationVersions.reduce( (previousPromise, version) => {
          console.log(`WebSQL: database migration required: ${this.dbName}: to ${version}`);
          return previousPromise.then( () => {
            return new Promise( (resolve, reject) => {
              var lastVersion = versions[versions.indexOf(version) - 1];
              if (!lastVersion) lastVersion = currentVersion;
              console.log(`WebSQL: migrating database ${this.dbName} from ${lastVersion} to ${version}`);
              this.db.transaction( (transaction) => {
                transaction.executeSql(this.migrations[version], null, () => {
                  transaction.executeSql("INSERT OR REPLACE INTO _db_info_ (key, value) VALUES ('schema_verison' , ?)", [version], () => {
                    this.version = version;
                    resolve(this);
                  }, (t, e) => {
                    console.error(e);
                    reject(e);
                  });
                }, (t, e) => {
                  console.error(e);
                  reject(e);
                });
              });
            });
          });
        }, Promise.resolve(this));
      } else {
        return Promise.resolve(this);
      }
    }

    return this.executeSql("CREATE TABLE IF NOT EXISTS _db_info_(key CHAR(255) PRIMARY KEY, value TEXT)", null, false).then( (result) => {

      return this.executeSql("SELECT * FROM _db_info_ WHERE key = 'schema_verison'", null, false).then( (result) => {
        var schemaVerison = null;
        if (result.results.rows.length && result.results.rows.item(0)) {
          schemaVerison = result.results.rows.item(0).value;
        }

        return migrateDB(schemaVerison);
      });
    });
  }

  executeSql(sqlQuery, params = [], ensureMigrated = true) {
    return new Promise( (resolve, reject) => {
      if (ensureMigrated) var startedAt = (new Date());

      var execute = () => {
        if (ensureMigrated) {
          if (this.version != this.migrationsLastVerison) {
            console.log(`WebSQL: ${this.dbName}: executeSql: Watitig for migration done...`)
            if ((new Date()) - startedAt > 12000) {
              reject({ error: 'Migration Timeout' })
            } else {
              setTimeout(execute, 100)
            }
            return;
          }
        }

        this.db.transaction( (t) => t.executeSql(sqlQuery, params, (transaction, results) => {
          resolve({ db: this, transaction: transaction, results: results });
        }, (transaction, error) => {
          reject({ db: this, transaction: transaction, error: error, query: sqlQuery });
        }) );
      }

      execute();
    });
  }

  reset() {
    return new Promise( (resolve, reject) => {
      this.executeSql("SELECT 'DROP TABLE ' || name || ';' FROM sqlite_master WHERE type = 'table';")
        .then( (result) => {
          var rows = result.results.rows;

          var dropTablesQueries = [];
          for (let i=0; i< rows.length; i++) {
            let row = rows.item(i);
            let keys = Object.keys(row);
            dropTablesQueries.push(row[keys[0]]);
          }

          dropTablesQueries = dropTablesQueries.filter(function (s) { return !s.match(/DROP TABLE __/) });

          let dropTablesQuery = dropTablesQueries.join(' ');

          if (dropTablesQueries && dropTablesQueries.length) {

            let dropTablePromises = [];

            dropTablesQueries.forEach( (dropTablesQuery) => {
              let p = new Promise( (resolve, reject) => {
                console.log(`WebSQL: reset: executing ${dropTablesQuery}...`);
                this.db.transaction( (transaction) => {
                  transaction.executeSql(dropTablesQuery, null, () => {
                    resolve();
                  }, (e) => {
                    console.error(e);
                    reject(e);
                  });
                });
              });
              dropTablePromises.push(p);
            });

            Promise.all(dropTablePromises).then( () => {
              this.version = null;
              console.log(`WebSQL: reset: done.`);
            }).catch( (e) => {
              console.error(e);
              reject(e);
            });
          } else {
            this.version = null;
            console.log(`WebSQL: reset: done.`);
          }
        }).catch( (e) => {
          console.error(e);
          reject(e);
        });
    });
  }

  sqlValue(value) {
    if (value === true) {
      return 1;
    } else if (value === false) {
      return 0;
    } else if (typeof value === "string") {
      return "'" + value.replace(/'/g, "''") + "'";
    } else if (typeof value === "number") {
      return value;
    } else {
      return 'NULL';
    }
  }
}

window.WebSQL = WebSQL;

if (module) module.exports = WebSQL;
