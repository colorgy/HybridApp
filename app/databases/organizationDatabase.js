import WebSQL from '../utils/WebSQL';
import colorgyAPI from '../utils/colorgyAPI';

var migartions = {
  '1.0': 'CREATE TABLE info(ID INTEGER PRIMARY KEY, key TEXT, value TEXT);',
  '1.1': 'CREATE INDEX info_key_index ON info (key);',
  '2.1': 'CREATE TABLE organizations(ID INTEGER PRIMARY KEY, code CHARACTER(255), name CHARACTER(255), short_name CHARACTER(255));',
  '2.1.1': 'CREATE INDEX organizations_code_index ON organizations (code);',
  '2.2': 'CREATE TABLE departments(ID INTEGER PRIMARY KEY, organization_code CHARACTER(255), code CHARACTER(255), name CHARACTER(255), short_name CHARACTER(255));',
  '2.2.1': 'CREATE INDEX departments_code_index ON departments (code);',
  '2.2.2': 'CREATE INDEX departments_organization_code_index ON departments (organization_code);'
}

if (window.sqlitePlugin) {
  var organizationDatabase = new WebSQL(null, null, null, migartions, sqlitePlugin, { name: 'organization.db', location: 2 });
} else {
  var organizationDatabase = new WebSQL('organization', 'organization', 3*1024*1024, migartions);
}

organizationDatabase.migrate();

organizationDatabase.updateData = (orgCode) => {
  var sqlValue = organizationDatabase.sqlValue;

  return colorgyAPI.request({ url: '/organizations.json' }).then( (response) => {
    // Parse the data and construct SQL insert query
    var insertSQLValues = [];
    response.body.forEach(function (org) {

      insertSQLValues.push(`(
        ${sqlValue(org.code)},
        ${sqlValue(org.name)},
        ${sqlValue(org.short_name)}
      )`);
    });

    var insertSQL = `INSERT INTO organizations (
      code,
      name,
      short_name
    ) VALUES ${insertSQLValues.join(', ')}`;

    return insertSQL;

  }).then( (insertSQL) => {
    return organizationDatabase.executeSql('DELETE FROM organizations').then( (r) => {
      r.transaction.executeSql(insertSQL);
    });

  }).then( () => {
    if (orgCode) {
      return colorgyAPI.request({ url: `/organizations/${orgCode}.json` });
    } else {
      return true;
    }

  }).then( (response) => {
    if (response === true) return true;
    if (response.status > 300) throw response;

    var insertSQLValues = [];
    response.body.departments.forEach(function (dep) {

      insertSQLValues.push(`(
        ${sqlValue(orgCode)},
        ${sqlValue(dep.code)},
        ${sqlValue(dep.name)},
        ${sqlValue(dep.short_name)}
      )`);
    });

    var insertSQL = `INSERT INTO departments (
      organization_code,
      code,
      name,
      short_name
    ) VALUES ${insertSQLValues.join(', ')}`;

    return insertSQL;

  }).then( (insertSQL) => {
    if (insertSQL === true) {
      return true;

    } else {
      return organizationDatabase.executeSql('DELETE FROM departments WHERE organization_code = ?', [orgCode]).then( (r) => {
        r.transaction.executeSql(insertSQL);
      });
    }

  }).then( () => {
    return organizationDatabase.executeSql("INSERT OR REPLACE INTO info (ID, key, value) VALUES ((SELECT ID FROM info WHERE key = 'organizations_updated_at'), 'organizations_updated_at', ?)", [(new Date()).getTime()]).then( (r) => {
      if (orgCode) r.transaction.executeSql(`INSERT OR REPLACE INTO info (ID, key, value) VALUES ((SELECT ID FROM info WHERE key = 'organization_${orgCode}_updated_at'), 'organization_${orgCode}_updated_at', ?)`, [(new Date()).getTime()]);
    });
  });
};

organizationDatabase.getOrganizations = () => {
  return organizationDatabase.executeSql("SELECT * FROM info WHERE key = 'organizations_updated_at'").then( (r) => {
    var hasData = (r.results.rows.length > 0);

    if (hasData && (new Date()).getTime() - parseInt(r.results.rows.item(0).value) < 60*60*1000) {
      return organizationDatabase.executeSql("SELECT * FROM organizations");
    } else {
      return organizationDatabase.updateData().then( (r) => {
        return organizationDatabase.executeSql("SELECT * FROM organizations");
      }).catch( (e) => {
        if (hasData) {
          return organizationDatabase.executeSql("SELECT * FROM organizations");
        } else {
          throw e;
        }
      });
    }

  }).then( (r) => {
    var organizations = [];
    if (r.results.rows.length) {
      for (let i=0; i<r.results.rows.length; i++) {
        let row = r.results.rows.item(i);
        row.shortName = row.short_name;
        organizations.push(row);
      }
    }

    return organizations;
  });
};

organizationDatabase.getDepartments = (orgCode) => {
  return organizationDatabase.executeSql(`SELECT * FROM info WHERE key = 'organization_${orgCode}_updated_at'`).then( (r) => {
    var hasData = (r.results.rows.length > 0);

    if (hasData && (new Date()).getTime() - parseInt(r.results.rows.item(0).value) < 60*60*1000) {
      return organizationDatabase.executeSql("SELECT * FROM departments WHERE organization_code = ?", [orgCode]);
    } else {
      return organizationDatabase.updateData(orgCode).then( (r) => {
        return organizationDatabase.executeSql("SELECT * FROM departments WHERE organization_code = ?", [orgCode]);
      }).catch( (e) => {
        if (hasData) {
          return organizationDatabase.executeSql("SELECT * FROM departments WHERE organization_code = ?", [orgCode]);
        } else {
          throw e;
        }
      });
    }

  }).then( (r) => {
    var departments = [];
    if (r.results.rows.length) {
      for (let i=0; i<r.results.rows.length; i++) {
        let row = r.results.rows.item(i);
        row.shortName = row.short_name;
        departments.push(row);
      }
    }

    return departments;
  });
};

window.organizationDatabase = organizationDatabase;

export default organizationDatabase;
